<template>
  <v-container class="mt-16">
    <v-card class="fourth">
      <v-row>
        <v-col>
          <v-row class="d-block pa-5">
            <v-col v-for="club in league" :key="club.id" class="pa-1">
              <div
                class="item font-shadow "
                @click="id = club.id"
                v-bind:class="{
                  selected: club.id == id,
                  excluded: club.id != id && id != undefined,
                }"
                :style="{
                  background: banner(club.color.primary, club.color.secondary),
                }"
              >
                {{ club.name }}
              </div>
            </v-col>
          </v-row>
        </v-col>
        <v-col>
          <v-card-title>
            Welcome to MMA Manager.
          </v-card-title>
          <v-card-text>
            You can press spacebar to continue, play and pause. Some other
            useful info. Maybe a bit of guidance.
          </v-card-text>
          <v-card-text>
            <label class="d-block" for="name">Manager name:</label>
            <input v-model="name" type="text" />
          </v-card-text>
          <v-card-text class="text-center">
            <span v-if="name" class="amber--text font-shadow title">
              {{ name }}</span
            >
            <span v-if="name && id" class="font-shadow title"> of </span>

            <span
              v-if="id"
              class="pa-2 font-shadow title"
              style="border-radius: 4px;"
              :style="{
                backgroundColor: getClub(id).color.primary,
                color: getClub(id).color.secondary,
              }"
            >
              {{ getClub(id).name }}
            </span>
          </v-card-text>
          <v-card-text>
            <v-btn
              style="width: 100%"
              class="seventh"
              @click="$emit('setUser', { name: name, id: id })"
              >Proceed</v-btn
            >
          </v-card-text>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'Initialize',

  props: {
    league: Array,
  },

  data: () => ({
    name: undefined,
    id: undefined,
  }),

  methods: {
    getClub(id) {
      return this.$store.getters.getClubById(id);
    },
    banner(primary, secondary) {
      return `linear-gradient(140deg,  ${primary}, ${primary}, ${primary},${primary}, ${primary}, ${secondary}, ${secondary})`;
    },
  },
};
</script>

<style scoped>
.item {
  padding: 15px;
  border-radius: 4px;

  cursor: pointer;
}
.item:hover {
  border: 1px solid white;
}
.selected {
  border: 1px solid white;
}
.excluded {
  opacity: 0.5;
}
input[type='text'],
select {
  padding: 10px;
  color: white;
  border: 1px solid white;
  border-radius: 4px;
  width: 100%;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
