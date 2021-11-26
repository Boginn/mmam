<template>
  <span>
    <v-container v-if="!isFullTime && !isBetweenRounds && !isPaused">
      <HomeInitiativeDots :colors="colors" v-if="isHomeAttack" />
      <AwayInitiativeDots :colors="colors" v-else />
    </v-container>
  </span>
</template>

<script>
export default {
  name: 'Dots',

  components: {
    HomeInitiativeDots: () =>
      import('@/animation/match/HomeInitiativeDots.vue'),
    AwayInitiativeDots: () =>
      import('@/animation/match/AwayInitiativeDots.vue'),
  },

  props: {
    colors: Object,
    isHomeAttack: Boolean,
  },

  data: () => ({}),

  computed: {
    isPaused() {
      return this.$store.getters.matchData.isPaused;
    },
    isFullTime() {
      return this.$store.getters.matchData.isFullTime;
    },
    isBetweenRounds() {
      return this.$store.getters.matchData.isBetweenRounds;
    },
  },

  methods: {},
};
</script>

<style scoped>
#c {
  height: 200px;
  width: 400px;
  border: 1px solid gray;
}
</style>
