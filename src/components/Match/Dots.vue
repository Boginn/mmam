<template>
  <span>
    <v-container v-if="!isFullTime">
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

  watch: {
    matchDataIsHomeAttack: function() {
      console.log('WATCHING IS HOME ATTACK!!!!!!!!!!!!!!!!!!');
    },
  },

  computed: {
    matchDataIsHomeAttack() {
      return this.$store.getters.matchData.isHomeAttack;
    },
    isFullTime() {
      return this.$store.getters.matchData.isFullTime;
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
