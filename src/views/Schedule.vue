<template>
<v-container>
  <v-row>
    <v-col>
<v-data-table
        :headers="headers"
        :items="schedule"
        :items-per-page="10"
                :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        item-key="name"
        class="elevation-6 seventh ma-5 pa-4 mt-8 fill-width  font-shadow"
      >

         <!-- eslint-disable-next-line -->
        <template v-slot:item.clubs[0] ="{ item }">
          <router-link :to="`/league/${item.clubs[0]}`" class="table">
            <v-icon class="mb-1" small>mdi-arrow-top-left</v-icon>
       
       {{getClub(item.clubs[0]).name}}
          </router-link>
        </template>

                 <!-- eslint-disable-next-line -->
        <template v-slot:item.clubs[1] ="{ item }">
          <router-link :to="`/league/${item.clubs[1]}`" class="table">
            <v-icon class="mb-1" small>mdi-arrow-top-left</v-icon>
        {{getClub(item.clubs[1]).name}}
          </router-link>
        </template>


      </v-data-table>
    </v-col>
  </v-row>
</v-container>
</template>

<script>

import data from '@/data/data.js';

export default {
  name: 'Schedule',
  components: {
   
  },
  methods: {
    getClub(id) {
      return this.$store.getters.getClubById(id);
    }
  },
  computed: {
    headers() {
      return data.headers.schedule;
    },
    schedule() {
      return this.$store.getters.schedule;
    },
    routes() {
      return data.squadRoutes;
    },
    selectedClub() {
      return this.$store.getters.selectedClubId;
    },

  },
  data: () =>({
    sortBy: 'date',
    sortDesc: false,
  })
}
</script>
