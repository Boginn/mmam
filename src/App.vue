<template>
  <v-app>
    <ScoreBanner
      v-if="isLive"
      :names="matchData.names"
      :score="matchData.score"
      class="ma-0"
    />

    <v-app-bar app class="abcolor " dark v-else>
      <router-link :to="`/`">
        <v-btn :disabled="isMatchday" class="primary">
          {{ selectedClub.name }}
        </v-btn>
      </router-link>
      <span class="text-center ml-5 title font-shadow" v-if="!isMatchday">
        {{ placeInLeague }} in The English League
      </span>
      <span class="text-center ml-5 title font-shadow" v-if="isMatchday">
        {{ matchTitle }}
      </span>
      <ButtonsSmall :routes="routes" :disabled="isMatchday" />
      <v-col class="text-end">
        <v-btn
          class="green darken-3"
          :disabled="isMatchday || isAdvancingDate"
          @click="this.continue"
          ><span v-if="isMatchday"> Match Day</span>
          <span v-else>Continue</span></v-btn
        >
        <span class="text-center ml-5 title font-shadow " v-if="isDeveloper">
          <span class="grey--text"> Date:</span> <b> {{ day }}</b
          ><span class="grey--text"> displayDate:</span>
          <b>{{ displayDate }}</b>
        </span>
        <span class="text-center ml-5 title font-shadow code" v-else>
          <b class="code">{{ displayDate }}</b>
        </span>
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
import simulateMatch from '@/engine/simulateMatch.js';

export default {
  name: 'App',
  components: {
    ButtonsSmall,
    ScoreBanner,
  },
  created() {
    if (!this.live) {
      engine.initialize(this.idCodes.fighter, this.idCodes.club);

      this.date = this.getDate;
      this.displayDate = engine.arrangeDate(this.splitDate);

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
    date: undefined,
    displayDate: null,
  }),

  watch: {
    isPostMatch: function() {
      this.updateDisplayDate();
    },
  },

  computed: {
    isDeveloper() {
      return this.$store.getters.isDeveloper;
    },
    //data
    commission() {
      return this.$store.getters.commission;
    },
    staff() {
      return this.$store.getters.staff;
    },
    roster() {
      return this.$store.getters.roster;
    },
    isPostMatch() {
      return this.$store.getters.isPostMatch;
    },

    league() {
      return this.$store.getters.league;
    },
    schedule() {
      return this.$store.getters.schedule;
    },
    matches() {
      return this.$store.getters.matches;
    },
    idCodes() {
      return data.idCodes;
    },
    selectedClub() {
      return this.getClub(this.$store.getters.selectedClubId);
    },

    //ui
    routes() {
      return data.routes.appbar;
    },
    placeInLeague() {
      const place = this.league.indexOf(this.getClub(this.selectedClubId)) + 1;
      if (place == 1) {
        return `${place}st`;
      } else if (place == 2) {
        return `${place}nd`;
      } else if (place == 3) {
        return `${place}rd`;
      } else {
        return `${place}th`;
      }
    },
    //game
    isAdvancingDate() {
      return this.$store.getters.isAdvancingDate;
    },
    day() {
      // ux
      if (this.isAdvancingDate) {
        return this.$store.getters.day - 1;
      } else {
        return this.$store.getters.day;
      }
    },
    getDate() {
      return this.$store.getters.displayDate;
    },

    splitDate() {
      return this.getDate.toString().split(' ');
    },

    //match
    matchData() {
      return this.$store.getters.matchData;
    },
    isLive() {
      return this.$store.getters.isLive;
    },
    currentMatch() {
      return this.$store.getters.currentMatch;
    },
    isMatchday() {
      return this.$store.getters.isMatchday;
    },
    match() {
      let match;
      this.schedule.forEach((element) => {
        if (element.id == this.currentMatch) {
          match = element;
        }
      });

      return match;
    },
    matchTitle() {
      return `${this.getClub(this.match.clubs[0]).name} vs ${
        this.getClub(this.match.clubs[1]).name
      }`;
    },
  },

  methods: {
    //services
    getClub(id) {
      return this.$store.getters.getClubById(id);
    },
    getFighter(id) {
      return this.$store.getters.getFighterById(id);
    },
    selectClub() {
      this.$store.dispatch('selectClub', this.selectedClubId);
    },
    updateDisplayDate() {
      this.displayDate = engine.arrangeDate(this.getDate.toString().split(' '));
    },

    // game loop
    continue() {
      this.$store.dispatch('continue');
      this.$store.dispatch('setIsPostMatch', false);

      this.updateDisplayDate();

      //check if any fixtures coming up
      this.schedule.forEach((match) => {
        if (match.date > this.day && match.date < this.day + 2) {
          this.$router.push(`/fixtures`);
        }
      });

      //check if npc matches and simulate
      //if
      const npcMatches = this.schedule.filter((match) => match.npc);
      let didYouSimulateAnyMatches = false;
      npcMatches.forEach((match) => {
        if (match.date == this.day) {
          // simulate all non npc matches
          this.simulateMatch(match);
          didYouSimulateAnyMatches = true;
        }
      });

      //fighters recover
      this.$store.dispatch('setRoster', engine.recoverFighters(this.roster));

      this.checkIfMatchday();

      if (didYouSimulateAnyMatches && !this.isMatchday) {
        console.log('I did sims and its not matchday');
        console.log(this.matches);
        // this.continue();
        this.$store.dispatch('setIsPostMatch', true);
      }
      if (didYouSimulateAnyMatches && this.isMatchday) {
        console.log('I did sims on matchday');
        // this.$store.dispatch('continue');
        this.$store.dispatch('setIsPostMatch', true);
      }

      // ux
      let interval;
      if (this.isDeveloper) {
        interval = 50;
      } else {
        interval = this.matchData.timeoutInterval / 2;
      }

      this.$store.dispatch('setIsAdvancingDate', true);
      setTimeout(() => {
        this.$store.dispatch('setIsAdvancingDate', false);
      }, interval);

      //end day
    },

    // database
    checkIfMatchday() {
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
    simulateMatch(match) {
      //tactics, clubs, fighters
      const clubs = [];
      match.clubs.forEach((c) => {
        clubs.push(this.getClub(c));
      });
      const fighters = {
        left: {
          home: this.getFighter(clubs[0].tactic.selection.left),
          away: this.getFighter(clubs[1].tactic.selection.left),
        },
        center: {
          home: this.getFighter(clubs[0].tactic.selection.center),
          away: this.getFighter(clubs[1].tactic.selection.center),
        },
        right: {
          home: this.getFighter(clubs[0].tactic.selection.right),
          away: this.getFighter(clubs[1].tactic.selection.right),
        },
      };
      const judges = {
        left: [],
        center: [],
        right: [],
      };
      for (let i = 0; i < 3; i++) {
        judges.left.push(this.commission[i]);
      }
      for (let i = 3; i < 6; i++) {
        judges.center.push(this.commission[i]);
      }
      for (let i = 6; i < 9; i++) {
        judges.right.push(this.commission[i]);
      }

      const result = simulateMatch.simulateMatch(
        match,
        clubs,
        fighters,
        judges
      );
      console.log(result);
      //commit
      this.$store.dispatch('addMatch', result.result);
      this.$store.dispatch('addClubData', result.homeClubData);
      this.$store.dispatch('addClubData', result.awayClubData);
    },

    //seeding
    generateTactic(clubId) {
      let squad = this.getClub(clubId).squad;

      // squad er array en samt object!?

      // var center = squad[1];
      // var right = squad[2];
      let tactic = new classes.Tactic(clubId);

      tactic.instructions = {
        general: {
          mentality: Math.floor(Math.floor(Math.random() * 3) + 1),
          risk: Math.floor(Math.floor(Math.random() * 3) + 1),
          gamesmanship: Math.floor(Math.floor(Math.random() * 3) + 1),
        },
        left: {
          mentality: Math.floor(Math.floor(Math.random() * 3) + 1),
          risk: Math.floor(Math.floor(Math.random() * 3) + 1),
          gamesmanship: Math.floor(Math.floor(Math.random() * 3) + 1),
        },
        center: {
          mentality: Math.floor(Math.floor(Math.random() * 3) + 1),
          risk: Math.floor(Math.floor(Math.random() * 3) + 1),
          gamesmanship: Math.floor(Math.floor(Math.random() * 3) + 1),
        },
        right: {
          mentality: Math.floor(Math.floor(Math.random() * 3) + 1),
          risk: Math.floor(Math.floor(Math.random() * 3) + 1),
          gamesmanship: Math.floor(Math.floor(Math.random() * 3) + 1),
        },
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

    //eval
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
.code {
  font-family: 'Courier New', Courier, monospace;
}
.close:hover {
  opacity: 0.5;
}
a {
  text-decoration: none;
}
.font-shadow {
  text-shadow: black 1px 1px;
}
.font-shadow-narrow {
  text-shadow: black 0.3px 0.3px;
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
