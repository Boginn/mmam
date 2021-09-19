<template>
  <v-row>
    <v-card-text>
      <v-container>
        <v-row class="d-flex  ma-0">
          <span v-for="(tab, index) in tabs" :key="index">
            <v-btn
              small
              @click="selectTab(index)"
              v-bind:class="{
                'fifth black--text': tabs[index].value,
              }"
              >{{ tab.name }}</v-btn
            >
          </span>
        </v-row>

        <v-row v-if="isTabGeneral">
          <v-col class=" ml-1 mr-1 "> </v-col>
          <v-col class="grey darken-1  ml-1 mr-1 ">
            <Instructions
              :instructions="instructionsGeneral"
              @setMentality="setMentalityGeneral($event)"
              @setRisk="setRiskGeneral($event)"
              @setGamesmanship="setGamesmanshipGeneral($event)"
            />
          </v-col>

          <v-col class=" ml-1 mr-1 "> </v-col>
        </v-row>

        <v-row class="d-flex" v-if="isTabIndividual">
          <v-col
            class="darken-1  ml-1 mr-1"
            v-bind:class="{ grey: !ringFinishedLeft }"
          >
            <Instructions
              v-if="!ringFinishedLeft"
              :instructions="instructionsLeft"
              @setMentality="setMentalityLeft($event)"
              @setRisk="setRiskLeft($event)"
              @setGamesmanship="setGamesmanshipLeft($event)"
            />
          </v-col>

          <v-col
            class="darken-1  ml-1 mr-1"
            v-bind:class="{ grey: !ringFinishedCenter }"
          >
            <Instructions
              v-if="!ringFinishedCenter"
              :instructions="instructionsCenter"
              @setMentality="setMentalityCenter($event)"
              @setRisk="setRiskCenter($event)"
              @setGamesmanship="setGamesmanshipCenter($event)"
            />
          </v-col>

          <v-col
            class="darken-1  ml-1 mr-1"
            v-bind:class="{ grey: !ringFinishedRight }"
          >
            <Instructions
              v-if="!ringFinishedRight"
              :instructions="instructionsRight"
              @setMentality="setMentalityRight($event)"
              @setRisk="setRiskRight($event)"
              @setGamesmanship="setGamesmanshipRight($event)"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col
            align="center"
            v-for="(fighter, index) in tactic.selection"
            :key="index"
          >
            <div
              class="secondary font-shadow body-1 pt-1"
              v-if="
                !getFighter(fighter).match.finished &&
                  !getFighter(fighter).match.substituted &&
                  getFighter(fighter).personal.name != 'Select'
              "
            >
              <div>
                {{ firstName(getFighter(fighter)) }} '<b>{{
                  getFighter(fighter).nickname
                }}</b
                >' {{ lastName(getFighter(fighter)) }}
              </div>

              <div>
                <v-progress-linear
                  height="15"
                  v-model="getFighter(fighter).match.condition"
                  :buffer-value="100"
                  color="green"
                  background-color="red"
                ></v-progress-linear>
              </div></div
          ></v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-row>
</template>

<script>
import data from '@/data/data.js';
import engine from '@/engine/engine.js';

export default {
  name: 'MatchTactics',
  components: {
    Instructions: () => import('@/components/Instructions.vue'),
  },

  props: {
    tactic: Object,
    ringFinishedLeft: Boolean,
    ringFinishedCenter: Boolean,
    ringFinishedRight: Boolean,
  },

  data: () => {
    return {
      tabs: data.tabs.matchTactics,
    };
  },

  computed: {
    instructionsGeneral() {
      return this.tactic.instructions.general;
    },
    instructionsLeft() {
      return this.tactic.instructions.left;
    },
    instructionsCenter() {
      return this.tactic.instructions.center;
    },
    instructionsRight() {
      return this.tactic.instructions.right;
    },
    isTabGeneral() {
      return this.tabs[0].value;
    },
    isTabIndividual() {
      return this.tabs[1].value;
    },
  },

  methods: {
    getFighter(id) {
      return this.$store.getters.getFighterById(id);
    },
    //ui
    selectTab(selection) {
      for (let i = 0; i < this.tabs.length; i++) {
        this.tabs[i].value = false;
      }
      this.tabs[selection].value = true;
    },

    //formatting
    firstName(fighter) {
      return engine.firstName(fighter);
    },
    lastName(fighter) {
      return engine.lastName(fighter);
    },

    //set instructions
    setMentalityGeneral(selection) {
      this.tactic.instructions.general.mentality = selection;

      // this.setSelected(this.tactic);
    },
    setRiskGeneral(selection) {
      this.tactic.instructions.general.risk = selection;

      // this.setSelected(this.tactic);
    },
    setGamesmanshipGeneral(selection) {
      this.tactic.instructions.general.gamesmanship = selection;

      // this.setSelected(this.tactic);
    },
    setMentalityLeft(selection) {
      if (this.tactic.instructions.left.mentality == selection) {
        this.tactic.instructions.left.mentality = 0;
      } else {
        this.tactic.instructions.left.mentality = selection;
      }

      // this.setSelected(this.tactic);
    },
    setRiskLeft(selection) {
      if (this.tactic.instructions.left.risk == selection) {
        this.tactic.instructions.left.risk = 0;
      } else {
        this.tactic.instructions.left.risk = selection;
      }
      // this.setSelected(this.tactic);
    },
    setGamesmanshipLeft(selection) {
      if (this.tactic.instructions.left.gamesmanship == selection) {
        this.tactic.instructions.left.gamesmanship = 0;
      } else {
        this.tactic.instructions.left.gamesmanship = selection;
      }

      // this.setSelected(this.tactic);
    },
    setMentalityCenter(selection) {
      if (this.tactic.instructions.center.mentality == selection) {
        this.tactic.instructions.center.mentality = 0;
      } else {
        this.tactic.instructions.center.mentality = selection;
      }

      // this.setSelected(this.tactic);
    },
    setRiskCenter(selection) {
      if (this.tactic.instructions.center.risk == selection) {
        this.tactic.instructions.center.risk = 0;
      } else {
        this.tactic.instructions.center.risk = selection;
      }

      // this.setSelected(this.tactic);
    },
    setGamesmanshipCenter(selection) {
      if (this.tactic.instructions.center.gamesmanship == selection) {
        this.tactic.instructions.center.gamesmanship = 0;
      } else {
        this.tactic.instructions.center.gamesmanship = selection;
      }

      // this.setSelected(this.tactic);
    },
    setMentalityRight(selection) {
      if (this.tactic.instructions.right.mentality == selection) {
        this.tactic.instructions.right.mentality = 0;
      } else {
        this.tactic.instructions.right.mentality = selection;
      }

      // this.setSelected(this.tactic);
    },
    setRiskRight(selection) {
      if (this.tactic.instructions.right.risk == selection) {
        this.tactic.instructions.right.risk = 0;
      } else {
        this.tactic.instructions.right.risk = selection;
      }

      // this.setSelected(this.tactic);
    },
    setGamesmanshipRight(selection) {
      if (this.tactic.instructions.right.gamesmanship == selection) {
        this.tactic.instructions.right.gamesmanship = 0;
      } else {
        this.tactic.instructions.right.gamesmanship = selection;
      }

      // this.setSelected(this.tactic);
    },
  },
};
</script>
