<template>
  <v-col style="height: 143px;" class="d-flex align-center justify-center">
    <!-- start round / get on -->

    <v-row>
      <v-col>
        <v-btn
          class="lime darken-3 ma-2"
          :disabled="isFullTime"
          @click="$emit('startRound')"
          v-if="isBetweenRounds"
        >
          Start Round
        </v-btn>
        <v-btn
          class="success"
          :disabled="isDisabled || isFullTime"
          @click="$emit('getOn')"
          v-else
        >
          Get on
        </v-btn>
        <!-- end match / pause -->
        <v-btn
          class="teal darken-3 "
          v-if="isFullTime"
          @click="$emit('endMatch')"
        >
          End Match
        </v-btn>
        <v-btn
          class="fifth"
          v-if="!isFullTime"
          :disabled="isPaused"
          @click="$emit('togglePause')"
        >
          Pause
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn
          small
          class="seventh"
          :disabled="!isFast"
          @click="$emit('setIntervalFast')"
          >+</v-btn
        >

        <v-btn
          small
          class="seventh"
          :disabled="isFast"
          @click="$emit('setIntervalSlow')"
          >-</v-btn
        >

        <v-btn
          v-bind:class="{
            'grey--text': !isCommentary,
          }"
          small
          class="seventh"
          @click="$emit('setCommentary')"
          >commentary</v-btn
        >
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
    isCommentary: Boolean,
  },
};
</script>

<style scoped>
.commentary {
  height: 650px;

  overflow-y: auto;
}
</style>
