<template>
  <v-col class="font-shadow">
    <v-row class="white--text pl-2 mb-1 mt-1  pa-1 grey darken-3">
      <span class=" white--text">
        Mentality
      </span>
      <v-spacer></v-spacer>
      <v-btn
        x-small
        elevation="-1"
        class="instructions"
        @click="$emit('setMentality', 3)"
        v-bind:class="{
          'green black--text': instructions.mentality == 3,
          'grey darken-3': instructions.mentality != 3,
        }"
        >Attack</v-btn
      >
      <v-btn
        x-small
        elevation="-1"
        class="instructions"
        @click="$emit('setMentality', 2)"
        v-bind:class="{
          'green black--text': instructions.mentality == 2,
          'grey darken-3': instructions.mentality != 2,
        }"
        >Defend
      </v-btn>
      <v-btn
        x-small
        elevation="-1"
        class="instructions"
        @click="$emit('setMentality', 1)"
        v-bind:class="{
          'green black--text': instructions.mentality == 1,
          'grey darken-3': instructions.mentality != 1,
        }"
        >Contain
      </v-btn>
    </v-row>
    <v-row class="white--text pl-2 mb-1 mt-1 pa-1 grey darken-3">
      <span class=" white--text">
        Risk
      </span>
      <v-spacer></v-spacer>
      <v-btn
        x-small
        elevation="-1"
        class="instructions"
        @click="$emit('setRisk', 3)"
        v-bind:class="{
          'green black--text': instructions.risk == 3,
          'grey darken-3': instructions.risk != 3,
        }"
        >Reckless</v-btn
      >
      <v-btn
        x-small
        elevation="-1"
        class="instructions"
        @click="$emit('setRisk', 2)"
        v-bind:class="{
          'green black--text': instructions.risk == 2,
          'grey darken-3': instructions.risk != 2,
        }"
        >Normal
      </v-btn>
      <v-btn
        x-small
        elevation="-1"
        class="instructions"
        @click="$emit('setRisk', 1)"
        v-bind:class="{
          'green black--text': instructions.risk == 1,
          'grey darken-3': instructions.risk != 1,
        }"
        >Safe
      </v-btn>
    </v-row>
    <v-row class="white--text pl-2 mb-1 mt-1 pa-1 grey darken-3">
      <span class=" white--text">
        Gamesmanship
      </span>
      <v-spacer></v-spacer>
      <v-btn
        x-small
        elevation="-1"
        class="instructions"
        @click="$emit('setGamesmanship', 3)"
        v-bind:class="{
          'green black--text': instructions.gamesmanship == 3,
          'grey darken-3': instructions.gamesmanship != 3,
        }"
        >Dirty</v-btn
      >
      <v-btn
        x-small
        elevation="-1"
        class="instructions"
        @click="$emit('setGamesmanship', 2)"
        v-bind:class="{
          'green black--text': instructions.gamesmanship == 2,
          'grey darken-3': instructions.gamesmanship != 2,
        }"
        >Neutral
      </v-btn>
      <v-btn
        x-small
        elevation="-1"
        class="instructions"
        @click="$emit('setGamesmanship', 1)"
        v-bind:class="{
          'green black--text': instructions.gamesmanship == 1,
          'grey darken-3': instructions.gamesmanship != 1,
        }"
        >Clean
      </v-btn>
    </v-row>
  </v-col>
</template>

<script>
export default {
  name: 'Instructions',
  props: {
    instructions: Object,
  },
};
</script>
