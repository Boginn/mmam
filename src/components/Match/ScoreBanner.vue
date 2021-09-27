<template>
  <v-app-bar app :style="{ backgroundImage: gradientBanner }">
    <v-col class="text-center" style="font-size: 16pt;">
      <v-row>
        <v-col>
          {{ names.home }}
        </v-col>
        <v-col> {{ score.home }} - {{ score.away }} </v-col>
        <v-col>
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
  },

  data() {
    return {
      homeColor: '#496F5D', // send in color from each team here
      awayColor: '#5E6019',
    };
  },
  computed: {
    gradientBanner() {
      return `linear-gradient(90deg, ${this.homeColor}, ${this.homeColor}, ${this.awayColor}, ${this.awayColor})`;
    },
  },
};
</script>
