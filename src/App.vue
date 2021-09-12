<template>
  <v-app>
    <ScoreBanner v-if="isLive" :names="names" :score="score" class="ma-0" />

    <v-app-bar app class="abcolor " dark v-else>
      <router-link :to="`/`">
        <v-btn :disabled="isMatchday" class="primary">
          {{ selectedClub.name }}
        </v-btn>
      </router-link>
      <ButtonsSmall :routes="routes" :disabled="isMatchday" />
      <v-col class="text-end">
        <v-btn class="warning" :disabled="isMatchday" @click="this.continue"
          ><span v-if="isMatchday"> Match Day</span>
          <span v-else>Day: {{ day }} Continue</span></v-btn
        >
      </v-col>
    </v-app-bar>

    <v-main class="bgcolor">
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import classes from '@/data/classes.js';
import engine from '@/engine/engine.js';
import data from '@/data/data.js';
import ButtonsSmall from '@/components/ButtonsSmall.vue';
import ScoreBanner from '@/components/Match/ScoreBanner.vue';
import matchData from '@/data/matchData.js';

export default {
  name: 'App',
  components: {
    ButtonsSmall,
    ScoreBanner,
  },
  created() {
    if (!this.live) {
      engine.initialize(this.idCodes.fighter, this.idCodes.club);

      this.setRoster(this.selectedRoster);
      this.setLeague(this.selectedLeague);
      this.setCommission();
      this.setStaff();
      this.selectClub();

      engine.seedRosterToTeams(this.league, this.roster); // temp
      this.setTactics();

      const schedule = engine.seedSchedule(this.league, this.idCodes.match);
      this.setSchedule(schedule);
      this.$store.dispatch('setLive', true);
    }
  },

  data: () => ({
    selectedClubId: 1001,
    selectedLeague: data.clubs.england,
    selectedRoster: data.fighters.roster,
  }),

  computed: {
    commission() {
      return this.$store.getters.commission;
    },
    staff() {
      return this.$store.getters.staff;
    },
    isLive() {
      return this.$store.getters.isLive;
    },
    currentMatch() {
      return this.$store.getters.currentMatch;
    },
    roster() {
      return this.$store.getters.roster;
    },
    day() {
      return this.$store.getters.day;
    },
    isMatchday() {
      return this.$store.getters.isMatchday;
    },
    league() {
      return this.$store.getters.league;
    },
    schedule() {
      return this.$store.getters.schedule;
    },
    routes() {
      return data.routes.appbar;
    },
    idCodes() {
      return data.idCodes;
    },

    selectedClub() {
      return this.getClub(this.$store.getters.selectedClubId);
    },

    score() {
      return this.$store.getters.score;
    },
    names() {
      return this.$store.getters.names;
    },
  },

  methods: {
    //services

    getClub(id) {
      return this.$store.getters.getClubById(id);
    },
    selectClub() {
      this.$store.dispatch('selectClub', this.selectedClubId);
    },
    checkIfMatchday() {
      this.schedule.forEach((match) => {
        if (match.date == this.day) {
          // simulate all non npc matches
        }
      });

      // find non npc match
      const playerMatch = this.schedule.filter(
        (match) => !match.npc && match.date == this.day
      );
      if (playerMatch.length) {
        this.$store.dispatch('setIsMatchday', true);

        this.$store.dispatch('setCurrentMatch', playerMatch[0].id);

        this.$router.push(`/tactics`);
      }
    },

    //seeding
    generateTactic(clubId) {
      var squad = this.getClub(clubId).squad;

      // squad er array en samt object!?

      // var center = squad[1];
      // var right = squad[2];
      var tactic = new classes.Tactic(clubId);

      tactic.instructions = {
        mentality: Math.floor(Math.floor(Math.random() * 3) + 1),
        risk: Math.floor(Math.floor(Math.random() * 3) + 1),
        gamesmanship: Math.floor(Math.floor(Math.random() * 3) + 1),
      };

      tactic.selection = {
        left: squad[0],
        center: squad[1],
        right: squad[2],
      };

      return tactic;
    },

    setTactics() {
      this.league.forEach((club) => {
        if (club.npc == true) {
          var x = this.generateTactic(club.id);
          console.log(x);
          this.$store.dispatch('setTactics', this.generateTactic(club.id));
        }
      });
      console.log(this.league);
    },

    setLeague(league) {
      this.$store.dispatch('setLeague', league);
      this.$store.dispatch('setClubId', this.idCodes.club + this.league.length);

      // console.log(this.$store.getters.nextClubId);
    },

    setRoster() {
      this.$store.dispatch('setRoster', this.selectedRoster);
      this.$store.dispatch(
        'setFighterId',
        this.idCodes.fighter + this.roster.length
      );
    },

    setCommission() {
      this.$store.dispatch('setCommission', data.commission.judges);
      this.$store.dispatch(
        'setCommissionId',
        this.idCodes.commission + this.commission.length
      );
    },

    setStaff() {
      this.$store.dispatch('setStaff', data.staff.coaches);
      this.$store.dispatch('setStaffId', this.idStaffClub + this.staff.length);
    },

    setSchedule(schedule) {
      this.$store.dispatch('setSchedule', schedule);
      this.$store.dispatch(
        'setMatchId',
        this.idCodes.match + this.schedule.length
      );
    },

    // game loop
    continue() {
      this.$store.dispatch('continue');

      this.checkIfMatchday();

      //end day
    },

    test() {
      console.log(matchData.engage.closeDistance[0].value);
      var functionName = 'this.' + matchData.engage.closeDistance[0].value;
      eval(functionName)('jo');
    },
    grapple(mfg) {
      console.log(mfg);
    },
  },
};
</script>

<style>
.close:hover {
  opacity: 0.5;
}
a {
  text-decoration: none;
}
.font-shadow {
  text-shadow: black 1px 1px;
}

::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 10px;
}
::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background: rgba(245, 245, 220, 0.253);
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(245, 245, 220, 0.692);
}
::-webkit-scrollbar-corner {
  opacity: 0;
}
</style>
