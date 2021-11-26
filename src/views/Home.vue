<template>
  <v-container>
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
import data from '@/data/data.js';

export default {
  name: 'Home',
  components: {
    Buttons,
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
.dott {
  width: 25px;
  height: 25px;

  border-radius: 100%;

  border: 1px solid black;
  background: red;
}

.attack {
  margin-top: 40px;

  animation: varName03 1s linear;

  z-index: 2;
}
.defend {
  margin-top: -10px;

  animation: varName04 1s linear;
}
.positions-match {
  width: 170px;
  height: 170px;
  /* margin: -35px;
  margin-left: 25px;
  margin-right: 25px;
  padding-top: 10px; */
  margin: 25px;
  padding-top: 50px;

  /* animation: varName02 1s linear; */

  background-color: rgb(80, 76, 21);
  border-radius: 100%;
}

@keyframes varName01 {
  30% {
    /* color: ${colours.fifth}; */
  }
  50% {
    /* color: white; */
  }
  100% {
    /* color: ${colours.fifth}; */
  }
}
@keyframes varName02 {
  from {
    padding-top: 0px;
    /* color: ${colours.fifth}; */
  }
  to {
    padding-top: 50px;
    /* color: white; */
  }
}
@keyframes varName03 {
  from {
    margin-top: 0px;
    /* color: ${colours.fifth}; */
  }
  to {
    margin-top: 40px;
    /* color: white; */
  }
}
@keyframes varName04 {
  from {
    margin-top: 50px;
    /* color: ${colours.fifth}; */
  }
  to {
    margin-top: -10px;
    /* color: white; */
  }
}
</style>
