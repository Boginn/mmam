<template>
  <v-container style="height: 143px;">
    <v-row class="d-flex justify-space-between pl-10 pr-10">
      <span align="center" v-for="(element, index) in rounds" :key="index">
        <div
          class="rounds title font-shadow ma-5"
          v-bind:class="{
            activeRound: round > index,
            'accent--text': round > index,
          }"
        >
          {{ element }}
        </div>
      </span>
    </v-row>
    <v-row class="d-flex justify-center">
      <span class="font-shadow clock d-flex align-center">
        {{ timestamp }}
      </span>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Clock',
  components: {},

  props: {
    timestamp: String,
    rounds: Array,
    round: Number,
  },
};
</script>

<style scoped>
.clock {
  font-size: 22pt;
  font-stretch: expanded;
  /* background: rgb(85, 83, 83); */
  border-radius: 10px;
  margin: 5px;
  margin-right: 50px;
  margin-left: 50px;
}
</style>
