<template>
  <div v-if="isShowing">
    <v-row class="d-flex justify-center ">
      <v-card class="defend dott" :style="homeStyle"></v-card>
    </v-row>
    <v-row class="d-flex justify-center ">
      <v-card class="attack dott" :style="awayStyle"></v-card>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'AwayInitiativeDots',

  mounted() {
    this.toggleDots();
  },

  props: {
    colors: Object,
  },

  data: () => ({
    isShowing: true,
  }),

  computed: {
    homeStyle() {
      return {
        background: this.colors.home.primary,
        border: `1px solid ${this.colors.home.secondary}`,
      };
    },
    awayStyle() {
      return {
        background: this.colors.away.primary,
        border: `1px solid ${this.colors.away.secondary}`,
      };
    },
    timeoutInterval() {
      return this.$store.getters.timeoutInterval;
    },
  },

  methods: {
    toggleDots() {
      setTimeout(() => {
        this.isShowing = false;
        setTimeout(() => {
          this.isShowing = true;
          this.toggleDots();
        }, 1000);
      }, this.timeoutInterval + 1000);
    },
  },
};
</script>

<style scoped>
.dott {
  width: 25px;
  height: 25px;

  border-radius: 100%;
}

.attack {
  margin-bottom: 30px;

  animation: attackAnimation 1s linear;

  z-index: 2;
}
.defend {
  margin-top: 30px;
  margin-bottom: -10px;

  animation: defendAnimation 1s linear;
}
@keyframes attackAnimation {
  from {
    margin-bottom: 70px;

    /* color: ${colours.fifth}; */
  }
  to {
    margin-bottom: 30px;

    /* color: white; */
  }
}
@keyframes defendAnimation {
  from {
    margin-bottom: 40px;
    /* color: ${colours.fifth}; */
  }
  to {
    margin-bottom: -10px;
    /* color: white; */
  }
}
</style>
