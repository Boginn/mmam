<template>
  <v-col style="height: 143px;" class="d-flex align-center justify-center">
    <!-- start round / get on -->

    <v-row>
      <v-col>
        <v-btn
          class="controlBtn lime darken-3"
          @click="$emit('startRound')"
          v-if="isBetweenRounds && !isFullTime"
        >
          <div>
            Start
          </div>
          <div>
            Round
          </div>
        </v-btn>
        <v-btn
          class="controlBtn success"
          :disabled="isDisabled || isFullTime"
          @click="$emit('getOn')"
          v-else
        >
          <v-icon class="mb-1" small>mdi-play</v-icon>
        </v-btn>
        <!-- end match / pause -->
        <v-btn
          class="controlBtn teal darken-3 "
          v-if="isFullTime"
          @click="$emit('endMatch')"
        >
          End Match
        </v-btn>
        <v-btn
          class="controlBtn fifth "
          v-if="!isFullTime"
          :disabled="isPaused"
          @click="$emit('togglePause')"
        >
          <v-icon class="mb-1 d-flex align-center" small>mdi-pause</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="pb-8">
        <v-btn
          small
          class="seventh pa-5 ma-1 "
          :disabled="!isFast"
          @click="$emit('setIntervalFast')"
          >+</v-btn
        >

        <v-btn
          small
          class="seventh pa-5 ma-1 "
          :disabled="isFast"
          @click="$emit('setIntervalSlow')"
          >-</v-btn
        >
        <v-spacer></v-spacer>
        <span class="d-flex justify-center">
          <v-btn
            class="pa-5 ma-1 "
            v-bind:class="{
              'grey--text': !isRings,
              fourth: isRings,
            }"
            small
            @click="$emit('setRings')"
            >rings</v-btn
          >

          <v-btn
            class="pa-5 ma-1 "
            v-bind:class="{
              'grey--text ': !isCommentary,
              indigo: isCommentary,
            }"
            small
            @click="$emit('setCommentary')"
            >comm</v-btn
          >
        </span>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
export default {
  name: 'Control',
  components: {},

  props: {
    isFullTime: Boolean,
    isDisabled: Boolean,
    isPaused: Boolean,
    isFast: Boolean,
    isBetweenRounds: Boolean,
  },

  computed: {
    isCommentary() {
      return this.$store.getters.matchData.isCommentary;
    },
    isRings() {
      return this.$store.getters.matchData.isRings;
    },
  },
};
</script>

<style scoped>
.commentary {
  height: 650px;

  overflow-y: auto;
}
.controlBtn {
  font-size: 12pt;
  padding: 45px !important;
  margin: 5px !important;
}
</style>
