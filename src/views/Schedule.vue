<template>
  <v-container>
    <v-row>
      <v-col>
        <v-row class="bgcolor pa-0 pl-5 ml-5">
          <v-tab
            v-for="(tab, index) in tabs"
            :key="index"
            class="ml-1 mt-3 pa-2 "
            @click="selectTab(index)"
            v-bind:class="{
              seventh: tabs[index].value,
              sixth: !tabs[index].value,
            }"
            >{{ tab.name }}
          </v-tab>
        </v-row>
        <v-data-table
          :headers="headers"
          :items="schedule"
          :items-per-page="10"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          item-key="name"
          class="elevation-6 seventh ma-5 pa-4 mt-3 fill-width  font-shadow"
        >
          <template v-slot:top> </template>

          <!-- eslint-disable-next-line -->
          <template v-slot:item.clubs[0]="{ item }">
            <router-link :to="`/league/${item.clubs[0]}`" class="table">
              {{ getClub(item.clubs[0]).name }}
            </router-link>
          </template>

          <!-- eslint-disable-next-line -->
          <template v-slot:item.clubs[1]="{ item }">
            <router-link :to="`/league/${item.clubs[1]}`" class="table">
              {{ getClub(item.clubs[1]).name }}
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
  components: {},
  methods: {
    getClub(id) {
      return this.$store.getters.getClubById(id);
    },

    //ui
    selectTab(selection) {
      for (let i = 0; i < this.tabs.length; i++) {
        this.tabs[i].value = false;
      }
      this.tabs[selection].value = true;
    },
  },
  computed: {
    //ui
    isTabClub() {
      return this.tabs[0].value;
    },
    isTabLeague() {
      return this.tabs[1].value;
    },
    isTabArchive() {
      return this.tabs[2].value;
    },

    //
    headers() {
      return data.headers.schedule;
    },
    schedule() {
      let result;
      if (this.isTabClub) {
        result = this.$store.getters.schedule.filter(
          (match) => match.npc == false
        );
      }

      if (this.isTabLeague) {
        result = this.$store.getters.schedule;
      }
      if (this.isTabArchive) {
        result = this.$store.getters.matches;
      }
      return result;
    },
    routes() {
      return data.squadRoutes;
    },

    selectedClub() {
      return this.$store.getters.selectedClubId;
    },
  },
  data: () => ({
    sortBy: 'date',
    sortDesc: false,
    tabs: data.tabs.schedule,
  }),
};
</script>
