<template>
<v-container>
  <Buttons :routes="routes" />
  <v-row>
    <v-col>
<v-data-table
        :headers="headers"
        :items="squad"
        :items-per-page="10"
        item-key="name"
        class="elevation-6 seventh ma-5 pa-4 mt-8 fill-width  font-shadow"
      >

         <!-- eslint-disable-next-line -->
        <template v-slot:item.personal.name="{ item }">
          <router-link :to="`/squad/${item.id}`" class="table">
            <v-icon class="mb-1" small>mdi-arrow-top-left</v-icon>
        {{ item.personal.name }}
          </router-link>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</v-container>
</template>

<script>
import Buttons from "@/components/Buttons.vue";
import data from '@/data/data.js';

export default {
  name: 'Squad',
  components: {
   Buttons,
  },
  computed: {
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
        playerClubId() {
      return this.$store.getters.selectedClubId;
    },
    club() {
      return this.getClub(this.playerClubId);
    },
    routes() {
      return data.routes.squad;
    },

  },
  data: () =>({
    
  }),

    methods: {
    getClub(id) {
      return this.$store.getters.getClubById(id);
    },
    getFighter(id) {
      return this.$store.getters.getFighterById(id);
    },

    setTactic() {},
  },
}
</script>
