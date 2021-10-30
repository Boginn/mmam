<template>
  <v-app>
    <ScoreBanner
      v-if="isLive"
      :names="matchData.names"
      :score="matchData.score"
      class="ma-0"
    />

    <SystemBar
      :displayDate="displayDate"
      :selectedClubId="selectedClubId"
      :match="match"
      v-else
    />

    <!-- <v-app-bar app class="abcolor " dark v-else>
      <img alt="logo" src="./assets/logo.png" />
      <router-link :to="`/`" class="ml-5">
        <v-btn :disabled="isMatchday" class="primary">
          {{ selectedClub.name }}
        </v-btn>
      </router-link>
      <router-link
        :to="`/league`"
        class="text-center ml-5 title font-shadow"
        v-if="!isMatchday"
      >
        {{ placeInLeague }} in The English League
      </router-link>
      <span class="text-center ml-5 title font-shadow" v-if="isMatchday">
        {{ matchTitle }}
      </span>
      <ButtonsSmall :routes="routes" :disabled="isMatchday" />
      <v-col class="text-end">
        <v-btn
          v-if="!isMatchday"
          outlined
          small
          class="mr-3 "
          :disabled="isMatchday || isAdvancingDate"
          @click="$router.go(-1)"
          ><span> &larr;</span>
        </v-btn>
        <v-btn
          v-if="!isMatchday"
          outlined
          small
          class="mr-3 "
          :disabled="isMatchday || isAdvancingDate"
          @click="$router.go(1)"
          ><span> &rarr;</span>
        </v-btn>


        <span class="text-center ml-5 title font-shadow " v-if="isDeveloper">
          <span class="grey--text"> Date:</span> <b> {{ day }}</b
          ><span class="grey--text"> displayDate:</span>
          <b>{{ displayDate }}</b>
        </span>
        <span class="text-center ml-5 title font-shadow code" v-else>
          <b class="code">{{ displayDate }}</b>
        </span>
      </v-col>
    </v-app-bar> -->

    <v-main class="bgcolor">
      <router-view />
    </v-main>

    <BottomBar @checkTactics="checkTacics()" @continue="this.continue" />
  </v-app>
</template>

<script>
import classes from '@/data/classes.js';
import engine from '@/engine/engine.js';
import data from '@/data/data.js';
import ScoreBanner from '@/components/Match/ScoreBanner.vue';
import matchData from '@/data/matchData.js';
import simulateMatch from '@/engine/simulateMatch.js';
import BottomBar from '@/navbars/BottomBar.vue';
import SystemBar from '@/navbars/SystemBar.vue';

export default {
  name: 'App',
  components: {
    ScoreBanner,
    BottomBar,
    SystemBar,
  },

  created() {
    window.addEventListener('keydown', (e) => this.keyPress(e));

    // if (!this.live) {
    engine.initialize(
      this.idCodes.fighter,
      this.idCodes.club,
      this.idCodes.staff
    );

    this.date = this.getDate;
    this.displayDate = engine.arrangeDate(this.splitDate);

    this.seedRoster(this.selectedRoster);
    this.seedLeague(this.selectedLeague);
    this.seedCommission();
    this.seedStaff();

    //user input, select name, select club
    this.$store.dispatch('setManagerName', this.selectedName);
    this.selectClub();

    engine.checkContract(this.league, this.roster);
    console.log(this.roster);
    //and the coaches
    engine.seedStaffToClubs(this.league, this.staff);
    console.log(this.staff);
    //generate a tactic for all the clubs
    this.seedTactics();

    //schedule the league, it's currently handmade
    const schedule = engine.seedSchedule(this.league, this.idCodes.match);

    this.seedSchedule(schedule);

    //generate and set training schedule
    this.seedTrainingSchedules();

    // this.$store.dispatch('setLive', true);
    // }
  },

  data: () => ({
    selectedClubId: 1004,
    selectedName: 'Finnbogi Jökull Pétursson',
    selectedLeague: data.clubs.england,
    selectedRoster: data.fighters.roster,
    date: undefined,
    displayDate: null,
    isTrainingDone: 2,
  }),

  watch: {
    isPostMatch: function() {
      this.updateDisplayDate();
    },
    // selectedClub: function() {
    //   console.log(this.isContinueDisabled);
    // },
  },

  computed: {
    managerName() {
      return this.$store.getters.managerName;
    },
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
    isBetweenRounds() {
      return this.$store.getters.matchData.isBetweenRounds;
    },
    isFullTime() {
      return this.$store.getters.matchData.isFullTime;
    },
    isPaused() {
      return this.$store.getters.matchData.isPaused;
    },
    isDisabled() {
      return this.$store.getters.matchData.isDisabled;
    },
    isBusy() {
      return this.$store.getters.matchData.isBusy;
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
            this.continue();
          }
          setTimeout(() => {
            this.$store.dispatch('setIsBusy', false);
          }, 250);
        }
      }
    },

    //services
    getClub(id) {
      return this.$store.getters.getClubById(id);
    },
    getFighter(id) {
      return this.$store.getters.getFighterById(id);
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

    selectClub() {
      const newsItem = data.news.manager.hired[0];
      let { title, content } = newsItem;

      title = engine.formatNewsManager(title, this.managerName);
      title = engine.formatNewsClub(
        title,
        this.getClub(this.selectedClubId).name
      );
      content = engine.formatNewsManager(content, this.managerName);
      content = engine.formatNewsClub(
        content,
        this.getClub(this.selectedClubId).name
      );

      // console.log(this.displayDate);

      this.$store.dispatch(
        'addNews',
        new classes.NewsItem(this.displayDate, title, content)
      );

      this.$store.dispatch('selectClub', this.selectedClubId);
    },
    updateDisplayDate() {
      this.displayDate = engine.arrangeDate(this.getDate.toString().split(' '));
    },

    // game loop
    continue() {
      if (
        this.checkTactic() &&
        this.$router.currentRoute.path == '/tactics' &&
        this.isMatchday
      ) {
        this.$router.push(`/match/${this.currentMatch}`);
        return;
      }
      if (this.isMatchday || this.isAdvancingDate) {
        return;
      }
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
          this.prepSimulateMatch(match);
          didYouSimulateAnyMatches = true;
        }
      });

      //fighters recover
      this.$store.dispatch('seedRoster', engine.recoverFighters(this.roster));

      // there is a rest day before and after each matchday
      // on any training day, check for injuries
      this.goThroughTraining();

      this.checkIfMatchday();

      if (didYouSimulateAnyMatches && !this.isMatchday) {
        console.log('I did sims and its not matchday');
        console.log(this.matches);
        // this.continue();
        // this.$store.dispatch('setIsPostMatch', false);
      }
      if (didYouSimulateAnyMatches && this.isMatchday) {
        console.log('I did sims on matchday');
        // this.$store.dispatch('continue');
        this.$store.dispatch('setIsPostMatch', true);
      }

      // ux
      this.$store.dispatch('setIsAdvancingDate', true);

      setTimeout(() => {
        console.log(this.isAdvancingDate);
        this.$store.dispatch('setIsAdvancingDate', false);
      }, 250);

      //end day
    },

    //training
    goThroughTraining() {
      for (let i = 0; i < this.league.length; i++) {
        const club = this.league[i];

        for (let j = 0; j < club.training.schedule.length; j++) {
          const element = club.training.schedule[j];

          if (element.date == this.day) {
            //train
            console.log('training');

            club.training.schedule.splice(
              club.training.schedule.indexOf(element),
              club.training.schedule.indexOf(element) + 1
            );

            if (!this.isTrainingDone) {
              console.log(this.isTrainingDone);
              const newsItem = data.news.training.complete[0];
              let { title, content, other } = newsItem;

              content = `${content} ${other}`;
              this.isTrainingDone = 2;
              this.$store.dispatch(
                'addNews',
                new classes.NewsItem(this.displayDate, title, content)
              );
            } else {
              this.isTrainingDone--;
            }
          }
        }
      }
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
    prepSimulateMatch(match) {
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
      this.$store.dispatch('addFighterData', result.fighterData);

      result.fighterForms.forEach((element) => {
        this.$store.dispatch('addFighterForm', element);
      });
    },

    //seeding
    generateTrainingSchedule(schedule) {
      let trainingSchedule = [];
      const seasonLength = schedule.slice().reverse()[0].date;

      for (let j = 2; j < seasonLength; j = j + 7) {
        for (let k = 0; k < 3; k++) {
          trainingSchedule.push({ value: true, date: j + k });
        }
      }
      return trainingSchedule;
    },

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

    seedTactics() {
      this.league.forEach((club) => {
        if (club.npc == true) {
          this.$store.dispatch('seedTactics', this.generateTactic(club.id));
        }
      });
      console.log(this.league);
    },

    seedTrainingSchedules() {
      this.$store.dispatch(
        'seedTrainingSchedules',
        this.generateTrainingSchedule(this.schedule)
      );
    },

    seedLeague(league) {
      this.$store.dispatch('seedLeague', league);
      this.$store.dispatch('setClubId', this.idCodes.club + this.league.length);

      // console.log(this.$store.getters.nextClubId);
    },

    seedRoster() {
      this.$store.dispatch('seedRoster', this.selectedRoster);
      this.$store.dispatch(
        'setFighterId',
        this.idCodes.fighter + this.roster.length
      );
    },

    seedCommission() {
      this.$store.dispatch('seedCommission', data.commission.judges);
      this.$store.dispatch(
        'setCommissionId',
        this.idCodes.commission + this.commission.length
      );
    },

    seedStaff() {
      this.$store.dispatch('seedStaff', data.staff.coaches);
      this.$store.dispatch(
        'setStaffId',
        this.idCodes.staff + this.staff.length
      );
    },

    seedSchedule(schedule) {
      this.$store.dispatch('seedSchedule', schedule);
      this.$store.dispatch(
        'setMatchId',
        this.idCodes.match + this.schedule.length
      );

      const newsItem = data.news.schedule.set[0];
      let { title, content } = newsItem;

      title = engine.formatNewsDate(
        title,
        engine.arrangeDate(
          engine
            .dateByDay(5)
            .toString()
            .split(' ')
        )
      );
      content = engine.formatNewsDate(
        content,
        engine.arrangeDate(
          engine
            .dateByDay(5)
            .toString()
            .split(' ')
        )
      );

      this.$store.dispatch(
        'addNews',
        new classes.NewsItem(this.displayDate, title, content)
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
.continue-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 56px;
  cursor: pointer;
}
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

.v-tab {
  text-transform: none !important;
  cursor: pointer !important;
}
.v-btn {
  text-transform: none !important;
  cursor: pointer !important;
}
</style>
