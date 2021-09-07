<template>
  <v-container>
    <v-container style="position: absolute; left: 0%" class="pa-0 ma-0">
      <v-btn v-if="isDeveloper" @click="testEnd()">end with a decision</v-btn>
    </v-container>

    <!-- floating -->
    <JudgesCard
      v-if="isDecision && showJudgesCard"
      :decisions="decisions"
      :judges="judges"
      :cards="cards"
      @closed="showJudgesCard = false"
    />
    <!-- floating -->
    <TruePoints :allRings="allRings" v-if="isDeveloper" />

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
                class="controlbtn"
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
                class="controlbtn rightmostbtn secondary"
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
        />
      </v-card>
    </v-col>

    <!-- DETAILS -->
    <Details :activity="ringActivity" />
  </v-container>
</template>

<script>
import data from "@/data/data.js";
import matchEngine from "@/engine/matchEngine.js";

export default {
  name: "Match",

  components: {
    JudgesCard: () => import("@/components/Match/JudgesCard.vue"),
    TruePoints: () => import("@/components/Match/TruePoints.vue"),
    Commentary: () => import("@/components/Match/Commentary.vue"),
    Overview: () => import("@/components/Match/Overview.vue"),
    Details: () => import("@/components/Match/Details.vue"),
    Bench: () => import("@/components/Match/Bench.vue"),
  },

  created() {
    this.seedRoundsToPointCounters();
    this.resetFighterMatchStats();
    this.assignJudges();
    this.setTactics();
    this.$store.dispatch("setNames", this.names);
    this.$store.dispatch("setIsLive", true);

    this.archivedMatch = new matchEngine.getArchivedMatchBlueprint(
      this.$route.params.id
    );
  },

  data: () => ({
    //bools
    isFullTime: false,
    isBetweenRounds: true,
    isHomeAttack: true,
    isDisabled: false,
    isPaused: false,
    isDecision: false,

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

    ringDecisionLeft: undefined,
    ringDecisionCenter: undefined,
    ringDecisionRight: undefined,
    ringFinishedLeft: false,
    ringFinishedCenter: false,
    ringFinishedRight: false,
    ringJudgesLeft: [],
    ringJudgesCenter: [],
    ringJudgesRight: [],
    truePointsLeft: [],
    truePointsCenter: [],
    truePointsRight: [],
    cards: {},
  }),

  computed: {
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
    isTabJudgesCard() {
      return this.tabs[2].value;
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
        ? "full time"
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
    allRings() {
      var rings = [];
      rings.push(this.truePointsLeft);
      rings.push(this.truePointsCenter);
      rings.push(this.truePointsRight);
      return rings;
    },
    judges() {
      var judges = [];
      judges.push(this.ringJudgesLeft);
      judges.push(this.ringJudgesCenter);
      judges.push(this.ringJudgesRight);
      return judges;
    },
    decisions() {
      var decisions = [];
      decisions.push(this.ringDecisionLeft);
      decisions.push(this.ringDecisionCenter);
      decisions.push(this.ringDecisionRight);
      return decisions;
    },
    homeStillStanding() {
      var homeStillStanding = 0;

      this.getFighter(this.homeTactic.selection.left).match.finished
        ? homeStillStanding
        : (homeStillStanding += 1);
      this.getFighter(this.homeTactic.selection.center).match.finished
        ? homeStillStanding
        : (homeStillStanding += 1);
      this.getFighter(this.homeTactic.selection.right).match.finished
        ? homeStillStanding
        : (homeStillStanding += 1);

      return homeStillStanding;
    },
    awayStillStanding() {
      var awayStillStanding = 0;
      this.getFighter(this.awayTactic.selection.left).match.finished
        ? awayStillStanding
        : (awayStillStanding += 1);
      this.getFighter(this.awayTactic.selection.center).match.finished
        ? awayStillStanding
        : (awayStillStanding += 1);
      this.getFighter(this.awayTactic.selection.right).match.finished
        ? awayStillStanding
        : (awayStillStanding += 1);
      return awayStillStanding;
    },

    //match
    isFast() {
      return this.$store.getters.timeoutInterval > 500 ? true : false;
    },
    match() {
      var match;
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

    attackTactic() {
      return this.isHomeAttack ? this.homeTactic : this.awayTactic;
    },
    defendTactic() {
      return this.isHomeAttack ? this.awayTactic : this.awayTactic;
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
      var homeCenter = this.getFighter(this.homeClub.tactic.selection.center);
      var homeLeft = this.getFighter(this.homeClub.tactic.selection.left);
      var homeRight = this.getFighter(this.homeClub.tactic.selection.right);
      var awayCenter = this.getFighter(this.awayClub.tactic.selection.center);
      var awayLeft = this.getFighter(this.awayClub.tactic.selection.left);
      var awayRight = this.getFighter(this.awayClub.tactic.selection.right);

      function reset(item) {
        item.match.exposed = 0;
        item.match.condition = homeCenter.fitness;
        item.match.learned = 0;
        item.match.momentum = false;
        item.match.finished = false;
        item.match.substituted = false;
      }

      reset(homeCenter);
      reset(homeLeft);
      reset(homeRight);
      reset(awayCenter);
      reset(awayLeft);
      reset(awayRight);
      reset(awayRight);
    },
    seedRoundsToPointCounters() {
      this.rounds.forEach((element) => {
        this.truePointsLeft.push({
          round: element,
          home: 0,
          away: 0,
          homeSignificant: 0,
          awaySignificant: 0,
        });
        this.truePointsCenter.push({
          round: element,
          home: 0,
          away: 0,
          homeSignificant: 0,
          awaySignificant: 0,
        });
        this.truePointsRight.push({
          round: element,
          home: 0,
          away: 0,
          homeSignificant: 0,
          awaySignificant: 0,
        });
      });
    },
    assignJudges() {
      for (let i = 0; i < 3; i++) {
        this.ringJudgesLeft.push(this.commission[i]);
      }
      for (let i = 3; i < 6; i++) {
        this.ringJudgesCenter.push(this.commission[i]);
      }
      for (let i = 6; i < 9; i++) {
        this.ringJudgesRight.push(this.commission[i]);
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
    },

    //services
    setIntervalFast() {
      this.$store.dispatch("setTimeoutInterval", 200);
    },
    setIntervalSlow() {
      this.$store.dispatch("setTimeoutInterval", 750);
    },
    firstName(fighter) {
      return fighter.personal.name.split(" ")[0];
    },
    lastName(fighter) {
      return fighter.personal.name.split(" ")[1];
    },
    getClub(id) {
      return this.$store.getters.getClubById(id);
    },
    getFighter(id) {
      return this.$store.getters.getFighterById(id);
    },

    archiveMatch() {
      var match = {
        date: this.match.date,
        clubs: this.match.clubs,
        judges: this.judges,
        decisions: this.decisions,
        cards: this.cards,
        score: this.score,
        ringActivity: this.ringActivity,
        //hopefully these fighters will pass their .match
        //especially match.finished to see which side won
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

      this.$store.dispatch("addMatch", match);
    },

    //basics
    testEnd() {
      this.isDecision = true;
      this.isFullTime = true;

      this.truePointsLeft[0].round = 1;
      this.truePointsLeft[0].home = 2;
      this.truePointsLeft[0].away = 2;
      this.truePointsLeft[0].homeSignificant = 3;
      this.truePointsLeft[0].awaySignificant = 1;
      this.truePointsLeft[1].round = 2;
      this.truePointsLeft[1].home = 2;
      this.truePointsLeft[1].away = 2;
      this.truePointsLeft[1].homeSignificant = 3;
      this.truePointsLeft[1].awaySignificant = 1;
      this.truePointsLeft[2].round = 3;
      this.truePointsLeft[2].home = 2;
      this.truePointsLeft[2].away = 2;
      this.truePointsLeft[2].homeSignificant = 3;
      this.truePointsLeft[2].awaySignificant = 1;

      this.truePointsCenter[0].round = 1;
      this.truePointsCenter[0].home = 4;
      this.truePointsCenter[0].away = 4;
      this.truePointsCenter[0].homeSignificant = 2;
      this.truePointsCenter[0].awaySignificant = 4;
      this.truePointsCenter[1].round = 2;
      this.truePointsCenter[1].home = 4;
      this.truePointsCenter[1].away = 4;
      this.truePointsCenter[1].homeSignificant = 2;
      this.truePointsCenter[1].awaySignificant = 4;
      this.truePointsCenter[2].round = 3;
      this.truePointsCenter[2].home = 4;
      this.truePointsCenter[2].away = 4;
      this.truePointsCenter[2].homeSignificant = 2;
      this.truePointsCenter[2].awaySignificant = 4;

      this.truePointsRight[0].round = 1;
      this.truePointsRight[0].home = 7;
      this.truePointsRight[0].away = 7;
      this.truePointsRight[0].homeSignificant = 6;
      this.truePointsRight[0].awaySignificant = 8;
      this.truePointsRight[1].round = 2;
      this.truePointsRight[1].home = 7;
      this.truePointsRight[1].away = 7;
      this.truePointsRight[1].homeSignificant = 6;
      this.truePointsRight[1].awaySignificant = 8;
      this.truePointsRight[2].round = 3;
      this.truePointsRight[2].home = 7;
      this.truePointsRight[2].away = 7;
      this.truePointsRight[2].homeSignificant = 6;
      this.truePointsRight[2].awaySignificant = 8;

      this.decision();
    },
    endMatch() {
      // this.resetFighterMatchStats();
     
      this.archiveMatch();
      this.$store.dispatch("setIsLive", false);
      this.$store.dispatch("setMatchday", false);
      this.$router.push("/");
    },

    endRound() {
      this.isBetweenRounds = true;
      if (this.round == this.rounds.length) {
        //decision
        this.isFullTime = true;
        this.decision();
      }
      this.$store.dispatch(
        "addMatchMessage",
        `That's the end of round ${this.round}`
      );
    },
    startRound() {
      this.round++;
      this.isBetweenRounds = false;
      this.$store.dispatch("addMatchMessage", `Round ${this.round} Fight!`);
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
      var msg;
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
        this.$store.dispatch("addMatchMessage", msg);
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
        this.$store.dispatch("addMatchMessage", msg);
      }

      this.ringFinishedCenter = false;
      this.pendingSub = false;
    },

    //scoring/points/counting
    decision() {
      // for center ring, the club with more fighters standing takes it
      if (this.homeStillStanding > this.awayStillStanding) {
        this.score.home += 3;
      } else if (this.homeStillStanding < this.awayStillStanding) {
        this.score.away += 3;
      } else {
        // we go to a decision
        this.ringDecisionLeft = matchEngine.scoreRounds(
          this.ringJudgesLeft,
          this.truePointsLeft
        );
        this.ringDecisionCenter = matchEngine.scoreRounds(
          this.ringJudgesCenter,
          this.truePointsCenter
        );
        this.ringDecisionRight = matchEngine.scoreRounds(
          this.ringJudgesRight,
          this.truePointsRight
        );

        if (this.ringFinishedLeft) {
          this.cards.leftMsg = "Finish";
        } else if (this.ringFinishedCenter) {
          this.cards.centerMsg = "Finish";
        } else if (this.ringFinishedRight) {
          this.cards.rightMsg = "Finish";
        }

        this.isDecision = true; // opens Judges' Cards
        this.$store.dispatch("setScore", this.score);

        setTimeout(() => {
          // timeout because component JudgesCard saves the list needed to the state
          // and it hasnt loaded yet ::thinking::
          this.countScore();
        }, this.timeoutInterval);
      }
    },
    countActivity(isHomeAttack, ring, outcome) {
      if (isHomeAttack) {
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
    countScore() {
      let messager = function(winner, loser) {
        if (loser == 0 && winner == 3) {
          return "Unanimous Decision";
        } else if (loser == 0 || winner == 1) {
          return "Majority Decision";
        } else {
          return "Split Decision";
        }
      };

      var homeCount = 0;
      var awayCount = 0;

      if (!this.ringFinishedLeft) {
        this.cards.left.forEach((score) => {
          if (score.home == true && score.away == false) {
            homeCount += 1;
          } else if (score.home == false && score.away == true) {
            awayCount += 1;
          }
        });

        if (homeCount != awayCount) {
          if (homeCount > awayCount) {
            this.score.home += 1;
            this.cards.leftMsg = messager(homeCount, awayCount);
          } else {
            this.score.away += 1;
            this.cards.leftMsg = messager(awayCount, homeCount);
          }
        } else {
          this.cards.leftMsg = "Draw";
        }
        console.log(homeCount);
        console.log(awayCount);

        homeCount = 0;
        awayCount = 0;
      }

      if (!this.ringFinishedRight) {
        this.cards.right.forEach((score) => {
          if (score.home == true && score.away == false) {
            homeCount += 1;
          } else if (score.home == false && score.away == true) {
            awayCount += 1;
          }
        });

        if (homeCount != awayCount) {
          if (homeCount > awayCount) {
            this.score.home += 1;
            this.cards.rightMsg = messager(homeCount, awayCount);
          } else {
            this.score.away += 1;
            this.cards.rightMsg = messager(awayCount, homeCount);
          }
        } else {
          this.cards.rightMsg = "Draw";
        }

        console.log(homeCount);
        console.log(awayCount);

        homeCount = 0;
        awayCount = 0;
      }

      this.cards.center.forEach((score) => {
        if (score.home == true && score.away == false) {
          homeCount += 1;
        } else if (score.home == false && score.away == true) {
          awayCount += 1;
        }
      });

      console.log(homeCount);
      console.log(awayCount);

      if (homeCount == awayCount) {
        this.score.home += 1;
        this.score.away += 1;
        this.cards.centerMsg = "Draw";
      } else {
        if (homeCount > awayCount) {
          this.score.home += 3;
          this.cards.centerMsg = messager(homeCount, awayCount);
        } else {
          this.score.away += 3;
          this.cards.centerMsg = messager(awayCount, homeCount);
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
        var timeoutIntervalMultiplier = 2;
        // INTERVAL are throughout, make sure they sync
        var msg;
        var ring;
        // fighter variables
        var home, away, attacker, defender;

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
        this.$store.dispatch("addMatchMessage", `${this.timestamp} ${msg}`);

        //pick fighter initiative
        var homeInitiative = matchEngine.checkInitiative(home);
        var awayInitiative = matchEngine.checkInitiative(away);

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
          ...this.attackTactic.instructions,
        };
        defender.tactic.instructions = {
          ...defender.tactic.instructions,
          ...this.defendTactic.instructions,
        };

        msg = `${attacker.nickname} attacks ${defender.nickname}`;
        setTimeout(() => {
          this.$store.dispatch("addMatchMessage", msg);
        }, this.timeoutInterval); // INTERVAL

        //pick method of attack
        let attackMethod = matchEngine.pickMethodAttack(attacker);
        let outcome = matchEngine.engage(attackMethod, attacker, defender);
        console.log(outcome);

        //count activity
        this.countActivity(this.isHomeAttack, ring, outcome);

        //OUTCOME
        //sort out the outcome,
        setTimeout(() => {
          this.$store.dispatch("addMatchMessage", outcome.msg);
          this.$store.dispatch("addMatchMessageToRing", {
            ring: ring,
            msg: outcome.msg,
          });
        }, this.timeoutInterval * timeoutIntervalMultiplier); // INTERVAL
        timeoutIntervalMultiplier += 1;

        //check for disengage // could be part of updateFighterMatchStats?
        // all it's doing is giving exposed back.. could be called sth else
        if (outcome.disengage) {
          console.log("disengaging");
          defender.match.exposed -= matchEngine.disengage(defender);
          if (defender.match.exposed < 0) {
            defender.match.exposed = 0;
          }
          // msg = `${defender.nickname} disengages and resets`;
          // this.$store.dispatch("addMatchMessage", msg);
        }
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

        this.$store.dispatch("setScore", this.score);

        if (outcome.point) {
          // TODO
          this.tallyPoints(ring, outcome);
        }

        //Find:SUBSTITUTION
        if (
          this.ringFinishedCenter &&
          this.substitutionAvailable &&
          !this.isFullTime
        ) {
          this.substitutionMade = true;
          this.pendingSub = true; //triggers makeSubstitution at the beginning of getOn()
          this.isPaused = true;
          this.isDisabled = false;
          // give some time for sub
          // timeoutIntervalMultiplier += 3;
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
      var msg = `That concludes the match`;
      var fighterResult = this.checkCondition(fighter);

      timeoutIntervalMultiplier += 0.1;

      if (fighterResult.finished) {
        this.isPaused = true;
        fighter.match.finished = true;
        setTimeout(() => {
          this.$store.dispatch("addMatchMessage", fighterResult.msg);
        }, this.timeoutInterval * timeoutIntervalMultiplier);
        timeoutIntervalMultiplier += 0.1;

        if (ring == 1) {
          this.finishInLeft();

          //do depending on which side
          if (isHomeAttacking) {
            this.score.home += 1;
            this.homeSubs.push(winner.id);
          } else {
            this.score.away += 1;
            this.awaySubs.push(winner.id);
          }
        } else if (ring == 2) {
          this.finishInCenter();

          //do depending on which side
          if (isHomeAttacking) {
            if (this.awaySubs.length == 0) {
              this.isFullTime = true;

              setTimeout(() => {
                this.$store.dispatch("addMatchMessage", msg);
                this.isDisabled = false;
              }, this.timeoutInterval * timeoutIntervalMultiplier);
            }
            if (!this.awaySubs.length) {
              //ef avail
              this.score.home += 3;
            }
          } else {
            if (this.homeSubs.length == 0) {
              this.isFullTime = true;

              setTimeout(() => {
                this.$store.dispatch("addMatchMessage", msg);
                this.isDisabled = false;
              }, this.timeoutInterval * timeoutIntervalMultiplier);
            }
            if (!this.homeSubs.length) {
              this.score.away += 3;
            }
          }
        } else if (ring == 3) {
          this.finishInRight();

          //do depending on which side
          if (isHomeAttacking) {
            this.score.home += 1;
            this.homeSubs.push(winner.id);
          } else {
            this.score.away += 1;
            this.awaySubs.push(winner.id);
          }
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
    checkCondition(fighter) {
      var result = { finished: false, msg: undefined };
      if (fighter.match.condition <= 0) {
        result.finished = true;
        result.msg = `That's enough for ${fighter.nickname}. He's finished!`;
      }
      return result;
    },
    updateFighterMatchStats(attacker, defender, outcome) {
      attacker.match.condition -= outcome.attackerDamage;
      attacker.match.exposed + outcome.attackerExposed;
      attacker.match.learned += outcome.attackerLearned;
      attacker.match.momentum = outcome.attackerMomentum;

      attacker.match.exposed = matchEngine.getFlooredToHundred(
        attacker.match.exposed
      );
      attacker.match.learned = matchEngine.getFlooredToHundred(
        attacker.match.learned
      );

      defender.match.condition -= outcome.defenderDamage;
      defender.match.exposed += outcome.defenderExposed;
      defender.match.learned += outcome.defenderLearned;
      attacker.match.momentum = outcome.defenderMomentum;

      defender.match.exposed = matchEngine.getFlooredToHundred(
        defender.match.exposed
      );
      defender.match.learned = matchEngine.getFlooredToHundred(
        defender.match.learned
      );
    },
    tallyPoints(ring, outcome) {
      if (ring == 1) {
        // LEFT
        if (this.isHomeAttack) {
          this.truePointsLeft[this.round - 1].home += 1;
          if (outcome.significant) {
            this.truePointsLeft[this.round - 1].homeSignificant += 1;
          }
        } else {
          this.truePointsLeft[this.round - 1].away += 1;
          if (outcome.significant) {
            this.truePointsLeft[this.round - 1].awaySignificant += 1;
          }
        }
      } else if (ring == 2) {
        // CENTER
        if (this.isHomeAttack) {
          this.truePointsCenter[this.round - 1].home += 1;
          if (outcome.significant) {
            this.truePointsCenter[this.round - 1].homeSignificant += 1;
          }
        } else {
          this.truePointsCenter[this.round - 1].away += 1;
          if (outcome.significant) {
            this.truePointsCenter[this.round - 1].awaySignificant += 1;
          }
        }
      } else if (ring == 3) {
        console.log("hm");

        // RIGHT
        if (this.isHomeAttack) {
          this.truePointsRight[this.round - 1].home += 1;
          if (outcome.significant) {
            this.truePointsLeft[this.round - 1].homeSignificant += 1;
          }
        } else {
          this.truePointsRight[this.round - 1].away += 1;
          if (outcome.significant) {
            this.truePointsRight[this.round - 1].awaySignificant += 1;
          }
        }
      }
    },
  },
};
</script>

<style>
.unispace {
  font-family: "Courier New", Courier, monospace;
  font-size: 8pt;
}

.ring-message {
  text-overflow: ellipsis;
  overflow: hidden;
  max-height: 120px;
  font-size: 9pt;
}

.judges {
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 40%;
}

.home-bench {
  position: absolute;
  left: 0;
  width: 10%;
}
.away-bench {
  position: absolute;
  right: 0;
  width: 10%;
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

.positions {
  width: 135px;
  height: 135px;
  margin: 25px;

  background-color: rgb(80, 76, 21);
  border-radius: 100%;
}
.centerPosition {
  /* margin-left: 136px;
  margin-right: 136px; */
}
</style>
