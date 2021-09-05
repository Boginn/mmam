<template>
    <v-row class="mt-1 text-center" align="center" justify="center">
      <v-col>
        <v-col class="score sixth">
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
      </v-col>
    </v-row>
</template>

<script>
export default {
  name: "ScoreBanner",
  components: {},

  props: {
    score: Object,
    names: Object,


  },

}
</script>

<style >
.score {
  border-radius: 10px;
  font-size: 16pt;

  box-shadow: 0px 3px 3px rgb(65, 62, 62);
}
</style>
