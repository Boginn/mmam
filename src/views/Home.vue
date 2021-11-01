<template>
  <v-container>
    <!-- <Dots v-if="isDeveloper" /> -->
    <Buttons :routes="routes" />
    <v-col>
      <v-divider class="mt-4"></v-divider>
      <h4 class="text-center mt-2 primary--text font-shadow">
        <b>{{ managerName }}</b
        >. Manager of

        <b> {{ selectedClub.name }}</b> for {{ day }} days.
      </h4>
    </v-col>
  </v-container>
</template>

<script>
// @ is an alias to /src
import Buttons from '@/components/Buttons.vue';
// import Dots from '@/components/Dots.vue';
import data from '@/data/data.js';

export default {
  name: 'Home',
  components: {
    Buttons,
    // Dots,
  },

  data: () => ({}),

  computed: {
    routes() {
      return data.routes.home;
    },
    managerName() {
      return this.$store.getters.managerName;
    },
    day() {
      return this.$store.getters.day;
    },
    selectedClub() {
      return this.getClub(this.$store.getters.selectedClubId);
    },
    isDeveloper() {
      return this.$store.getters.isDeveloper;
    },
  },

  methods: {
    getClub(id) {
      return this.$store.getters.getClubById(id);
    },
  },
};
</script>

<style scoped>
#scetch {
  padding: 20px;
  margin: 20px;
}

#c {
  height: 200px;
  width: 400px;
  border: 1px solid gray;
}
</style>
