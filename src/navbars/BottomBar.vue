<template>
  <v-bottom-navigation app style="width: 100%">
    <!-- Various continue buttons -->

    <span
      v-if="!isMatchday"
      @click="cont()"
      class="continue-btn font-shadow green darken-3"
      v-bind:class="{
        'grey darken-3 grey--text': isAdvancingDate,
      }"
    >
      <h2 class="font-shadow">Continue</h2>
    </span>

    <!-- tactics before match -->
    <span
      v-if="isMatchday && !isLive"
      @click="cont()"
      class="continue-btn font-shadow"
      v-bind:class="{
        'green darken-3 white--text': checkTactic(),
        'cyan darken-3 yellow--text': !checkTactic(),
      }"
    >
      <h2 class="font-shadow" v-if="checkTactic()">Proceed to Match</h2>
      <h2 class="font-shadow" v-else>Match Day</h2>
    </span>

    <!-- match continue buttons -->
    <span v-if="isLive" class="continue-btn">
      <!-- Match/startRound() -->
      <span
        v-if="isBetweenRounds && !isFullTime"
        @click="toggleControlStartRound()"
        class="continue-btn font-shadow lime darken-3"
      >
        <h2 class="font-shadow">Start Round</h2>
      </span>

      <span
        v-if="!isDisabled && !isBetweenRounds && !isFullTime"
        @click="toggleControlGetOn()"
        class="continue-btn font-shadow"
        v-bind:class="{
          'green darken-3 white--text': isPaused,
          'fifth darken-3 white--text': !isPaused,
        }"
      >
        <v-icon class="mb-1">mdi-play</v-icon>
      </span>

      <span
        v-if="isDisabled && !isBetweenRounds && !isFullTime"
        @click="toggleControlTogglePause()"
        class="continue-btn font-shadow"
        v-bind:class="{
          'green darken-3 white--text': isPaused,
          'fifth darken-3 white--text': !isPaused,
        }"
      >
        <v-icon class="mb-1 d-flex align-center">mdi-pause</v-icon>
      </span>

      <span
        v-if="isFullTime"
        @click="toggleControlEndMatch()"
        class="continue-btn font-shadow teal darken-3"
      >
        <h2 class="font-shadow">End Match</h2>
      </span>
    </span>
  </v-bottom-navigation>
</template>

<script>
export default {
  name: 'BottomBar',
  components: {},

  props: {
    selectedClubId: Number,
  },

  created() {
    window.addEventListener('keydown', (e) => this.keyPress(e));
  },

  computed: {
    selectedClub() {
      return this.getClub(this.$store.getters.selectedClubId);
    },

    isFullTime() {
      return this.$store.getters.matchData.isFullTime;
    },
    isBetweenRounds() {
      return this.$store.getters.matchData.isBetweenRounds;
    },
    isDisabled() {
      return this.$store.getters.matchData.isDisabled;
    },
    isMatchday() {
      return this.$store.getters.isMatchday;
    },
    isLive() {
      return this.$store.getters.isLive;
    },
    isPaused() {
      return this.$store.getters.isPaused;
    },
    isDeveloper() {
      return this.$store.getters.isDeveloper;
    },
    isAdvancingDate() {
      return this.$store.getters.isAdvancingDate;
    },

    controlStartRound() {
      return this.$store.getters.control.startRound;
    },
    controlGetOn() {
      return this.$store.getters.control.getOn;
    },
    controlEndMatch() {
      return this.$store.getters.control.endMatch;
    },
    controlTogglePause() {
      return this.$store.getters.control.togglePause;
    },
  },
  data: () => ({}),

  methods: {
    cont() {
      this.$emit('continue');
    },
    getClub(id) {
      return this.$store.getters.getClubById(id);
    },

    checkTactic() {
      console.log(this.selectedClub);
      if (this.selectedClub.tactic == undefined) {
        return false;
      }
      if (
        this.selectedClub.tactic.instructions.general.mentality &&
        this.selectedClub.tactic.instructions.general.risk &&
        this.selectedClub.tactic.instructions.general.gamesmanship &&
        this.selectedClub.tactic.selection.left &&
        this.selectedClub.tactic.selection.center &&
        this.selectedClub.tactic.selection.right
      ) {
        console.log('true');
        return true;
      } else {
        console.log('false');
        return false;
      }
    },

    //ui
    keyPress(e) {
      // timeout here for the islive stuff
      if (e.code == 'Space') {
        e.preventDefault();
        console.log(this.isBusy);
        if (!this.isBusy) {
          this.$store.dispatch('setIsBusy', true);

          if (this.isLive) {
            if (this.isBetweenRounds) {
              this.$store.dispatch('toggleControlStartRound');
            }
            if (!this.isDisabled && !this.isBetweenRounds && !this.isFullTime) {
              this.$store.dispatch('toggleControlGetOn');
            }
            if (this.isDisabled && !this.isBetweenRounds && !this.isFullTime) {
              this.$store.dispatch('toggleControlTogglePause');
            }
            if (this.isFullTime) {
              this.$store.dispatch('toggleControlEndMatch');
            }
          } else {
            this.$emit('continue');
          }
          setTimeout(() => {
            this.$store.dispatch('setIsBusy', false);
          }, 250);
        }
      }
    },

    toggleControlStartRound() {
      this.$store.dispatch('toggleControlStartRound');
    },
    toggleControlGetOn() {
      this.$store.dispatch('toggleControlGetOn');
    },
    toggleControlTogglePause() {
      this.$store.dispatch('toggleControlTogglePause');
    },
    toggleControlEndMatch() {
      this.$store.dispatch('toggleControlEndMatch');
    },
  },
};
</script>
