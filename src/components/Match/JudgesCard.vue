<template>
  <v-container>
    <v-card class="">
      <!-- <v-card-title class="justify-space-between eight">
        <v-icon class="eight--text" large @click="$emit('closed')"
          >mdi-close</v-icon
        >
        <span class="font-shadow">Judges' Cards</span>

        <v-icon class="close" large @click="$emit('closed')">mdi-close</v-icon>
      </v-card-title> -->
      <v-row>
        <v-col>
          <v-card-text>
            <div v-for="(decision, jdex) in decisions" :key="jdex">
              <h4 class="text-center seventh pt-1">
                <div>
                  {{ rings[jdex] }}
                </div>
                <div>
                  {{ messages[jdex] }}
                </div>
                <v-divider class="mb-1 mt-1"></v-divider>
              </h4>
              <div v-for="(judge, index) in judges[jdex]" :key="judge.id">
                <v-row v-if="decision">
                  <v-col> </v-col>
                  <v-col class="text-no-wrap judges">
                    {{ firstName(judge).substring(0, 1) }}.
                    {{ lastName(judge) }}</v-col
                  >

                  <v-col class="pl-1 pr-1 justify-space-between text-end">
                    <span v-for="n in rounds.length" :key="n" class="unispace">
                      {{ decision[index][n - 1].home }}-{{
                        decision[index][n - 1].away
                      }}
                    </span>
                    <span
                      >: {{ finalPoints(decision[index], index).home }}-{{
                        finalPoints(decision[index], index).away
                      }}
                    </span>
                  </v-col>
                  <v-col> </v-col>
                </v-row>
              </div>
              <div class="text-end"></div>
            </div>
          </v-card-text>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import engine from '@/engine/engine.js';
export default {
  name: 'JudgesCard',
  components: {},

  props: {
    decisions: Array,
    judges: Array,
    rounds: Array,
    ringFinishedLeft: Boolean,
    ringFinishedRight: Boolean,
  },

  created() {
    this.cards = this.getJudgesCards();
    this.countScore(this.ringFinishedLeft, this.ringFinishedRight);
  },

  data: () => ({
    judgesCards: [],
    cards: null,
  }),

  computed: {
    rings() {
      return ['Left', 'Center', 'Right'];
    },
    messages() {
      return [this.cards.leftMsg, this.cards.centerMsg, this.cards.rightMsg];
    },
  },

  methods: {
    firstName(fighter) {
      return engine.firstName(fighter);
    },
    lastName(fighter) {
      return engine.lastName(fighter);
    },

    sortCards(card) {
      for (let i = 0; i < this.rounds.length; i++) {
        card.push(this.judgesCards[i]);
      }
      this.judgesCards.splice(0, this.rounds.length);
    },

    finalPoints(rounds) {
      var result = { home: 0, away: 0 };
      rounds.forEach((round) => {
        result.home = result.home + round.home;
        result.away += round.away;
      });
      return result;
    },

    getJudgesCards() {
      console.log(this.decisions);
      for (let i = 0; i < this.decisions.length; i++) {
        const decision = this.decisions[i];

        for (let j = 0; j < this.judges[i].length; j++) {
          const judge = this.judges[i][j];
          judge;

          if (
            this.finalPoints(decision[j]).home ==
            this.finalPoints(decision[j]).away
          ) {
            this.judgesCards.push({ home: true, away: true });
          } else {
            this.finalPoints(decision[j]).home >
            this.finalPoints(decision[j]).away
              ? this.judgesCards.push({ home: true, away: false })
              : this.judgesCards.push({ home: false, away: true });
          }
        }
      }

      let cards = {
        left: [],
        center: [],
        right: [],
        leftMsg: '',
        centerMsg: '',
        rightMsg: '',
      };

      this.sortCards(cards.left);
      this.sortCards(cards.center);
      this.sortCards(cards.right);

      console.log(cards);
      return cards;
    },

    countScore(ringFinishedLeft, ringFinishedRight) {
      var result = { home: 0, away: 0 };
      let messager = function(winner, loser) {
        if (loser == 0 && winner == 3) {
          return 'Unanimous Decision';
        } else if (loser == 0 || winner == 1) {
          return 'Majority Decision';
        } else {
          return 'Split Decision';
        }
      };

      let homeCount = 0;
      let awayCount = 0;

      if (!ringFinishedLeft) {
        this.cards.left.forEach((score) => {
          if (score.home == true && score.away == false) {
            homeCount += 1;
          } else if (score.home == false && score.away == true) {
            awayCount += 1;
          }
        });

        if (homeCount != awayCount) {
          if (homeCount > awayCount) {
            result.home += 1;
            this.cards.leftMsg = messager(homeCount, awayCount);
          } else {
            result.away += 1;
            this.cards.leftMsg = messager(awayCount, homeCount);
          }
        } else {
          this.cards.leftMsg = 'Draw';
        }
        console.log(homeCount);
        console.log(awayCount);

        homeCount = 0;
        awayCount = 0;
      }

      if (!ringFinishedRight) {
        this.cards.right.forEach((score) => {
          if (score.home == true && score.away == false) {
            homeCount += 1;
          } else if (score.home == false && score.away == true) {
            awayCount += 1;
          }
        });

        if (homeCount != awayCount) {
          if (homeCount > awayCount) {
            result.home += 1;
            this.cards.rightMsg = messager(homeCount, awayCount);
          } else {
            result.away += 1;
            this.cards.rightMsg = messager(awayCount, homeCount);
          }
        } else {
          this.cards.rightMsg = 'Draw';
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
        result.home += 1;
        result.away += 1;
        this.cards.centerMsg = 'Draw';
      } else {
        if (homeCount > awayCount) {
          result.home += 2;
          this.cards.centerMsg = messager(homeCount, awayCount);
        } else {
          result.away += 2;
          this.cards.centerMsg = messager(awayCount, homeCount);
        }
      }
      //save
      this.$parent.cards = this.cards;
      console.log(this.cards);
      this.$emit('countScore', result);
    },
  },
};
</script>

<style scoped>
.float-style {
  position: absolute;
  top: 5%;
  left: 25%;
  z-index: 10;
}
</style>
