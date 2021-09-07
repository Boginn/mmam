<template>
  <v-container  style="position: absolute; top: 5%; left: 25%; zIndex: 10;">
    <v-card width="75%" class="sixth">
      <v-card-title class="justify-space-between eight">
        <v-icon class="eight--text" large @click="$emit('closed')">mdi-close</v-icon>
        <span class="font-shadow">Judges' Cards</span> 
        
        <v-icon class="close" large @click="$emit('closed')">mdi-close</v-icon>
      </v-card-title>
<v-row>
<v-col>

      <v-card-text>

        <div v-for="(decision, jdex) in decisions" :key="jdex">

          <h4 class="text-center seventh">
            <div>

            {{ rings[jdex] }}
            </div>
            <div>

             {{messages[jdex]}}
            </div>
          <v-divider class="mb-1 mt-1"></v-divider>
            
          </h4>
          <div v-for="(judge, index) in judges[jdex]" :key="judge.id">
            <v-row v-if="decision">
              <v-col>

              </v-col>
              <v-col class="text-no-wrap judges">
                {{ $parent.firstName(judge).substring(0, 1) }}.
                {{ $parent.lastName(judge) }}</v-col
              >

              <v-col class="pl-1 pr-1 justify-space-between text-end">
                <span
                  v-for="n in $parent.rounds.length"
                  :key="n"
                  class="unispace"
                >
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
                         <v-col>
                
              </v-col>
            </v-row>
          </div>
          <div class="text-end">
            

          </div>
        </div>



      </v-card-text>
</v-col>

</v-row>

    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "JudgesCard",
  components: {},

  props: {
    decisions: Array,
    judges: Array,
    cards: Object,
  },

  created() {
    console.log("asdf");
    this.getJudgesCards();
    console.log(this.judgesCards);
  },

  data: () => ({
    judgesCards: [],
  }),

  computed: {
    rings() {
      return ["Left", "Center", "Right"];
    },
    messages() {
      return [this.cards.leftMsg, this.cards.centerMsg, this.cards.rightMsg]
    }
  },

  methods: {
    getJudgesCards() {
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

      var cards = {
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
      //save to state
      this.$parent.cards = cards;

      
    },

    sortCards(card) {
      for (let i = 0; i < this.$parent.rounds.length; i++) {
        card.push(this.judgesCards[i]);
      }
      this.judgesCards.splice(0, this.$parent.rounds.length);
    },

    finalPoints(rounds) {
      var result = { home: 0, away: 0 };
      rounds.forEach((round) => {
        result.home = result.home + round.home;
        result.away += round.away;
      });
      return result;
    },
  },
  gast() {},
};
</script>

