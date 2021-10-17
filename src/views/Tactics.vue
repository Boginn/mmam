<template>
  <v-container>
    <v-row class="mt-5">
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
            <router-link :to="`/roster/${item.id}`" class="white--text">
              <div class="grey darken-3 pa-2 d-flex justify-space-between ">
                <div style="flex: 2;">
                  <div>
                    {{ item.personal.name }}
                  </div>
                  <div class="yellow--text">
                    {{ typeOfFighter(item) }}
                  </div>
                </div>

                <div class="text-end mr-3 ">
                  <div class="grey--text">
                    APP
                    <b class=" yellow--text font-shadow">
                      {{ item.appearances.season.league }}
                    </b>
                  </div>
                  <div class="grey--text">
                    FIN
                    <b class=" blue--text font-shadow">
                      {{ item.appearances.season.finishes }}
                    </b>
                  </div>
                </div>
                <div class="text-end">
                  <div class="grey--text">
                    FIT
                    <b
                      class="font-shadow "
                      v-bind:class="{
                        'red--text': item.fitness < 50,
                        'yellow--text': item.fitness < 75 && item.fitness >= 50,
                        'green--text': item.fitness >= 75,
                      }"
                    >
                      {{ item.fitness }}
                    </b>
                  </div>
                  <div class="grey--text">
                    CON
                    <b
                      class="font-shadow "
                      v-bind:class="{
                        'red--text': item.condition < 50,
                        'yellow--text':
                          item.condition < 75 && item.condition >= 50,
                        'green--text': item.condition >= 75,
                      }"
                    >
                      {{ item.condition }}
                    </b>
                  </div>
                </div>
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
            <v-row align="center" class="pt-16 ">
              <v-col align="center">
                <div class="positions">
                  <v-col v-if="selection[0]">
                    <div
                      class="  mt-2  font-shadow body-1 pt-1"
                      style="width: 120px"
                    >
                      <div>
                        {{ getFighter(selection[0]).personal.name }}
                      </div>

                      <div>
                        <v-progress-linear
                          height="15"
                          v-model="getFighter(selection[0]).fitness"
                          :buffer-value="100"
                          color="balance"
                          background-color="red"
                        ></v-progress-linear>
                      </div>
                      <div>
                        <v-progress-linear
                          height="15"
                          v-model="getFighter(selection[0]).condition"
                          :buffer-value="100"
                          color="green"
                          background-color="red"
                        ></v-progress-linear>
                      </div></div
                  ></v-col>
                </div>
              </v-col>
              <v-col align="center">
                <div class="positions ">
                  <v-col v-if="selection[2]">
                    <div
                      class="mt-2  font-shadow body-1 pt-1"
                      style="width: 120px"
                    >
                      <div>
                        {{ getFighter(selection[2]).personal.name }}
                      </div>

                      <div>
                        <v-progress-linear
                          height="15"
                          v-model="getFighter(selection[2]).fitness"
                          :buffer-value="100"
                          color="balance"
                          background-color="red"
                        ></v-progress-linear>
                      </div>
                      <div>
                        <v-progress-linear
                          height="15"
                          v-model="getFighter(selection[2]).condition"
                          :buffer-value="100"
                          color="green"
                          background-color="red"
                        ></v-progress-linear>
                      </div>
                    </div>
                  </v-col></div
              ></v-col>
            </v-row>
            <v-row class="pb-16">
              <v-col align="center">
                <div class="positions ">
                  <v-col v-if="selection[1]">
                    <div
                      class=" mt-2  font-shadow body-1 pt-1"
                      style="width: 120px"
                    >
                      <div>
                        {{ getFighter(selection[1]).personal.name }}
                      </div>

                      <div>
                        <v-progress-linear
                          height="15"
                          v-model="getFighter(selection[1]).fitness"
                          :buffer-value="100"
                          color="balance"
                          background-color="red"
                        ></v-progress-linear>
                      </div>
                      <div>
                        <v-progress-linear
                          height="15"
                          v-model="getFighter(selection[1]).condition"
                          :buffer-value="100"
                          color="green"
                          background-color="red"
                        ></v-progress-linear>
                      </div>
                    </div>
                  </v-col></div
              ></v-col>
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
          </v-card>
        </v-col>
        <v-col>
          <v-btn
            class="confirm primary"
            :disabled="!this.checkTactic"
            v-if="this.isMatchday"
            @click="goToMatch()"
            >confirm and proceed</v-btn
          >
        </v-col>
      </v-col>
    </v-row>
    <v-row class="mt-5 justify-center">
      <v-btn
        x-large
        @click="defaultSelection()"
        class="secondary"
        style="width: 100%;"
        >Default</v-btn
      >
    </v-row>
  </v-container>
</template>

<script>
import data from '@/data/data.js';
import engine from '@/engine/engine.js';
import classes from '@/data/classes.js';

export default {
  name: 'Tactics',

  created() {
    // if (!this.$route.params.id) {
    //   this.id = this.playerClubId;
    //   this.club = this.getClub(this.playerClubId);
    // } else {
    //   this.id = this.$route.params.id;
    //   this.club = this.getClub(this.id);
    // }

    this.tactic = this.club.tactic ? this.club.tactic : new classes.Tactic();
  },

  components: {
    Instructions: () => import('@/components/Instructions.vue'),
  },

  computed: {
    club() {
      return this.getClub(this.id);
    },
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
    id() {
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
    // id: undefined,
    // club: undefined,
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
    typeOfFighter(fighter) {
      return engine.typeOfFighter(fighter);
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
      // this.goToMatch();
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
        if (this.tactic.instructions.general.mentality == selection) {
          this.tactic.instructions.general.mentality = 0;
        } else {
          this.tactic.instructions.general.mentality = selection;
        }
      } else if (this.isTabLeft) {
        if (this.tactic.instructions.left.mentality == selection) {
          this.tactic.instructions.left.mentality = 0;
        } else {
          this.tactic.instructions.left.mentality = selection;
        }
      } else if (this.isTabCenter) {
        if (this.tactic.instructions.center.mentality == selection) {
          this.tactic.instructions.center.mentality = 0;
        } else {
          this.tactic.instructions.center.mentality = selection;
        }
      } else if (this.isTabRight) {
        if (this.tactic.instructions.right.mentality == selection) {
          this.tactic.instructions.right.mentality = 0;
        } else {
          this.tactic.instructions.right.mentality = selection;
        }
      }

      this.setSelected(this.tactic);
    },
    setRisk(selection) {
      if (this.isTabGeneral) {
        if (this.tactic.instructions.general.risk == selection) {
          this.tactic.instructions.general.risk = 0;
        } else {
          this.tactic.instructions.general.risk = selection;
        }
      } else if (this.isTabLeft) {
        if (this.tactic.instructions.left.risk == selection) {
          this.tactic.instructions.left.risk = 0;
        } else {
          this.tactic.instructions.left.risk = selection;
        }
      } else if (this.isTabCenter) {
        if (this.tactic.instructions.center.risk == selection) {
          this.tactic.instructions.center.risk = 0;
        } else {
          this.tactic.instructions.center.risk = selection;
        }
      } else if (this.isTabRight) {
        if (this.tactic.instructions.right.risk == selection) {
          this.tactic.instructions.right.risk = 0;
        } else {
          this.tactic.instructions.right.risk = selection;
        }
      }

      this.setSelected(this.tactic);
    },
    setGamesmanship(selection) {
      if (this.isTabGeneral) {
        if (this.tactic.instructions.general.gamesmanship == selection) {
          this.tactic.instructions.general.gamesmanship = 0;
        } else {
          this.tactic.instructions.general.gamesmanship = selection;
        }
      } else if (this.isTabLeft) {
        if (this.tactic.instructions.left.gamesmanship == selection) {
          this.tactic.instructions.left.gamesmanship = 0;
        } else {
          this.tactic.instructions.left.gamesmanship = selection;
        }
      } else if (this.isTabCenter) {
        if (this.tactic.instructions.center.gamesmanship == selection) {
          this.tactic.instructions.center.gamesmanship = 0;
        } else {
          this.tactic.instructions.center.gamesmanship = selection;
        }
      } else if (this.isTabRight) {
        if (this.tactic.instructions.right.gamesmanship == selection) {
          this.tactic.instructions.right.gamesmanship = 0;
        } else {
          this.tactic.instructions.right.gamesmanship = selection;
        }
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
.confirm {
  width: 100%;
}
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
  width: 170px;
  height: 170px;
  margin: -35px;
  margin-left: 25px;
  margin-right: 25px;
  padding-top: 10px;

  background-color: rgb(63, 63, 57);
  border-radius: 100%;
}
.centerPosition {
  width: 140px;
  height: 140px;
}
.clear-selection {
  padding-right: 15px;
}
.clear-selection:hover {
  color: white;
  cursor: pointer;
}
</style>
