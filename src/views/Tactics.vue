<template>
  <v-container>
    <v-row class="mt-10">
      <v-col>
        <v-data-table
          :hide-default-footer="true"
          :headers="headers"
          :items="squad"
          :items-per-page="10"
          item-key="name"
          class="elevation-6 grey darken-2 pa-4 fill-width  font-shadow"
        >
          <!-- eslint-disable-next-line -->
          <template v-slot:item.personal.name="{ item }">
            <router-link :to="`/squad/${item.id}`" class="white--text">
              <div class="grey darken-3 pa-2">
                {{ item.personal.name }}
              </div>
            </router-link>
          </template>

          <!-- eslint-disable-next-line -->
          <template v-slot:item.selection="{ item }">
            <v-row>
              <v-btn
                x-small
                class="ma-1"
                @click="setLeft(item.id)"
                v-bind:class="{ green: item.id == tactic.selection.left }"
                >l
              </v-btn>
              <v-btn
                x-small
                class="ma-1"
                @click="setCenter(item.id)"
                v-bind:class="{ green: item.id == tactic.selection.center }"
                >c
              </v-btn>
              <v-btn
                x-small
                class="ma-1"
                @click="setRight(item.id)"
                v-bind:class="{ green: item.id == tactic.selection.right }"
                >r
              </v-btn>
            </v-row>
          </template>

          <!-- eslint-disable-next-line -->
          <template v-slot:header.personal.name="{}">
            <h1 class="white--text" style="margin-left: -10px; ">
              {{ club.name }}
            </h1>
          </template>

          <!-- eslint-disable-next-line -->
          <template v-slot:header.selection="{}">
            <span @click="clearSelection()" class="clear-selection"
              >Clear Selection</span
            >
          </template>

          <!-- eslint-disable-next-line -->
          <template v-slot:footer>
            <v-container class="grey darken-1">
              <div class="d-flex">
                <span class="flex2">
                  <v-btn
                    x-small
                    outlined
                    @click="selectTab(0)"
                    v-bind:class="{
                      black: tabs[0].value,
                    }"
                    >{{ tabs[0].name }}</v-btn
                  >
                </span>
                <span v-for="(tab, index) in tabs" :key="index">
                  <v-btn
                    v-if="!index == 0"
                    x-small
                    outlined
                    @click="selectTab(index)"
                    v-bind:class="{
                      black: tabs[index].value,
                    }"
                    >{{ tab.name }}</v-btn
                  >
                </span>
              </div>
              <Instructions
                v-if="isTabGeneral"
                @setMentality="setMentality($event)"
                @setRisk="setRisk($event)"
                @setGamesmanship="setGamesmanship($event)"
                :instructions="tactic.instructions.general"
              />
              <Instructions
                v-if="isTabLeft"
                @setMentality="setMentality($event)"
                @setRisk="setRisk($event)"
                @setGamesmanship="setGamesmanship($event)"
                :instructions="tactic.instructions.left"
              />
              <Instructions
                v-if="isTabCenter"
                @setMentality="setMentality($event)"
                @setRisk="setRisk($event)"
                @setGamesmanship="setGamesmanship($event)"
                :instructions="tactic.instructions.center"
              />
              <Instructions
                v-if="isTabRight"
                @setMentality="setMentality($event)"
                @setRisk="setRisk($event)"
                @setGamesmanship="setGamesmanship($event)"
                :instructions="tactic.instructions.right"
              />
            </v-container>
          </template>
        </v-data-table>
      </v-col>
      <v-col>
        <v-col>
          <v-card elevation="10" class="grey darken-1">
            <v-row align="center" class="pt-16 pb-16">
              <v-col align="center">
                <div class="positions ">
                  <v-col align="center pt-10"> L</v-col>
                </div>
              </v-col>
              <v-col align="center">
                <div class="positions ">
                  <v-col align="center"> </v-col>R
                </div></v-col
              >
              <v-col align="center">
                <div class="positions centerPosition">
                  <v-col align="center"> </v-col>C
                </div></v-col
              >
            </v-row>
            <v-row>
              <v-col align="center">
                <v-card class="grey darken-3">
                  <v-card-text class="d-flex justify-space-between font-shadow">
                    <div class="shown-instructions">
                      <div>
                        Mentality:
                      </div>
                      <b> {{ mentality }}</b>
                    </div>
                    <div class="shown-instructions">
                      <div>
                        Risk:
                      </div>
                      <b> {{ risk }}</b>
                    </div>
                    <div class="shown-instructions">
                      <div>
                        Gamesmanship:
                      </div>
                      <b> {{ gamesmanship }}</b>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            <v-row align="center" class="ma-0 pt-0">
              <v-col
                align="center"
                v-for="(fighter, index) in selection"
                :key="index"
              >
                <div class="secondary font-shadow body-1 pt-1" v-if="fighter">
                  <div>
                    {{ getFighter(fighter).personal.name }}
                  </div>

                  <div>
                    Fitness
                    <b
                      class="font-shadow "
                      v-bind:class="{
                        'red--text': getFighter(fighter).fitness < 50,
                        'yellow--text':
                          getFighter(fighter).fitness < 75 &&
                          getFighter(fighter).fitness >= 50,
                        'green--text': getFighter(fighter).fitness >= 75,
                      }"
                    >
                      {{ getFighter(fighter).fitness }}
                    </b>
                  </div>
                  <div>
                    <v-progress-linear
                      height="15"
                      v-model="getFighter(fighter).condition"
                      :buffer-value="100"
                      color="green"
                      background-color="red"
                    ></v-progress-linear>
                  </div></div
              ></v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-btn
        :disabled="!this.checkTactic"
        v-if="this.isMatchday"
        @click="goToMatch()"
        >Confirm and Kick Off!</v-btn
      >
      <v-btn
        x-large
        @click="defaultSelection()"
        v-if="isDeveloper"
        class="secondary"
        style="position: absolute; top: 10%; right: 10%"
        >Default</v-btn
      >
    </v-row>
  </v-container>
</template>

<script>
import data from '@/data/data.js';
import classes from '@/data/classes.js';

export default {
  name: 'Tactics',

  created() {
    if (!this.$route.params.id) {
      this.id = this.playerClubId;
      this.club = this.getClub(this.playerClubId);
    } else {
      this.id = this.$route.params.id;
      this.club = this.getClub(this.id);
    }

    this.tactic = this.club.tactic ? this.club.tactic : new classes.Tactic();
  },

  components: {
    Instructions: () => import('@/components/Instructions.vue'),
  },

  computed: {
    headers() {
      return data.headers.tactics;
    },
    currentMatch() {
      return this.$store.getters.currentMatch;
    },
    isMatchday() {
      return this.$store.getters.isMatchday;
    },
    isDeveloper() {
      return this.$store.getters.isDeveloper;
    },
    playerClubId() {
      return this.$store.getters.selectedClubId;
    },

    //ui
    isTabGeneral() {
      return this.tabs[0].value;
    },
    isTabLeft() {
      return this.tabs[1].value;
    },
    isTabCenter() {
      return this.tabs[2].value;
    },
    isTabRight() {
      return this.tabs[3].value;
    },

    selection() {
      let selection = [];
      selection.push(this.tactic.selection.left);
      selection.push(this.tactic.selection.center);
      selection.push(this.tactic.selection.right);
      return selection;
    },

    squad() {
      var squad = [];
      this.club.squad.forEach((element) => {
        squad.push(this.getFighter(element));
      });
      console.log(squad);
      return squad;
    },

    mentality() {
      const { instructions } = this.tactic;
      const { general, left, center, right } = instructions;

      general, left, center, right;
      var string;
      if (instructions.general.mentality == 1) {
        string = 'Containing';
      } else if (instructions.general.mentality == 2) {
        string = 'Defending';
      } else if (instructions.general.mentality == 3) {
        string = 'Attacking';
      }
      return string;
    },
    risk() {
      const { instructions } = this.tactic;
      const { general, left, center, right } = instructions;
      general, left, center, right;
      var string;
      if (instructions.general.risk == 1) {
        string = 'Safe';
      } else if (instructions.general.risk == 2) {
        string = 'Normal';
      } else if (instructions.general.risk == 3) {
        string = 'Reckless';
      }
      return string;
    },
    gamesmanship() {
      const { instructions } = this.tactic;
      const { general, left, center, right } = instructions;
      general, left, center, right;
      var string;
      if (instructions.general.gamesmanship == 1) {
        string = 'Clean';
      } else if (instructions.general.gamesmanship == 2) {
        string = 'Neutral';
      } else if (instructions.general.gamesmanship == 3) {
        string = 'Dirty';
      }
      return string;
    },
    checkTactic() {
      const { instructions } = this.tactic;
      const { general, left, center, right } = instructions;
      general, left, center, right;
      if (
        instructions.general.mentality &&
        instructions.general.risk &&
        instructions.general.gamesmanship &&
        this.tactic.selection.left &&
        this.tactic.selection.center &&
        this.tactic.selection.right
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  data: () => ({
    id: undefined,
    club: undefined,
    tactic: undefined,

    //ui
    tabs: data.tabs.tactics,
  }),

  methods: {
    //services
    getClub(id) {
      return this.$store.getters.getClubById(id);
    },
    getFighter(id) {
      return this.$store.getters.getFighterById(id);
    },

    savedTactic() {
      return this.$store.getters.tactic;
    },

    //ui
    selectTab(selection) {
      for (let i = 0; i < this.tabs.length; i++) {
        this.tabs[i].value = false;
      }
      this.tabs[selection].value = true;
    },

    setSelected() {
      this.tactic.clubId = this.id;
      this.$store.dispatch('setSelectedTactic', this.tactic);
    },
    defaultSelection() {
      //for lazy
      this.tactic.clubId = this.id;
      this.setMentality(1);
      this.setRisk(1);
      this.setGamesmanship(1);

      this.tactic.selection = {
        left: this.club.squad[0],
        center: this.club.squad[1],
        right: this.club.squad[2],
      };
      this.$store.dispatch('setSelectedTactic', this.tactic);
      this.goToMatch();
    },
    clearSelection() {
      this.tactic.selection = {
        left: 0,
        center: 0,
        right: 0,
      };
      this.$store.dispatch('setSelectedTactic', this.tactic);
    },

    setLeft(id) {
      if (this.tactic.selection.right == id) {
        if (this.tactic.selection.left) {
          this.tactic.selection.right = this.tactic.selection.left;
        } else {
          this.tactic.selection.right = null;
        }
      }
      if (this.tactic.selection.center == id) {
        if (this.tactic.selection.left) {
          this.tactic.selection.center = this.tactic.selection.left;
        } else {
          this.tactic.selection.center = null;
        }
      }
      this.tactic.selection.left = id;
      this.setSelected(this.tactic);
    },
    setCenter(id) {
      if (this.tactic.selection.right == id) {
        if (this.tactic.selection.center) {
          this.tactic.selection.right = this.tactic.selection.center;
        } else {
          this.tactic.selection.right = null;
        }
      }
      if (this.tactic.selection.left == id) {
        if (this.tactic.selection.center) {
          this.tactic.selection.left = this.tactic.selection.center;
        } else {
          this.tactic.selection.left = null;
        }
      }

      this.tactic.selection.center = id;
      this.setSelected(this.tactic);
    },
    setRight(id) {
      if (this.tactic.selection.left == id) {
        if (this.tactic.selection.right) {
          this.tactic.selection.left = this.tactic.selection.right;
        } else {
          this.tactic.selection.left = null;
        }
      }
      if (this.tactic.selection.center == id) {
        if (this.tactic.selection.right) {
          this.tactic.selection.center = this.tactic.selection.right;
        } else {
          this.tactic.selection.center = null;
        }
      }

      this.tactic.selection.right = id;
      this.setSelected(this.tactic);
    },

    setMentality(selection) {
      if (this.isTabGeneral) {
        this.tactic.instructions.general.mentality = selection;
      } else if (this.isTabLeft) {
        this.tactic.instructions.left.mentality = selection;
      } else if (this.isTabCenter) {
        this.tactic.instructions.center.mentality = selection;
      } else if (this.isTabRight) {
        this.tactic.instructions.right.mentality = selection;
      }

      this.setSelected(this.tactic);
    },
    setRisk(selection) {
      if (this.isTabGeneral) {
        this.tactic.instructions.general.risk = selection;
      } else if (this.isTabLeft) {
        this.tactic.instructions.left.risk = selection;
      } else if (this.isTabCenter) {
        this.tactic.instructions.center.risk = selection;
      } else if (this.isTabRight) {
        this.tactic.instructions.right.risk = selection;
      }

      this.setSelected(this.tactic);
    },
    setGamesmanship(selection) {
      if (this.isTabGeneral) {
        this.tactic.instructions.general.gamesmanship = selection;
      } else if (this.isTabLeft) {
        this.tactic.instructions.left.gamesmanship = selection;
      } else if (this.isTabCenter) {
        this.tactic.instructions.center.gamesmanship = selection;
      } else if (this.isTabRight) {
        this.tactic.instructions.right.gamesmanship = selection;
      }
      this.setSelected(this.tactic);
    },

    goToMatch() {
      // !
      this.$router.push(`/match/${this.currentMatch}`);
    },
  },
};
</script>

<style>
.tactics {
  margin: 25px;
  background-color: rgb(80, 76, 21);
  border-radius: 100px;
}
.instructions {
  width: 75px;
  margin: 1px;
}
.toggles {
  width: 60px;
  margin: 1px;
}
.shown-instructions {
  width: 33%;
}
.positions {
  width: 135px;
  height: 135px;
  margin: -35px;
  margin-left: 25px;
  margin-right: 25px;

  background-color: rgb(80, 76, 21);
  border-radius: 100%;
}
.clear-selection {
  padding-right: 15px;
}
.clear-selection:hover {
  color: white;
  cursor: pointer;
}
</style>
