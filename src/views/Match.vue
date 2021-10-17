<template>
  <v-container>
    <!-- floating -->

    <v-container
      style="position: absolute; top: 10%; right: 5%"
      class="pa-0 ma-0 d-flex justify-end"
    >
      <v-btn class="" v-if="isDeveloper" @click="testEnd()"
        >end with a decision</v-btn
      >
    </v-container>

    <TruePoints :truePoints="truePoints" v-if="isDeveloper" />
    <!-- /floating -->

    <!-- COMMENTARY -->
    <v-row class="mt-0">
      <Commentary :messages="messages" />

      <v-col class="text-center pt-1">
        <v-col>
          <v-card class="commentary">
            <v-col>
              <v-row>
                <v-col
                  align="center"
                  v-for="(element, index) in rounds"
                  :key="index"
                >
                  <div
                    class="rounds title font-shadow pt-1"
                    v-bind:class="{
                      activeRound: round > index,
                      'accent--text': round > index,
                    }"
                  >
                    {{ index + 1 }}
                  </div>
                </v-col>
              </v-row>
            </v-col>
            <v-col>
              <v-btn class="primary timestampbtn">
                {{ timestamp }}
              </v-btn>
              <v-btn
                class="controlbtn"
                :disabled="isFullTime"
                @click="startRound()"
                v-if="isBetweenRounds"
              >
                Start Round
              </v-btn>
              <v-btn
                class="controlbtn success"
                :disabled="isDisabled || isFullTime"
                @click="getOn()"
                v-else
              >
                Get on
              </v-btn>
              <v-btn
                class="controlbtn rightmostbtn secondary"
                v-if="isFullTime"
                @click="endMatch()"
              >
                End Match
              </v-btn>
              <v-btn
                class="controlbtn rightmostbtn fifth"
                v-if="!isFullTime"
                :disabled="isPaused"
                @click="isPaused = !isPaused"
              >
                Pause
              </v-btn>
              <span class="ml-5"></span>

              <v-btn
                small
                class="seventh"
                :disabled="!isFast"
                @click="setIntervalFast()"
                >+</v-btn
              >

              <v-btn
                small
                class="seventh"
                :disabled="isFast"
                @click="setIntervalSlow()"
                >-</v-btn
              >
            </v-col>
          </v-card>
        </v-col>
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
        />
        <Bench
          v-if="isTabBench"
          :awayTactic="awayTactic"
          :homeTactic="homeTactic"
          :awaySubs="awaySubs"
          :homeSubs="homeSubs"
          :substitutionAvailable="substitutionAvailable"
        />
        <MatchTactics
          v-if="isTabMatchTactics"
          :tactic="getClub(selectedClubId).tactic"
          :ringFinishedLeft="ringFinishedLeft"
          :ringFinishedCenter="ringFinishedCenter"
          :ringFinishedRight="ringFinishedRight"
        />

        <JudgesCard
          v-if="isTabJudgesCard"
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
  </v-container>
</template>

<script>
import data from '@/data/data.js';
import classes from '@/data/classes.js';
import matchEngine from '@/engine/matchEngine.js';
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
  },

  created() {
    this.seedRoundsToPointCounters();
    this.resetFighterMatchStats();
    this.assignJudges();
    this.setTactics();
    this.$store.dispatch('setNames', this.names);
    this.$store.dispatch('setIsLive', true);
  },

  data: () => ({
    //bools
    isFullTime: false,
    isBetweenRounds: true,
    isHomeAttack: true,
    isDisabled: false,
    isPaused: false,
    isDecision: false,
    isScored: false,

    //x, y minute rounds
    rounds: [1, 2, 3],
    minutes: 5,
    //current round, minute, second
    minute: 0,
    second: 0,
    round: 0,

    happenChance: 11,

    //ui
    tabs: data.tabs.match,
    showJudgesCard: true,

    //match data
    homeTactic: {},
    awayTactic: {},
    homeSubs: [],
    awaySubs: [],

    score: {
      home: 0,
      away: 0,
    },
    substitutionMade: false,
    pendingSub: false,
    ringActivity: [
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
    ],

    ringFinishedLeft: false,
    ringFinishedCenter: false,
    ringFinishedRight: false,

    ringDecisions: {
      ringDecisionLeft: undefined,
      ringDecisionCenter: undefined,
      ringDecisionRight: undefined,
    },

    ringJudges: {
      ringJudgesLeft: [],
      ringJudgesCenter: [],
      ringJudgesRight: [],
    },
    ringTruePoints: {
      ringTruePointsLeft: [],
      ringTruePointsCenter: [],
      ringTruePointsRight: [],
    },

    cards: {},
    finishes: { home: 0, away: 0 },
  }),

  computed: {
    selectedClubId() {
      return this.$store.getters.selectedClubId;
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
    isDeveloper() {
      return this.$store.getters.isDeveloper;
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
    isTabJudgesCard() {
      if (this.isDecision) {
        return this.tabs[3].value;
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
    showZero() {
      return this.second < 10 ? true : false;
    },
    timestamp() {
      return this.isFullTime
        ? 'full time'
        : this.showZero
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

    //data
    schedule() {
      return this.$store.getters.schedule;
    },
    commission() {
      return this.$store.getters.commission;
    },

    //judges card
    truePoints() {
      const {
        ringTruePointsLeft,
        ringTruePointsCenter,
        ringTruePointsRight,
      } = this.ringTruePoints;
      const rings = [];
      rings.push(ringTruePointsLeft);
      rings.push(ringTruePointsCenter);
      rings.push(ringTruePointsRight);
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

    //match
    isFast() {
      return this.$store.getters.timeoutInterval > 500 ? true : false;
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

    substitutionAvailable() {
      return this.homeSubs.length || this.awaySubs.length ? true : false;
    },

    //other
    timeoutInterval() {
      return this.$store.getters.timeoutInterval;
    },
  },

  methods: {
    //init
    resetFighterMatchStats() {
      function reset(item) {
        item.match.save = false;
        item.match.dc = null;
        item.match.exposed = 0;
        item.match.condition =
          item.fitness > item.condition ? item.fitness : item.condition;
        item.match.learned = 0;
        item.match.momentum = false;
        item.match.finished = false;
        item.match.substituted = false;
      }

      reset(this.getFighter(this.homeClub.tactic.selection.center));
      reset(this.getFighter(this.homeClub.tactic.selection.left));
      reset(this.getFighter(this.homeClub.tactic.selection.right));
      reset(this.getFighter(this.awayClub.tactic.selection.center));
      reset(this.getFighter(this.awayClub.tactic.selection.left));
      reset(this.getFighter(this.awayClub.tactic.selection.right));
    },
    seedRoundsToPointCounters() {
      const {
        ringTruePointsLeft,
        ringTruePointsCenter,
        ringTruePointsRight,
      } = this.ringTruePoints;
      this.rounds.forEach((element) => {
        ringTruePointsLeft.push({
          round: element,
          home: 0,
          away: 0,
          homeSignificant: 0,
          awaySignificant: 0,
        });
        ringTruePointsCenter.push({
          round: element,
          home: 0,
          away: 0,
          homeSignificant: 0,
          awaySignificant: 0,
        });
        ringTruePointsRight.push({
          round: element,
          home: 0,
          away: 0,
          homeSignificant: 0,
          awaySignificant: 0,
        });
      });
    },
    assignJudges() {
      const {
        ringJudgesLeft,
        ringJudgesCenter,
        ringJudgesRight,
      } = this.ringJudges;
      for (let i = 0; i < 3; i++) {
        ringJudgesLeft.push(this.commission[i]);
      }
      for (let i = 3; i < 6; i++) {
        ringJudgesCenter.push(this.commission[i]);
      }
      for (let i = 6; i < 9; i++) {
        ringJudgesRight.push(this.commission[i]);
      }
    },
    setTactics() {
      this.homeTactic = { ...this.homeTactic, ...this.homeClub.tactic };
      this.awayTactic = { ...this.awayTactic, ...this.awayClub.tactic };
    },

    //ui
    selectTab(selection) {
      for (let i = 0; i < this.tabs.length; i++) {
        this.tabs[i].value = false;
      }
      this.tabs[selection].value = true;
      console.log(this.tabs[selection].value);
    },

    //services
    setIntervalFast() {
      this.$store.dispatch('setTimeoutInterval', 200);
    },
    setIntervalSlow() {
      this.$store.dispatch('setTimeoutInterval', 750);
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

    archiveMatch() {
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

      console.log(judgesCard);

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

      if (this.homeClub.npc) {
        content = engine.formatNewsClub(content, this.homeClub.name);
        content = engine.formatNewsPoints(
          content,
          homeClubData.competitions.league.points
        );
        content = engine.formatNewsFinishes(
          content,
          homeClubData.competitions.league.finishes
        );
      } else {
        content = engine.formatNewsClub(content, this.awayClub.name);
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
      this.isDecision = true;
      this.isFullTime = true;

      const {
        ringTruePointsLeft,
        ringTruePointsCenter,
        ringTruePointsRight,
      } = this.ringTruePoints;

      ringTruePointsLeft[0].round = 1;
      ringTruePointsLeft[0].home = 2;
      ringTruePointsLeft[0].away = 2;
      ringTruePointsLeft[0].homeSignificant = 3;
      ringTruePointsLeft[0].awaySignificant = 1;
      ringTruePointsLeft[1].round = 2;
      ringTruePointsLeft[1].home = 2;
      ringTruePointsLeft[1].away = 2;
      ringTruePointsLeft[1].homeSignificant = 3;
      ringTruePointsLeft[1].awaySignificant = 1;
      ringTruePointsLeft[2].round = 3;
      ringTruePointsLeft[2].home = 2;
      ringTruePointsLeft[2].away = 2;
      ringTruePointsLeft[2].homeSignificant = 3;
      ringTruePointsLeft[2].awaySignificant = 1;

      ringTruePointsCenter[0].round = 1;
      ringTruePointsCenter[0].home = 4;
      ringTruePointsCenter[0].away = 4;
      ringTruePointsCenter[0].homeSignificant = 2;
      ringTruePointsCenter[0].awaySignificant = 4;
      ringTruePointsCenter[1].round = 2;
      ringTruePointsCenter[1].home = 4;
      ringTruePointsCenter[1].away = 4;
      ringTruePointsCenter[1].homeSignificant = 2;
      ringTruePointsCenter[1].awaySignificant = 4;
      ringTruePointsCenter[2].round = 3;
      ringTruePointsCenter[2].home = 4;
      ringTruePointsCenter[2].away = 4;
      ringTruePointsCenter[2].homeSignificant = 2;
      ringTruePointsCenter[2].awaySignificant = 4;

      ringTruePointsRight[0].round = 1;
      ringTruePointsRight[0].home = 7;
      ringTruePointsRight[0].away = 7;
      ringTruePointsRight[0].homeSignificant = 6;
      ringTruePointsRight[0].awaySignificant = 8;
      ringTruePointsRight[1].round = 2;
      ringTruePointsRight[1].home = 7;
      ringTruePointsRight[1].away = 7;
      ringTruePointsRight[1].homeSignificant = 6;
      ringTruePointsRight[1].awaySignificant = 8;
      ringTruePointsRight[2].round = 3;
      ringTruePointsRight[2].home = 7;
      ringTruePointsRight[2].away = 7;
      ringTruePointsRight[2].homeSignificant = 6;
      ringTruePointsRight[2].awaySignificant = 8;

      this.decision();
    },
    endMatch() {
      // this.resetFighterMatchStats();

      this.tabs.splice(3, 4);
      this.selectTab(0);
      this.archiveMatch();
      this.$store.dispatch('setIsLive', false);
      this.$store.dispatch('setIsMatchday', false);
      this.$store.dispatch('setIsPostMatch', true);
      this.$router.push('/fixtures');
    },

    endRound() {
      this.isBetweenRounds = true;
      if (this.round == this.rounds.length) {
        //decision
        this.isFullTime = true;
        this.decision();
      }
      this.$store.dispatch(
        'addMatchMessage',
        `That's the end of round ${this.round}`
      );
    },
    startRound() {
      this.round++;
      this.isBetweenRounds = false;
      this.$store.dispatch('addMatchMessage', `Round ${this.round} Fight!`);
      setTimeout(() => {
        if (!this.isFullTime) {
          this.getOn();
        }
      }, 1000);
    },
    pickRing() {
      // implement something to make less random and more based on:
      // exposed, learned, pace, tactics
      if (this.ringFinishedLeft && this.ringFinishedRight) {
        return 2;
      } else if (this.ringFinishedLeft) {
        return matchEngine.roll(2) + 1;
      } else if (this.ringFinishedRight) {
        return matchEngine.roll(2);
      } else {
        return matchEngine.roll(3);
      }
    },
    makeSubstitution() {
      let msg;
      if (this.isHomeAttack) {
        if (this.awaySubs[0] == this.awayTactic.selection.left) {
          console.log(this.awaySubs[0]);
          this.awayTactic.selection.left = this.awayTactic.selection.center;
        } else if (this.awaySubs[0] == this.awayTactic.selection.right) {
          console.log(this.awaySubs[0]);
          this.awayTactic.selection.right = this.awayTactic.selection.center;
        }

        this.awayTactic.selection.center = this.awaySubs[0];
        this.awaySubs.splice(0, 1);
        msg = `${
          this.getFighter(this.awayTactic.selection.center).personal.name
        } comes on!`;
        this.$store.dispatch('addMatchMessage', msg);
      } else {
        if (this.homeSubs[0] == this.homeTactic.selection.left) {
          this.homeTactic.selection.left = this.homeTactic.selection.center;
        } else if (this.homeSubs[0] == this.homeTactic.selection.right) {
          this.homeTactic.selection.right = this.homeTactic.selection.center;
        }

        this.homeTactic.selection.center = this.homeSubs[0];
        this.homeSubs.splice(0, 1);
        msg = `${
          this.getFighter(this.homeTactic.selection.center).personal.name
        } comes on!`;
        this.$store.dispatch('addMatchMessage', msg);
      }

      this.ringFinishedCenter = false;
      this.pendingSub = false;
    },

    //scoring/points/counting
    scoreRounds() {
      const {
        ringTruePointsLeft,
        ringTruePointsCenter,
        ringTruePointsRight,
      } = this.ringTruePoints;
      const {
        ringJudgesLeft,
        ringJudgesCenter,
        ringJudgesRight,
      } = this.ringJudges;

      // sets this.decisions
      this.ringDecisions.ringDecisionLeft = decisionEngine.scoreRounds(
        ringJudgesLeft,
        ringTruePointsLeft
      );
      this.ringDecisions.ringDecisionCenter = decisionEngine.scoreRounds(
        ringJudgesCenter,
        ringTruePointsCenter
      );
      this.ringDecisions.ringDecisionRight = decisionEngine.scoreRounds(
        ringJudgesRight,
        ringTruePointsRight
      );
    },
    decision() {
      this.scoreRounds();

      // for center ring, the club with more fighters standing takes it
      if (this.homeStillStanding > this.awayStillStanding) {
        this.score.home += 2;
      } else if (this.homeStillStanding < this.awayStillStanding) {
        this.score.away += 2;
      } else {
        // we go to a decision
        if (this.ringFinishedLeft) {
          this.cards.leftMsg = 'Finish';
        }
        if (this.ringFinishedRight) {
          this.cards.rightMsg = 'Finish';
        }

        this.isDecision = true; // opens Judges' Cards !
        this.tabs.push({ name: 'judges card', value: false });
        this.selectTab(3);
      }

      this.$store.dispatch('setScore', this.score);
    },

    countActivity(ring, outcome) {
      if (this.isHomeAttack) {
        this.ringActivity[ring - 1].home += 1;
        if (outcome.significant) {
          this.ringActivity[ring - 1].homeSignificant += 1;
        }
      } else {
        this.ringActivity[ring - 1].away += 1;
        if (outcome.significant) {
          this.ringActivity[ring - 1].awaySignificant += 1;
        }
      }
    },
    countScore(result) {
      if (!this.isScored) {
        this.score.home = this.score.home + result[1].home;
        this.score.away = this.score.away + result[1].away;

        this.commitFighterForm(
          result[0].center,
          this.homeTactic.selection.center,
          this.awayTactic.selection.center
        );

        if (!this.ringFinishedLeft) {
          this.commitFighterForm(
            result[0].left,
            this.homeTactic.selection.left,
            this.awayTactic.selection.left
          );
        }
        if (!this.ringFinishedRight) {
          this.commitFighterForm(
            result[0].right,
            this.homeTactic.selection.right,
            this.awayTactic.selection.right
          );
        }
        this.$store.dispatch('setScore', this.score);

        this.isScored = true;
      }
    },
    commitFighterForm(result, home, away) {
      let homeCount = 0;
      let awayCount = 0;

      result.forEach((judge) => {
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
      this.isDisabled = true;
      this.isPaused = false;
      this.second = matchEngine.rollEvent(this.second, this.happenChance);
      if (this.second >= 59) {
        this.minute++;
        this.second = 0;

        if (this.minute == 5) {
          this.minute = 0;
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
        ring = this.pickRing();
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
        this.$store.dispatch('addMatchMessage', `${this.timestamp} ${msg}`);

        //pick fighter initiative
        const homeInitiative = matchEngine.checkInitiative(home);
        const awayInitiative = matchEngine.checkInitiative(away);

        console.log(homeInitiative);
        console.log(awayInitiative);

        if (homeInitiative >= awayInitiative) {
          //tiniest home advantage
          this.isHomeAttack = true;
          attacker = home;
          defender = away;
        } else {
          this.isHomeAttack = false;
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
          this.$store.dispatch('addMatchMessage', msg);
        }, this.timeoutInterval); // INTERVAL

        //pick method of attack
        let attackMethod = matchEngine.pickMethodAttack(attacker);
        let outcome = matchEngine.engage(attackMethod, attacker, defender);
        console.log(outcome);

        //count activity
        this.countActivity(ring, outcome);

        //OUTCOME
        //sort out the outcome,
        setTimeout(() => {
          this.$store.dispatch('addMatchMessage', outcome.msg);
          this.$store.dispatch('addMatchMessageToRing', {
            ring: ring,
            msg: outcome.msg,
          });
        }, this.timeoutInterval * timeoutIntervalMultiplier); // INTERVAL
        timeoutIntervalMultiplier += 1;

        //updates momentum, condition, exposed and learned
        this.updateFighterMatchStats(attacker, defender, outcome);

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
          this.tallyPoints(ring, outcome);
        }

        //SUBSTITUTION
        if (
          this.ringFinishedCenter &&
          this.substitutionAvailable &&
          !this.isFullTime
        ) {
          this.substitutionMade = true;
          this.pendingSub = true; //triggers makeSubstitution at the beginning of getOn()
          this.isPaused = true;
          this.isDisabled = false;
        }

        // enable button / loop
        setTimeout(() => {
          this.isDisabled = false;
          if (!this.isFullTime) {
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

      timeoutIntervalMultiplier += 0.1;

      if (fighterResult.finished) {
        this.isPaused = true;
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
            this.score.home += 1;
            this.homeSubs.push(winner.id);
            this.finishes.home++;
          } else {
            this.score.away += 1;
            this.awaySubs.push(winner.id);
            this.finishes.away++;
          }
          this.$store.dispatch('setScore', this.score);
        } else if (ring == 2) {
          this.finishInCenter();
          this.$store.dispatch('addFighterForm', { id: winner.id, item: 'F' });
          this.$store.dispatch('addFighterForm', { id: fighter.id, item: 'L' });

          //do depending on which side
          if (isHomeAttacking) {
            this.finishes.home++;
            if (this.awaySubs.length == 0) {
              this.score.home += 3;
              this.isFullTime = true;

              this.scoreRounds();

              setTimeout(() => {
                this.$store.dispatch('addMatchMessage', msg);
                this.isDisabled = false;
              }, this.timeoutInterval * timeoutIntervalMultiplier);
            }

            // if (!this.awaySubs.length) {
            //   //ef avail
            //   this.score.home += 3;
            // }
          } else {
            this.finishes.away++;
            if (this.homeSubs.length == 0) {
              this.score.away += 3;
              this.isFullTime = true;

              this.scoreRounds();

              setTimeout(() => {
                this.$store.dispatch('addMatchMessage', msg);
                this.isDisabled = false;
              }, this.timeoutInterval * timeoutIntervalMultiplier);
            }
            // if (!this.homeSubs.length) {
            //   this.score.away += 3;
            // }
          }
          this.$store.dispatch('setScore', this.score);
        } else if (ring == 3) {
          this.finishInRight();
          this.$store.dispatch('addFighterForm', { id: winner.id, item: 'F' });
          this.$store.dispatch('addFighterForm', { id: fighter.id, item: 'L' });

          //do depending on which side
          if (isHomeAttacking) {
            this.score.home += 1;

            this.homeSubs.push(winner.id);
            this.finishes.home++;
          } else {
            this.score.away += 1;

            this.awaySubs.push(winner.id);
            this.finishes.away++;
          }
          this.$store.dispatch('setScore', this.score);
        }
      }
    },
    finishInLeft() {
      this.ringFinishedLeft = true;
      setTimeout(() => {
        this.ringFinishedLeft = false;
        setTimeout(() => {
          this.ringFinishedLeft = true;
          setTimeout(() => {
            this.ringFinishedLeft = false;
            setTimeout(() => {
              this.ringFinishedLeft = true;
            }, 250);
          }, 250);
        }, 250);
      }, 250);
    },
    finishInCenter() {
      this.ringFinishedCenter = true;
      setTimeout(() => {
        this.ringFinishedCenter = false;
        setTimeout(() => {
          this.ringFinishedCenter = true;
          setTimeout(() => {
            this.ringFinishedCenter = false;
            setTimeout(() => {
              this.ringFinishedCenter = true;
            }, 250);
          }, 250);
        }, 250);
      }, 250);
    },
    finishInRight() {
      this.ringFinishedRight = true;
      setTimeout(() => {
        this.ringFinishedRight = false;
        setTimeout(() => {
          this.ringFinishedRight = true;
          setTimeout(() => {
            this.ringFinishedRight = false;
            setTimeout(() => {
              this.ringFinishedRight = true;
            }, 250);
          }, 250);
        }, 250);
      }, 250);
    },

    updateFighterMatchStats(attacker, defender, outcome) {
      const { att, def } = outcome;
      attacker.match.condition -= att.damage;
      attacker.match.exposed += att.exposed;
      attacker.match.learned += att.learned;
      attacker.match.momentum = att.momentum;
      attacker.match.save = att.save;
      attacker.match.dc = att.dc;

      attacker.match.exposed = matchEngine.getFlooredToHundred(
        attacker.match.exposed
      );
      attacker.match.learned = matchEngine.getFlooredToHundred(
        attacker.match.learned
      );

      defender.match.condition -= def.damage;
      defender.match.exposed += def.exposed;
      defender.match.learned += def.learned;
      defender.match.momentum = def.momentum;
      defender.match.save = def.save;
      defender.match.dc = def.dc;

      defender.match.exposed = matchEngine.getFlooredToHundred(
        defender.match.exposed
      );
      defender.match.learned = matchEngine.getFlooredToHundred(
        defender.match.learned
      );
    },
    tallyPoints(ring, outcome) {
      const {
        ringTruePointsLeft,
        ringTruePointsCenter,
        ringTruePointsRight,
      } = this.ringTruePoints;
      if (ring == 1) {
        // LEFT
        if (this.isHomeAttack) {
          ringTruePointsLeft[this.round - 1].home += 1;
          if (outcome.significant) {
            ringTruePointsLeft[this.round - 1].homeSignificant += 1;
          }
        } else {
          ringTruePointsLeft[this.round - 1].away += 1;
          if (outcome.significant) {
            ringTruePointsLeft[this.round - 1].awaySignificant += 1;
          }
        }
      } else if (ring == 2) {
        // CENTER
        if (this.isHomeAttack) {
          ringTruePointsCenter[this.round - 1].home += 1;
          if (outcome.significant) {
            ringTruePointsCenter[this.round - 1].homeSignificant += 1;
          }
        } else {
          ringTruePointsCenter[this.round - 1].away += 1;
          if (outcome.significant) {
            ringTruePointsCenter[this.round - 1].awaySignificant += 1;
          }
        }
      } else if (ring == 3) {
        // RIGHT
        if (this.isHomeAttack) {
          ringTruePointsRight[this.round - 1].home += 1;
          if (outcome.significant) {
            ringTruePointsLeft[this.round - 1].homeSignificant += 1;
          }
        } else {
          ringTruePointsRight[this.round - 1].away += 1;
          if (outcome.significant) {
            ringTruePointsRight[this.round - 1].awaySignificant += 1;
          }
        }
      }
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
  width: 50px;
  height: 50px;
  border-radius: 100%;
  background-color: #585757;
}
.activeRound {
  background-color: #ccc;
}
</style>
