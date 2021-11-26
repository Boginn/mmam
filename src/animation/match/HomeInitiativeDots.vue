<template>
  <div v-if="isShowing">
    <!-- <v-btn @click="isShowing = false">asdf</v-btn> -->
    <v-row class="d-flex justify-center ">
      <v-card class="attack dott" :style="homeStyle"></v-card>
    </v-row>
    <v-row class="d-flex justify-center ">
      <v-card class="defend dott" :style="awayStyle"></v-card>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'HomeInitiativeDots',

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
  margin-top: 70px;

  animation: attackAnimation 1s linear;

  z-index: 2;
}
.defend {
  margin-top: -10px;

  animation: defendAnimation 1s linear;
}
@keyframes attackAnimation {
  from {
    margin-top: 30px;
    /* color: ${colours.fifth}; */
  }
  to {
    margin-top: 70px;
    /* color: white; */
  }
}
@keyframes defendAnimation {
  from {
    margin-top: 60px;
    /* color: ${colours.fifth}; */
  }
  to {
    margin-top: -10px;
    /* color: white; */
  }
}
</style>
