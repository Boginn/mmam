<template>
  <v-container>
    <v-row class="justify-center">
      <div>
        <ButtonsSmall :routes="routes" />
      </div>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table
          fixed-header
          :headers="headers"
          :items="squad"
          :items-per-page="10"
          item-key="name"
          :style="{ backgroundImage: banner }"
          class="elevation-6  ma-5 pa-4 mt-8 fill-width  font-shadow"
          :hide-default-footer="true"
        >
          <template v-slot:top> </template>
          <!-- eslint-disable-next-line -->
          <template v-slot:header.personal.name="{ header }">
            <h1 class="font-shadow">
              {{ getClub(id).name }}
            </h1>
          </template>
          <!-- eslint-disable-next-line -->
          <template v-slot:item.personal.name="{ item }">
            <router-link
              :to="`/roster/${item.id}`"
              class="name-in-table title font-shadow"
              :style="{
                color: getClub(id).color.secondary,
              }"
            >
              {{ item.personal.name }}
            </router-link>
          </template>
          <!-- eslint-disable-next-line -->
          <template v-slot:item.type="{ item }">
            {{ typeOfFighter(item) }}
          </template>
          <!-- eslint-disable-next-line -->
          <template v-slot:item.personal.nationality="{ item }">
            <img
              :src="imageSource(item)"
              width="16"
              height="12"
              :alt="item.personal.nationality"
            />
          </template>
          <!-- eslint-disable-next-line -->
          <template v-slot:item.fieldable="{ item }">
            <span class="red pa-1" v-if="!item.fieldable">
              INJ
            </span>
            <span
              class="warning pa-1"
              v-if="item.condition < 70 && item.fitness < 70"
            >
              INJ
            </span>
          </template>
          <!-- eslint-disable-next-line -->
          <template v-slot:item.condition="{ item }">
            <b
              class="font-shadow "
              v-bind:class="{
                'red--text': item.condition < 50,
                'yellow--text': item.condition < 75 && item.condition >= 50,
                'green--text': item.condition >= 75,
              }"
            >
              {{ item.fitness }}
            </b>
          </template>
          <!-- eslint-disable-next-line -->
          <template v-slot:item.fitness="{ item }">
            <b
              v-bind:class="{
                'red--text': item.fitness < 50,
                'yellow--text': item.fitness < 75 && item.fitness >= 50,
                'green--text': item.fitness >= 75,
              }"
            >
              {{ item.fitness }}
            </b>
          </template>

          <!-- eslint-disable-next-line -->
          <template v-slot:item.appearances.season.league="{ item }">
            {{ item.appearances.season.league }}
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ButtonsSmall from '@/components/ButtonsSmall.vue';
import data from '@/data/data.js';
import engine from '@/engine/engine.js';

export default {
  name: 'Squad',
  components: {
    ButtonsSmall,
  },

  created() {
    if (!this.$route.params.id) {
      this.id = this.selectedClubId;
      this.club = this.getClub(this.selectedClubId);
    } else {
      this.id = this.$route.params.id;
      this.club = this.getClub(this.id);
    }
  },

  data: () => ({
    id: undefined,
    club: undefined,
  }),

  computed: {
    banner() {
      return `linear-gradient(-3deg,  ${
        this.getClub(this.id).color.primary
      } 78%,  ${this.getClub(this.id).color.secondary})`;
    },

    headers() {
      return data.headers.squad;
    },
    squad() {
      var squad = [];
      this.club.squad.forEach((element) => {
        squad.push(this.getFighter(element));
      });
      return squad;
    },
    selectedClubId() {
      return this.$store.getters.selectedClubId;
    },
    // club() {
    //   return this.getClub(this.selectedClubId);
    // },
    routes() {
      return data.routes.squad;
    },
  },

  methods: {
    imageSource(item) {
      return engine.countryCode(item.personal.nationality);
    },
    getClub(id) {
      return this.$store.getters.getClubById(id);
    },
    getFighter(id) {
      return this.$store.getters.getFighterById(id);
    },
    typeOfFighter(fighter) {
      return engine.typeOfFighter(fighter);
    },

    setTactic() {},
  },
};
</script>

<style scoped>
.name-in-table:hover {
  color: white !important;
}
</style>
