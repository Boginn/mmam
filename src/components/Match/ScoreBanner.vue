<template>
  <v-app-bar app :style="{ backgroundImage: gradientBanner }">
    <v-col class="text-center" style="font-size: 16pt;">
      <v-row>
        <v-col class="homeSecondary--text font-shadow">
          {{ names.home }}
        </v-col>
        <v-col> {{ score.home }} - {{ score.away }} </v-col>
        <v-col class="awaySecondary--text font-shadow">
          {{ names.away }}
        </v-col>
      </v-row>
    </v-col>
  </v-app-bar>
</template>

<script>
export default {
  name: 'ScoreBanner',
  components: {},

  props: {
    score: Object,
    names: Object,
    colors: Object,
  },

  data() {
    return {
      home: this.colors.home,
      away: this.colors.away,
    };
  },
  computed: {
    gradientBanner() {
      return `linear-gradient(90deg, ${this.home.primary}, ${this.home.primary}, ${this.away.primary}, ${this.away.primary})`;
    },
  },
};
</script>
