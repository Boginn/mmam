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
import decisionEngine from '@/engine/decisionEngine.js';
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
    // this.cards = this.getJudgesCards();
    this.cards = decisionEngine.getJudgesCards(
      this.decisions,
      this.judges,
      this.rounds
    );
    this.commitScore(this.ringFinishedLeft, this.ringFinishedRight);
  },

  data: () => ({
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
    firstName(person) {
      return engine.firstName(person);
    },
    lastName(person) {
      return engine.lastName(person);
    },
    finalPoints(rounds) {
      return decisionEngine.finalPoints(rounds);
    },
    commitScore(ringFinishedLeft, ringFinishedRight) {
      // returns an array with the cards and the score result
      let result = decisionEngine.countScore(
        this.cards,
        ringFinishedLeft,
        ringFinishedRight
      );

      //save
      this.$parent.cards = result[0];
      console.log(result[0]);
      this.$emit('countScore', result);
    },
  },
};
</script>
