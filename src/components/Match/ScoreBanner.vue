<template>
    <v-app-bar app :style="{ backgroundImage: createBackgroundString }">
        <v-col class="score text-center" >
          <v-row>
            <v-col>
              {{names.home}}
            </v-col>
            <v-col> {{ score.home }} - {{ score.away }} </v-col>
            <v-col>
              {{names.away}}
            </v-col>
          </v-row>
      </v-col>
        </v-app-bar>
</template>

<script>
export default {
  name: "ScoreBanner",
  components: {},

  props: {
    score: Object,
    names: Object,


  },

  data() {
    return {
      
      homeColor: '#496F5D', // send in color from each team here
      awayColor: '#5E6019'
    }
  },
  computed: {
    createBackgroundString() {
      return `linear-gradient(90deg, ${this.homeColor}, ${this.homeColor}, ${this.awayColor}, ${this.awayColor})`;
    }
  }

}
</script>

<style >
.score {
  font-size: 16pt;
  /* border-radius: 10px;

  box-shadow: 0px 3px 3px rgb(65, 62, 62); */
}
</style>
