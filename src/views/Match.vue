<template>
  <div class="ma-10">
    <!-- floating -->

    <!-- <v-container
      style="position: absolute; top: 10%; right: 5%"
      class="pa-0 ma-0 d-flex justify-end"
    >
      <v-btn class="" v-if="isDeveloper" @click="testEnd()"
        >end with a decision</v-btn
      >
    </v-container> -->

    <TruePoints :truePoints="truePoints" v-if="isDeveloper" />
    <!-- /floating -->

    <!-- COMMENTARY -->
    <v-row class="mt-0">
      <v-col>
        <v-row class="text-center pt-1 mb-1">
          <v-col>
            <v-card>
              <Clock :timestamp="timestamp" :rounds="rounds" :round="round" />
            </v-card>
          </v-col>
          <v-col>
            <v-card class="commentary">
              <Control
                :isFullTime="isFullTime"
                :isDisabled="isDisabled"
                :isPaused="isPaused"
                :isFast="isFast"
                :isBetweenRounds="isBetweenRounds"
                :isCommentary="isCommentary"
                @startRound="startRound()"
                @getOn="getOn()"
                @endMatch="endMatch()"
                @togglePause="togglePause()"
                @setIntervalFast="setIntervalFast()"
                @setIntervalSlow="setIntervalSlow()"
                @setCommentary="setCommentary()"
              />
            </v-card>
          </v-col>
        </v-row>

        <v-divider></v-divider>

        <!-- MATCH  -->
        <v-col class="mt-1 ">
          <v-row class="bgcolor pa-0 pl-5">
            <v-tab
              v-for="(tab, index) in tabs"
              :key="index"
              class="ml-1 mt-3 pa-2 pb-4"
              @click="selectTab(index)"
              v-bind:class="{
                tertiary: tabs[index].value,
                sixth: !tabs[index].value,
              }"
              >{{ tab.name }}</v-tab
            >
          </v-row>
          <v-card elevation="10">
            <Overview
              v-if="isTabOverview"
              :awayTactic="awayTactic"
              :homeTactic="homeTactic"
              :messages="messagesForRings"
              :colors="colors"
            />
            <Bench
              v-if="isTabBench"
              :awayTactic="awayTactic"
              :homeTactic="homeTactic"
              :awaySubs="awaySubs"
              :homeSubs="homeSubs"
              :substitutionAvailable="substitutionAvailable"
              :colors="colors"
            />
            <MatchTactics
              v-if="isTabMatchTactics"
              :tactic="getClub(selectedClubId).tactic"
              :ringFinishedLeft="ringFinishedLeft"
              :ringFinishedCenter="ringFinishedCenter"
              :ringFinishedRight="ringFinishedRight"
            />
            <League v-if="isTabMatchLeague" :isReadOnly="true" />

            <JudgesCard
              v-if="isTabJudgesCard"
              :clubNames="names"
              :decisions="decisions"
              :judges="judges"
              :rounds="rounds"
              :ringFinishedLeft="ringFinishedLeft"
              :ringFinishedRight="ringFinishedRight"
              @countScore="countScore"
            />
          </v-card>
        </v-col>

        <!-- DETAILS -->
        <Details
          :activity="ringActivity"
          :coaches="coaches"
          :rounds="rounds"
          :decisions="decisions"
          :judges="judges"
        />
      </v-col>
      <v-col cols="3" v-if="isCommentary">
        <Commentary :messages="messages" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import data from '@/data/data.js';
import classes from '@/data/classes.js';
import matchEngine from '@/engine/matchEngine.js';
import matchBrain from '@/engine/matchBrain.js';
import engine from '@/engine/engine.js';
import decisionEngine from '@/engine/decisionEngine.js';

export default {
  name: 'Match',

  components: {
    JudgesCard: () => import('@/components/Match/JudgesCard.vue'),
    TruePoints: () => import('@/components/Match/TruePoints.vue'),
    Commentary: () => import('@/components/Match/Commentary.vue'),
    Overview: () => import('@/components/Match/Overview.vue'),
    Details: () => import('@/components/Match/Details.vue'),
    Bench: () => import('@/components/Match/Bench.vue'),
    MatchTactics: () => import('@/components/Match/MatchTactics.vue'),
    Clock: () => import('@/components/Match/Clock.vue'),
    Control: () => import('@/components/Match/Control.vue'),
    League: () => import('@/views/League.vue'),
  },

  mounted() {
    window.onpopstate = (event) => {
      if (this.isMatchDay) {
        console.log(event);
        // this.$router.push("/"); // redirect to home, for example
      }
    };
  },

  created() {
    if (!this.isLive) {
      // this.ringTruePoints = matchBrain.seedRoundsToPointCounters(this.rounds);
      this.$store.dispatch(
        'setRingTruePoints',
        matchBrain.seedRoundsToPointCounters(this.rounds)
      );

      this.resetMatchData();

      this.resetFighterMatchStats();
      this.setJudges();
      this.setTactics();
      this.$store.dispatch('setNames', this.names);
      this.$store.dispatch('setColors', this.colors);
      this.$store.dispatch('setIsLive', true);
    }
  },

  beforeDestroy() {
    console.log('destroying');

    if (this.isFullTime) {
      // this.$store.dispatch(
      //   'setRingTruePoints',
      //   matchBrain.seedRoundsToPointCounters(this.rounds)
      // );

      this.resetMatchData();

      this.$store.dispatch('setIsLive', false);
      this.$store.dispatch('setIsMatchday', false);
      this.$store.dispatch('setIsPostMatch', true);
    }
  },

  watch: {
    // watching keyPress, space
    controlStartRound() {
      this.startRound();
    },
    controlGetOn() {
      this.getOn();
    },
    controlEndMatch() {
      this.endMatch();
    },
    controlTogglePause() {
      this.togglePause();
    },
    cards() {
      if (this.isDecision) {
        console.log('Match watch: commitFighterForm');
        this.commitFighterForm(
          this.homeTactic.selection.center,
          this.awayTactic.selection.center,
          this.cards.center
        );
        if (!this.ringFinishedLeft) {
          this.commitFighterForm(
            this.homeTactic.selection.left,
            this.awayTactic.selection.left,
            this.cards.left
          );
        }
        if (!this.ringFinishedRight) {
          this.commitFighterForm(
            this.homeTactic.selection.right,
            this.awayTactic.selection.right,
            this.cards.right
          );
        }
      }
    },
  },

  data: () => ({
    //ui
    tabs: data.tabs.match,
  }),

  computed: {
    // keyPress, space
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

    //
    selectedClubId() {
      return this.$store.getters.selectedClubId;
    },

    /************************************/
    //matchdata

    isCommentary() {
      return this.$store.getters.matchData.isCommentary;
    },
    isFullTime() {
      return this.$store.getters.matchData.isFullTime;
    },
    isBetweenRounds() {
      return this.$store.getters.matchData.isBetweenRounds;
    },
    isHomeAttack() {
      return this.$store.getters.matchData.isHomeAttack;
    },
    isDisabled() {
      return this.$store.getters.matchData.isDisabled;
    },
    isPaused() {
      return this.$store.getters.matchData.isPaused;
    },
    isDecision() {
      return this.$store.getters.matchData.isDecision;
    },
    isScored() {
      return this.$store.getters.matchData.isScored;
    },

    //x, y minute rounds
    rounds() {
      return this.$store.getters.matchData.rounds;
    },
    minutes() {
      return this.$store.getters.matchData.minutes;
    },
    //current round, minute, second
    minute() {
      return this.$store.getters.matchData.minute;
    },
    second() {
      return this.$store.getters.matchData.second;
    },
    round() {
      return this.$store.getters.matchData.round;
    },

    happenChance() {
      return this.$store.getters.matchData.happenChance;
    },

    //
    homeTactic() {
      return this.$store.getters.matchData.homeTactic;
    },
    awayTactic() {
      return this.$store.getters.matchData.awayTactic;
    },
    homeSubs() {
      return this.$store.getters.matchData.homeSubs;
    },
    awaySubs() {
      return this.$store.getters.matchData.awaySubs;
    },

    //
    pendingSub() {
      return this.$store.getters.matchData.pendingSub;
    },

    //
    ringActivity() {
      return this.$store.getters.matchData.ringActivity;
    },
    ringFinishedLeft() {
      return this.$store.getters.matchData.ringFinishedLeft;
    },
    ringFinishedCenter() {
      return this.$store.getters.matchData.ringFinishedCenter;
    },
    ringFinishedRight() {
      return this.$store.getters.matchData.ringFinishedRight;
    },
    ringDecisions() {
      return this.$store.getters.matchData.ringDecisions;
    },
    ringJudges() {
      return this.$store.getters.matchData.ringJudges;
    },
    ringTruePoints() {
      return this.$store.getters.matchData.ringTruePoints;
    },

    cards() {
      return this.$store.getters.matchData.cards;
    },
    finishes() {
      return this.$store.getters.matchData.finishes;
    },
    /************************************/

    //match

    substitutionAvailable() {
      return this.homeSubs.length || this.awaySubs.length ? true : false;
    },
    match() {
      let match;
      this.schedule.forEach((element) => {
        if (element.id == this.$route.params.id) {
          match = element;
        }
      });
      console.log(match);
      return match;
    },
    homeClub() {
      return this.getClub(this.match.clubs[0]);
    },
    awayClub() {
      return this.getClub(this.match.clubs[1]);
    },
    isFast() {
      return this.timeoutInterval > 500 ? true : false;
    },
    timeoutInterval() {
      return this.$store.getters.timeoutInterval;
    },
    isDeveloper() {
      return this.$store.getters.isDeveloper;
    },
    isMatchDay() {
      return this.$store.getters.isMatchDay;
    },
    isLive() {
      return this.$store.getters.isLive;
    },

    //ui
    isTabOverview() {
      return this.tabs[0].value;
    },
    isTabBench() {
      return this.tabs[1].value;
    },
    isTabMatchTactics() {
      return this.tabs[2].value;
    },
    isTabMatchLeague() {
      return this.tabs[3].value;
    },
    isTabJudgesCard() {
      if (this.isDecision) {
        return this.tabs[4].value;
      } else {
        return false;
      }
    },

    routes() {
      let routes = [];
      data.routes.forEach((element) => {
        routes.push(element);
      });

      return routes;
    },
    timestamp() {
      return this.isFullTime
        ? 'Full Time'
        : this.second < 10
        ? `${this.minute}:0${this.second}`
        : `${this.minute}:${this.second}`;
    },
    messages() {
      return this.$store.getters.matchMessages;
    },
    messagesForRings() {
      return this.$store.getters.matchMessagesForRings;
    },
    message() {
      return this.messages.slice().reverse()[0];
    },
    names() {
      return {
        home: this.getClub(this.match.clubs[0]).name,
        away: this.getClub(this.match.clubs[1]).name,
      };
    },
    colors() {
      return {
        home: {
          primary: this.getClub(this.match.clubs[0]).color.primary,
          secondary: this.getClub(this.match.clubs[0]).color.secondary,
        },
        away: {
          primary: this.getClub(this.match.clubs[1]).color.primary,
          secondary: this.getClub(this.match.clubs[1]).color.secondary,
        },
      };
    },

    //data
    schedule() {
      return this.$store.getters.schedule;
    },
    commission() {
      return this.$store.getters.commission;
    },
    coaches() {
      //player's coaches
      return this.getClub(this.selectedClubId).staff;
    },
    coachesSorted() {
      const coachesSorted = [];
      this.coaches.forEach((coach) => {
        coachesSorted.push(this.getCoach(coach));
      });
      return coachesSorted;
    },

    //matchData

    //judgeing/score
    score() {
      let matchData = this.$store.getters.matchData;
      return matchData.score;
    },
    truePoints() {
      const {
        ringTruePointsLeft,
        ringTruePointsCenter,
        ringTruePointsRight,
      } = this.ringTruePoints;
      console.log(this.ringTruePoints);
      const rings = [];

      rings.push(ringTruePointsLeft);
      rings.push(ringTruePointsCenter);
      rings.push(ringTruePointsRight);
      console.log(rings);
      return rings;
    },
    judges() {
      const {
        ringJudgesLeft,
        ringJudgesCenter,
        ringJudgesRight,
      } = this.ringJudges;
      const judges = [];

      judges.push(ringJudgesLeft);
      judges.push(ringJudgesCenter);
      judges.push(ringJudgesRight);
      return judges;
    },
    decisions() {
      const {
        ringDecisionLeft,
        ringDecisionCenter,
        ringDecisionRight,
      } = this.ringDecisions;
      const decisions = [];

      decisions.push(ringDecisionLeft);
      decisions.push(ringDecisionCenter);
      decisions.push(ringDecisionRight);
      return decisions;
    },
    homeStillStanding() {
      let count = 0;

      this.getFighter(this.homeTactic.selection.left).match.finished
        ? count
        : (count += 1);
      this.getFighter(this.homeTactic.selection.center).match.finished
        ? count
        : (count += 1);
      this.getFighter(this.homeTactic.selection.right).match.finished
        ? count
        : (count += 1);

      return count;
    },
    awayStillStanding() {
      let count = 0;
      this.getFighter(this.awayTactic.selection.left).match.finished
        ? count
        : (count += 1);
      this.getFighter(this.awayTactic.selection.center).match.finished
        ? count
        : (count += 1);
      this.getFighter(this.awayTactic.selection.right).match.finished
        ? count
        : (count += 1);
      return count;
    },
  },

  methods: {
    //init
    resetFighterMatchStats() {
      matchBrain.reset(this.getFighter(this.homeClub.tactic.selection.center));
      matchBrain.reset(this.getFighter(this.homeClub.tactic.selection.left));
      matchBrain.reset(this.getFighter(this.homeClub.tactic.selection.right));
      matchBrain.reset(this.getFighter(this.awayClub.tactic.selection.center));
      matchBrain.reset(this.getFighter(this.awayClub.tactic.selection.left));
      matchBrain.reset(this.getFighter(this.awayClub.tactic.selection.right));
    },
    resetMatchData() {
      //minute, second, happenchance, tabs and rounds isnt here

      this.$store.dispatch('setMatchMessages', []);
      this.$store.dispatch('setMatchMessagesForRings', [[], [], []]);

      //reset scorebanner
      this.$store.dispatch('setScore', { home: 0, away: 0 });
      this.$store.dispatch('setNames', { home: '', away: '' });

      //bools
      this.$store.dispatch('setIsFullTime', false);
      this.$store.dispatch('setIsDisabled', false);
      this.$store.dispatch('setIsPaused', false);
      this.$store.dispatch('setIsDecision', false);
      this.$store.dispatch('setIsBetweenRounds', true);
      this.$store.dispatch('setIsDecision', false);
      this.$store.dispatch('setIsBusy', false);
      this.$store.dispatch('setIsScored', false);

      this.$store.dispatch('setRound', 0);
      this.$store.dispatch('setHomeTactic', {});
      this.$store.dispatch('setAwayTactic', {});
      this.$store.dispatch('setHomeSubs', []);
      this.$store.dispatch('setAwaySubs', []);
      this.$store.dispatch('setPendingSub', false);
      this.$store.dispatch('setRingFinishedLeft', false);
      this.$store.dispatch('setRingFinishedCenter', false);
      this.$store.dispatch('setRingFinishedRight', false);
      this.$store.dispatch('setRingDecisions', {
        ringDecisionLeft: undefined,
        ringDecisionCenter: undefined,
        ringDecisionRight: undefined,
      });
      this.$store.dispatch('setRingActivity', [
        {
          home: 0,
          away: 0,
          homeSignificant: 0,
          awaySignificant: 0,
        },
        {
          home: 0,
          away: 0,
          homeSignificant: 0,
          awaySignificant: 0,
        },
        {
          home: 0,
          away: 0,
          homeSignificant: 0,
          awaySignificant: 0,
        },
      ]);
      this.$store.dispatch('setRingJudges', {
        ringJudgesLeft: [],
        ringJudgesCenter: [],
        ringJudgesRight: [],
      });
    },

    setJudges() {
      let judges = this.ringJudges;
      const { ringJudgesLeft, ringJudgesCenter, ringJudgesRight } = judges;
      for (let i = 0; i < 3; i++) {
        ringJudgesLeft.push(this.commission[i]);
      }
      for (let i = 3; i < 6; i++) {
        ringJudgesCenter.push(this.commission[i]);
      }
      for (let i = 6; i < 9; i++) {
        ringJudgesRight.push(this.commission[i]);
      }
      this.$store.dispatch('setRingJudges', judges);
    },
    setTactics() {
      // this.homeTactic = { ...this.homeTactic, ...this.homeClub.tactic };
      // this.awayTactic = { ...this.awayTactic, ...this.awayClub.tactic };
      this.$store.dispatch('setHomeTactic', {
        ...this.homeTactic,
        ...this.homeClub.tactic,
      });
      this.$store.dispatch('setAwayTactic', {
        ...this.awayTactic,
        ...this.awayClub.tactic,
      });
    },

    //ui
    selectTab(selection) {
      for (let i = 0; i < this.tabs.length; i++) {
        this.tabs[i].value = false;
      }
      this.tabs[selection].value = true;
    },
    postMatchMessage(outcome, ring, timeoutIntervalMultiplier) {
      if (outcome.msg == undefined) {
        return;
      }

      setTimeout(() => {
        this.$store.dispatch('addMatchMessage', {
          text: outcome.msg,
          primary: outcome.primary,
          secondary: outcome.secondary,
        });
        this.$store.dispatch('addMatchMessageToRing', {
          ring: ring,
          msg: outcome.msg,
        });
      }, this.timeoutInterval * timeoutIntervalMultiplier); // INTERVAL
    },

    //services
    setIntervalFast() {
      this.$store.dispatch('setTimeoutInterval', 350);
    },
    setIntervalSlow() {
      this.$store.dispatch('setTimeoutInterval', 750);
    },
    setCommentary() {
      this.$store.dispatch('setIsCommentary');
    },
    getClub(id) {
      return this.$store.getters.getClubById(id);
    },
    getCoach(id) {
      return this.$store.getters.getCoachById(id);
    },
    getFighter(id) {
      return this.$store.getters.getFighterById(id);
    },
    togglePause() {
      this.$store.dispatch('setIsPaused', !this.isPaused);
    },

    archiveMatch() {
      // if (this.score.home > 3) {
      //   this.score.home = 3;
      // }
      // if (this.score.away > 3) {
      //   this.score.away = 3;
      // }
      const match = {
        id: undefined,
        date: this.match.date,
        clubs: this.match.clubs,
        judges: this.judges,
        decisions: this.decisions,
        cards: this.cards,
        score: this.score,
        ringActivity: this.ringActivity,

        left: {
          home: this.getFighter(this.homeTactic.selection.left),
          away: this.getFighter(this.awayTactic.selection.left),
          finish: this.ringFinishedLeft,
        },
        center: {
          home: this.getFighter(this.homeTactic.selection.center),
          away: this.getFighter(this.awayTactic.selection.center),
          finish: this.ringFinishedCenter,
        },
        right: {
          home: this.getFighter(this.homeTactic.selection.right),
          away: this.getFighter(this.awayTactic.selection.right),
          finish: this.ringFinishedRight,
        },
      };

      console.log(match);
      console.log(this.finishes);

      let clubForm = matchEngine.getClubForm(this.score);

      const homeClubData = {
        id: match.clubs[0],
        competitions: {
          league: {
            points: this.score.home,
            pointsAgainst: this.score.away,
            form: clubForm.home,
            finishes: this.finishes.home,
          },
        },
      };
      const awayClubData = {
        id: match.clubs[1],
        competitions: {
          league: {
            points: this.score.away,
            pointsAgainst: this.score.home,
            form: clubForm.away,
            finishes: this.finishes.away,
          },
        },
      };

      // well at the moment this doesnt give me win loss of rounds
      // lets make something in decisionEngine to getDetailedJudgesCards
      console.log(this.decisions);
      const judgesCard = decisionEngine.getJudgesCards(
        this.decisions,
        this.judges,
        this.rounds
      );
      console.log(judgesCard);

      // const fightersForm = {
      //   home: {
      //     left: [],
      //     center: [],
      //     right: [],
      //   },
      //   away: {
      //     left: [],
      //     center: [],
      //     right: [],
      //   },
      // };

      const fighterData = [
        {
          league: 1,
          cup: 0,
          international: 0,
          finishes: this.getFighter(this.homeTactic.selection.left).match
            .finishes,
          id: this.homeTactic.selection.left,
          condition: this.getFighter(this.homeTactic.selection.left).match
            .condition,
        },
        {
          league: 1,
          cup: 0,
          international: 0,
          finishes: this.getFighter(this.homeTactic.selection.center).match
            .finishes,
          id: this.homeTactic.selection.center,
          condition: this.getFighter(this.homeTactic.selection.center).match
            .condition,
        },
        {
          league: 1,
          cup: 0,
          international: 0,
          finishes: this.getFighter(this.homeTactic.selection.right).match
            .finishes,
          id: this.homeTactic.selection.right,
          condition: this.getFighter(this.homeTactic.selection.right).match
            .condition,
        },
        {
          league: 1,
          cup: 0,
          international: 0,
          finishes: this.getFighter(this.awayTactic.selection.left).match
            .finishes,
          id: this.awayTactic.selection.left,
          condition: this.getFighter(this.awayTactic.selection.left).match
            .condition,
        },
        {
          league: 1,
          cup: 0,
          international: 0,
          finishes: this.getFighter(this.awayTactic.selection.center).match
            .finishes,
          id: this.awayTactic.selection.center,
          condition: this.getFighter(this.awayTactic.selection.center).match
            .condition,
        },
        {
          league: 1,
          cup: 0,
          international: 0,
          finishes: this.getFighter(this.awayTactic.selection.right).match
            .finishes,
          id: this.awayTactic.selection.right,
          condition: this.getFighter(this.awayTactic.selection.right).match
            .condition,
        },
      ];

      //commit
      this.$store.dispatch('addMatch', match);
      this.$store.dispatch('addClubData', homeClubData);
      this.$store.dispatch('addClubData', awayClubData);
      this.$store.dispatch('addFighterData', fighterData);

      //news item commit
      const newsItem = data.news.match.complete[0];
      let { title, content } = newsItem;

      if (!this.homeClub.npc) {
        content = engine.formatNewsClub(content, this.awayClub.name);
        content = engine.formatNewsPoints(
          content,
          homeClubData.competitions.league.points
        );
        content = engine.formatNewsFinishes(
          content,
          homeClubData.competitions.league.finishes
        );
      }
      if (!this.awayClub.npc) {
        content = engine.formatNewsClub(content, this.homeClub.name);
        content = engine.formatNewsPoints(
          content,
          awayClubData.competitions.league.points
        );
        content = engine.formatNewsFinishes(
          content,
          awayClubData.competitions.league.finishes
        );
      }

      content = engine.formatNewsScore(
        content,
        `${this.score.home} - ${this.score.away}`
      );

      this.$store.dispatch(
        'addNews',
        new classes.NewsItem(this.displayDate, title, content)
      );
    },

    //basics
    testEnd() {
      // this.isDecision = true;
      this.$store.dispatch('setIsFullTime', true);
      this.decision();
    },
    endMatch() {
      // this.resetFighterMatchStats();

      this.tabs.splice(4, 5);
      this.selectTab(0);
      this.archiveMatch();

      // setTimeout(() => {

      this.$router.push('/fixtures');
      // }, 500);
    },

    endRound() {
      this.$store.dispatch('setIsBetweenRounds', true);

      this.resetFighters();

      if (this.round == this.rounds.length) {
        //decision
        this.$store.dispatch('setIsFullTime', true);
        this.decision();
      }
      this.$store.dispatch(
        'addMatchMessage',
        `That's the end of round ${this.round}`
      );
    },
    startRound() {
      // this.round++;
      this.$store.dispatch('setRound', this.round + 1);
      this.$store.dispatch('setIsBetweenRounds', false);
      this.$store.dispatch('addMatchMessage', `Round ${this.round} Fight!`);
      setTimeout(() => {
        if (!this.isFullTime) {
          this.getOn();
        }
      }, 750);
    },
    // pickRing() {
    //   // implement something to make less random and more based on:
    //   // exposed, learned, pace, tactics
    //   if (this.ringFinishedLeft && this.ringFinishedRight) {
    //     return 2;
    //   } else if (this.ringFinishedLeft) {
    //     return matchEngine.roll(2) + 1;
    //   } else if (this.ringFinishedRight) {
    //     return matchEngine.roll(2);
    //   } else {
    //     return matchEngine.roll(3);
    //   }
    // },
    makeSubstitution() {
      let msg;

      let home = this.homeTactic;
      let away = this.awayTactic;

      if (this.isHomeAttack) {
        if (this.awaySubs[0] == this.awayTactic.selection.left) {
          console.log(this.awaySubs[0]);
          away.selection.left = this.awayTactic.selection.center;
        } else if (this.awaySubs[0] == this.awayTactic.selection.right) {
          console.log(this.awaySubs[0]);
          away.selection.right = this.awayTactic.selection.center;
        }

        away.selection.center = this.awaySubs[0];
        this.$store.dispatch('setAwayTactic', away);
        // this.awaySubs.splice(0, 1);
        this.$store.dispatch('removeAwaySub');

        msg = `${
          this.getFighter(this.awayTactic.selection.center).personal.name
        } comes on!`;
        this.$store.dispatch('addMatchMessage', msg);
      } else {
        if (this.homeSubs[0] == this.homeTactic.selection.left) {
          home.selection.left = this.homeTactic.selection.center;
        } else if (this.homeSubs[0] == this.homeTactic.selection.right) {
          home.selection.right = this.homeTactic.selection.center;
        }

        home.selection.center = this.homeSubs[0];
        this.$store.dispatch('setHomeTactic', home);
        // this.homeSubs.splice(0, 1);
        this.$store.dispatch('removeHomeSub');
        msg = `${
          this.getFighter(this.homeTactic.selection.center).personal.name
        } comes on!`;
        this.$store.dispatch('addMatchMessage', msg);
      }

      this.ringFinishedCenter = false;
      this.$store.dispatch('setRingFinishedCenter', false);
      // this.pendingSub = false;
      this.$store.dispatch('setPendingSub', false);
    },

    decision() {
      this.$store.dispatch(
        'setRingDecisions',
        matchBrain.scoreRounds(this.ringTruePoints, this.ringJudges)
      );
      let score = { home: this.score.home, away: this.score.away };
      // for center ring, the club with more fighters standing takes it
      if (this.homeStillStanding > this.awayStillStanding) {
        score.home += 2;
        console.log('Home + 2, stillstanding');
      } else if (this.homeStillStanding < this.awayStillStanding) {
        score.away += 2;
        console.log('Away + 2, stillstanding');
      } else {
        // we go to a decision
        if (this.ringFinishedLeft) {
          this.cards.leftMsg = 'Finish';
        }
        if (this.ringFinishedRight) {
          this.cards.rightMsg = 'Finish';
        }

        this.$store.dispatch('setIsDecision', true); // opens Judges' Cards !
        // countscore happens
        console.log(this.cards);

        this.tabs.push({ name: 'judges card', value: false });
        this.selectTab(4);
      }

      this.$store.dispatch('setScore', score);
    },

    // countActivity(ring, outcome) {
    //   if (this.isHomeAttack) {
    //     this.ringActivity[ring - 1].home += 1;
    //     if (outcome.significant) {
    //       this.ringActivity[ring - 1].homeSignificant += 1;
    //     }
    //   } else {
    //     this.ringActivity[ring - 1].away += 1;
    //     if (outcome.significant) {
    //       this.ringActivity[ring - 1].awaySignificant += 1;
    //     }
    //   }
    // },
    countScore(result) {
      if (!this.isScored) {
        let score = { home: this.score.home, away: this.score.away };
        score.home += result[1].home;
        score.away += result[1].away;

        //watcher reacts to cards changing, commits fighter form
        // this.cards = result[0];
        this.$store.dispatch('setCards', result[0]);

        this.$store.dispatch('setScore', score);

        this.$store.dispatch('setIsScored', true);
      }
    },
    commitFighterForm(home, away, cards) {
      let homeCount = 0;
      let awayCount = 0;

      cards.forEach((judge) => {
        if (judge.home == true && judge.away == false) {
          homeCount += 1;
        } else if (judge.home == false && judge.away == true) {
          awayCount += 1;
        }
      });

      if (homeCount == awayCount) {
        this.$store.dispatch('addFighterForm', {
          id: home,
          item: 'D',
        });
        this.$store.dispatch('addFighterForm', {
          id: away,
          item: 'D',
        });
      } else {
        if (homeCount > awayCount) {
          this.$store.dispatch('addFighterForm', {
            id: home,
            item: 'W',
          });
          this.$store.dispatch('addFighterForm', {
            id: away,
            item: 'L',
          });
        } else {
          this.$store.dispatch('addFighterForm', {
            id: away,
            item: 'W',
          });
          this.$store.dispatch('addFighterForm', {
            id: home,
            item: 'L',
          });
        }
      }
    },

    //main loop
    getOn() {
      if (this.pendingSub) {
        this.makeSubstitution();
      }
      this.$store.dispatch('setIsDisabled', true);
      this.$store.dispatch('setIsPaused', true);
      // this.second = matchEngine.rollEvent(this.second, this.happenChance);
      this.$store.dispatch(
        'setSecond',
        matchEngine.rollEvent(this.second, this.happenChance)
      );
      if (this.second >= 59) {
        // this.minute++;
        this.$store.dispatch('setMinute', this.minute + 1);

        // this.second = 0;
        this.$store.dispatch('setSecond', 0);

        if (this.minute == 5) {
          // this.minute = 0;
          this.$store.dispatch('setMinute', 0);

          this.endRound();
        } else {
          if (!this.isFullTime) {
            this.getOn();
          }
        }
      } else {
        //action happens
        let timeoutIntervalMultiplier = 2;
        let msg;
        let ring;
        // fighter variables
        let home, away, attacker, defender;

        //pick ring
        ring = matchBrain.pickRing(
          this.ringFinishedLeft,
          this.ringFinishedRight
        );
        console.log(ring);

        // select fighters in ring
        if (ring == 1) {
          msg = `In the left ring...`;

          home = this.getFighter(this.homeTactic.selection.left);
          away = this.getFighter(this.awayTactic.selection.left);
        } else if (ring == 2) {
          msg = `In the center ring...`;
          home = this.getFighter(this.homeTactic.selection.center);
          away = this.getFighter(this.awayTactic.selection.center);
        } else if (ring == 3) {
          msg = `In the right ring...`;
          home = this.getFighter(this.homeTactic.selection.right);
          away = this.getFighter(this.awayTactic.selection.right);
        }
        this.$store.dispatch('addMatchMessage', {
          text: `${this.timestamp} ${msg}`,
          primary: '#FFFFFF',
          secondary: '#000000',
        });

        //pick fighter initiative
        const homeInitiative = matchEngine.checkInitiative(home);
        const awayInitiative = matchEngine.checkInitiative(away);

        console.log(homeInitiative);
        console.log(awayInitiative);

        if (homeInitiative >= awayInitiative) {
          //tiniest home advantage
          this.$store.dispatch('setIsHomeAttack', true);
          attacker = home;
          defender = away;
        } else {
          this.$store.dispatch('setIsHomeAttack', false);
          attacker = away;
          defender = home;
        }

        // attach tactics

        attacker.tactic.instructions = {
          ...attacker.tactic.instructions,
          ...matchEngine.pickTactic(
            ring,
            this.isHomeAttack ? this.homeTactic : this.awayTactic
          ),
        };
        defender.tactic.instructions = {
          ...defender.tactic.instructions,
          ...matchEngine.pickTactic(
            ring,
            this.isHomeAttack ? this.awayTactic : this.homeTactic
          ),
        };

        console.log(attacker);
        console.log(attacker.tactic.instructions);
        console.log(defender);
        console.log(defender.tactic.instructions);

        msg = `${attacker.nickname} attacks ${defender.nickname}`;
        setTimeout(() => {
          if (this.isHomeAttack) {
            this.$store.dispatch('addMatchMessage', {
              text: msg,
              primary: this.colors.home.primary,
              secondary: this.colors.home.secondary,
            });
          } else {
            this.$store.dispatch('addMatchMessage', {
              text: msg,
              primary: this.colors.away.primary,
              secondary: this.colors.away.secondary,
            });
          }
        }, this.timeoutInterval); // INTERVAL

        //pick method of attack
        let attackMethod = matchEngine.pickMethodAttack(attacker, defender);
        let outcome = matchEngine.engage(attackMethod, attacker, defender);
        console.log(outcome);

        // attach colors
        if (this.isHomeAttack) {
          outcome = {
            ...outcome,
            primary: this.colors.home.primary,
            secondary: this.colors.home.secondary,
          };
        } else {
          outcome = {
            ...outcome,
            primary: this.colors.away.primary,
            secondary: this.colors.away.secondary,
          };
        }
        console.log('OUTCOME COLKORS' + outcome);
        //count activity
        // this.ringActivity = matchBrain.countActivity(
        //   ring,
        //   outcome,
        //   this.isHomeAttack,
        //   this.ringActivity
        // );
        this.$store.dispatch(
          'setRingActivity',
          matchBrain.countActivity(
            ring,
            outcome,
            this.isHomeAttack,
            this.ringActivity
          )
        );

        //OUTCOME
        //sort out the outcome,

        this.postMatchMessage(outcome, ring, timeoutIntervalMultiplier);
        timeoutIntervalMultiplier += 1;

        //updates momentum, condition, exposed and learned
        matchBrain.updateFighterMatchStats(attacker, defender, outcome);

        // checks condition to see if there was a finish
        this.checkForFinish(
          defender,
          ring,
          this.isHomeAttack,
          attacker,
          timeoutIntervalMultiplier
        );

        this.checkForFinish(
          attacker,
          ring,
          !this.isHomeAttack,
          defender,
          timeoutIntervalMultiplier
        );

        this.$store.dispatch('setScore', this.score);

        if (outcome.point) {
          console.log(this.ringTruePoints);
          console.log(ring);
          console.log(outcome);
          console.log(this.isHomeAttack);
          console.log(this.ringTruePoints);
          console.log(this.round);

          // this.ringTruePoints = matchBrain.tallyPoints(
          //   ring,
          //   outcome,
          //   this.isHomeAttack,
          //   this.ringTruePoints,
          //   this.round
          // );
          this.$store.dispatch(
            'setRingTruePoints',
            matchBrain.tallyPoints(
              ring,
              outcome,
              this.isHomeAttack,
              this.ringTruePoints,
              this.round
            )
          );
          console.log(this.ringTruePoints);
        }

        //SUBSTITUTION
        if (
          this.ringFinishedCenter &&
          this.substitutionAvailable &&
          !this.isFullTime
        ) {
          // this.$store.dispatch('setSubstitutionMade', true);

          this.$store.dispatch('setPendingSub', true); //triggers makeSubstitution at the beginning of getOn()
          this.$store.dispatch('setIsPaused', true);
          this.$store.dispatch('setIsDisabled', false);
          // this.$store.dispatch('setIsPaused', true);
          // this.$store.dispatch('setIsDisabled', false);
        }

        // enable button / loop
        this.$store.dispatch('setIsPaused', false);
        setTimeout(() => {
          this.$store.dispatch('setIsDisabled', false);
          if (!this.isFullTime) {
            console.log(this.isPaused);
            if (!this.isPaused) {
              this.getOn();
            }
          }
        }, this.timeoutInterval * timeoutIntervalMultiplier); // INTERVAL
      }
    },

    //main loop helpers
    checkForFinish(
      fighter,
      ring,
      isHomeAttacking,
      winner,
      timeoutIntervalMultiplier
    ) {
      /*
        a finish happens in center:
          check if has sub, sub him in
          else endMatch
          add score

        a finish happens in left/right
          send winner to subs
          end the ring somehow
          add score

*/
      let msg = `That concludes the match`;
      let fighterResult = matchEngine.checkCondition(fighter);
      let score = { home: this.score.home, away: this.score.away };

      timeoutIntervalMultiplier += 0.1;

      if (fighterResult.finished) {
        this.$store.dispatch('setIsPaused', true);
        fighter.match.finished = true;
        this.getFighter(winner.id).match.finishes++;
        setTimeout(() => {
          this.$store.dispatch('addMatchMessage', fighterResult.msg);
        }, this.timeoutInterval * timeoutIntervalMultiplier);
        timeoutIntervalMultiplier += 0.1;

        if (ring == 1) {
          this.finishInLeft();
          this.$store.dispatch('addFighterForm', { id: winner.id, item: 'F' });
          this.$store.dispatch('addFighterForm', { id: fighter.id, item: 'L' });

          //do depending on which side
          if (isHomeAttacking) {
            console.log('Home + 1, finish in left');
            score.home += 1;
            // this.homeSubs.push(winner.id);
            this.$store.dispatch('addHomeSub', winner.id);
            // this.finishes.home++;
            this.$store.dispatch('setFinishes', {
              ...this.finishes,
              home: this.finishes.home + 1,
            });
          } else {
            console.log('Away + 1, finish in left');
            score.away += 1;
            // this.awaySubs.push(winner.id);
            this.$store.dispatch('addAwaySub', winner.id);
            // this.finishes.away++;
            this.$store.dispatch('setFinishes', {
              ...this.finishes,
              away: this.finishes.away + 1,
            });
          }
          this.$store.dispatch('setScore', score);
        } else if (ring == 2) {
          this.finishInCenter();
          this.$store.dispatch('addFighterForm', { id: winner.id, item: 'F' });
          this.$store.dispatch('addFighterForm', { id: fighter.id, item: 'L' });

          //do depending on which side
          if (isHomeAttacking) {
            this.finishes.home++;
            if (this.awaySubs.length == 0) {
              score.home += 3;
              this.$store.dispatch('setIsFullTime', true);

              // sets this.decisions
              // this.ringDecisions = matchBrain.scoreRounds(
              //   this.ringTruePoints,
              //   this.ringJudges
              // );
              this.$store.dispatch(
                'setRingDecisions',
                matchBrain.scoreRounds(this.ringTruePoints, this.ringJudges)
              );

              setTimeout(() => {
                this.$store.dispatch('addMatchMessage', msg);
                this.$store.dispatch('setIsDisabled', false);
              }, this.timeoutInterval * timeoutIntervalMultiplier);
            }

            // if (!this.awaySubs.length) {
            //   //ef avail
            //   this.score.home += 3;
            // }
          } else {
            // this.finishes.away++;
            this.$store.dispatch('setFinishes', {
              ...this.finishes,
              away: this.finishes.away + 1,
            });
            if (this.homeSubs.length == 0) {
              score.away += 3;
              this.$store.dispatch('setIsFullTime', true);

              // this.ringDecisions = matchBrain.scoreRounds(
              //   this.ringTruePoints,
              //   this.ringJudges
              // );
              this.$store.dispatch(
                'setRingDecisions',
                matchBrain.scoreRounds(this.ringTruePoints, this.ringJudges)
              );

              setTimeout(() => {
                this.$store.dispatch('addMatchMessage', msg);
                this.$store.dispatch('setIsDisabled', false);
              }, this.timeoutInterval * timeoutIntervalMultiplier);
            }
            // if (!this.homeSubs.length) {
            //   this.score.away += 3;
            // }
          }
          this.$store.dispatch('setScore', score);
        } else if (ring == 3) {
          this.finishInRight();
          this.$store.dispatch('addFighterForm', { id: winner.id, item: 'F' });
          this.$store.dispatch('addFighterForm', { id: fighter.id, item: 'L' });

          //do depending on which side
          if (isHomeAttacking) {
            console.log('Home + 1, finish in right');
            score.home += 1;

            // this.homeSubs.push(winner.id);
            this.$store.dispatch('addHomeSub', winner.id);
            // this.finishes.home++;
            this.$store.dispatch('setFinishes', {
              ...this.finishes,
              home: this.finishes.home + 1,
            });
          } else {
            console.log('Away + 1, finish in right');

            score.away += 1;

            // this.awaySubs.push(winner.id);
            this.$store.dispatch('addAwaySub', winner.id);
            // this.finishes.away++;
            this.$store.dispatch('setFinishes', {
              ...this.finishes,
              away: this.finishes.away + 1,
            });
          }
          this.$store.dispatch('setScore', score);
        }
      }
    },
    finishInLeft() {
      // this.ringFinishedLeft = true;
      this.$store.dispatch('setRingFinishedLeft', true);

      setTimeout(() => {
        // this.ringFinishedLeft = false;
        this.$store.dispatch('setRingFinishedLeft', false);

        setTimeout(() => {
          // this.ringFinishedLeft = true;
          this.$store.dispatch('setRingFinishedLeft', true);

          setTimeout(() => {
            // this.ringFinishedLeft = false;
            this.$store.dispatch('setRingFinishedLeft', false);

            setTimeout(() => {
              // this.ringFinishedLeft = true;
              this.$store.dispatch('setRingFinishedLeft', true);
            }, 250);
          }, 250);
        }, 250);
      }, 250);
    },
    finishInCenter() {
      // this.ringFinishedCenter = true;
      this.$store.dispatch('setRingFinishedCenter', true);
      setTimeout(() => {
        // this.ringFinishedCenter = false;
        this.$store.dispatch('setRingFinishedCenter', false);
        setTimeout(() => {
          // this.ringFinishedCenter = true;
          this.$store.dispatch('setRingFinishedCenter', true);
          setTimeout(() => {
            // this.ringFinishedCenter = false;
            this.$store.dispatch('setRingFinishedCenter', false);
            setTimeout(() => {
              // this.ringFinishedCenter = true;
              this.$store.dispatch('setRingFinishedCenter', true);
            }, 250);
          }, 250);
        }, 250);
      }, 250);
    },
    finishInRight() {
      // this.ringFinishedRight = true;
      this.$store.dispatch('setRingFinishedRight', true);
      setTimeout(() => {
        // this.ringFinishedRight = false;
        this.$store.dispatch('setRingFinishedRight', false);
        setTimeout(() => {
          // this.ringFinishedRight = true;
          this.$store.dispatch('setRingFinishedRight', true);
          setTimeout(() => {
            // this.ringFinishedRight = false;
            this.$store.dispatch('setRingFinishedRight', false);
            setTimeout(() => {
              // this.ringFinishedRight = true;
              this.$store.dispatch('setRingFinishedRight', true);
            }, 250);
          }, 250);
        }, 250);
      }, 250);
    },
    resetFighters() {
      this.getFighter(this.homeTactic.selection.left).match.controlled = false;
      this.getFighter(this.homeTactic.selection.left).match.grappled = false;
      this.getFighter(this.awayTactic.selection.left).match.controlled = false;
      this.getFighter(this.awayTactic.selection.left).match.grappled = false;
      this.getFighter(
        this.homeTactic.selection.center
      ).match.controlled = false;
      this.getFighter(this.homeTactic.selection.center).match.grappled = false;
      this.getFighter(
        this.awayTactic.selection.center
      ).match.controlled = false;
      this.getFighter(this.awayTactic.selection.center).match.grappled = false;
      this.getFighter(this.homeTactic.selection.right).match.controlled = false;
      this.getFighter(this.homeTactic.selection.right).match.grappled = false;
      this.getFighter(this.awayTactic.selection.right).match.controlled = false;
      this.getFighter(this.awayTactic.selection.right).match.grappled = false;
    },
  },
};
</script>

<style>
.unispace {
  font-family: 'Courier New', Courier, monospace;
  font-size: 8pt;
}

.rounds {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 100%;
  background-color: #585757;
}
.activeRound {
  background-color: #ccc;
}
</style>
