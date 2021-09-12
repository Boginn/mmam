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
              <div class="grey darken-1 pa-2">
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
            <h1 class="white--text">
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
              <v-col>
                <v-row class="white--text pl-2 mb-1 mt-1 grey darken-2">
                  Mentality:
                  <v-spacer></v-spacer>
                  <v-btn
                    x-small
                    class="instructions"
                    @click="setMentality(3)"
                    v-bind:class="{ green: tactic.instructions.mentality == 3 }"
                    >Attack</v-btn
                  >
                  <v-btn
                    x-small
                    class="instructions"
                    @click="setMentality(2)"
                    v-bind:class="{ green: tactic.instructions.mentality == 2 }"
                    >Defend
                  </v-btn>
                  <v-btn
                    x-small
                    class="instructions"
                    @click="setMentality(1)"
                    v-bind:class="{ green: tactic.instructions.mentality == 1 }"
                    >Contain
                  </v-btn>
                </v-row>
                <v-row class="white--text pl-2 mb-1 mt-1 grey darken-2">
                  Risk:
                  <v-spacer></v-spacer>
                  <v-btn
                    x-small
                    class="instructions"
                    @click="setRisk(3)"
                    v-bind:class="{ green: tactic.instructions.risk == 3 }"
                    >Reckless</v-btn
                  >
                  <v-btn
                    x-small
                    class="instructions"
                    @click="setRisk(2)"
                    v-bind:class="{ green: tactic.instructions.risk == 2 }"
                    >Normal
                  </v-btn>
                  <v-btn
                    x-small
                    class="instructions"
                    @click="setRisk(1)"
                    v-bind:class="{ green: tactic.instructions.risk == 1 }"
                    >Safe
                  </v-btn>
                </v-row>
                <v-row class="white--text pl-2 mb-1 mt-1 grey darken-2">
                  Gamesmanship:
                  <v-spacer></v-spacer>
                  <v-btn
                    x-small
                    class="instructions"
                    @click="setGamesmanship(3)"
                    v-bind:class="{
                      green: tactic.instructions.gamesmanship == 3,
                    }"
                    >Dirty</v-btn
                  >
                  <v-btn
                    x-small
                    class="instructions"
                    @click="setGamesmanship(2)"
                    v-bind:class="{
                      green: tactic.instructions.gamesmanship == 2,
                    }"
                    >Neutral
                  </v-btn>
                  <v-btn
                    x-small
                    class="instructions"
                    @click="setGamesmanship(1)"
                    v-bind:class="{
                      green: tactic.instructions.gamesmanship == 1,
                    }"
                    >Clean
                  </v-btn>
                </v-row>
              </v-col>
            </v-container>
          </template>
        </v-data-table>
      </v-col>
      <v-col>
        <v-col>
          <v-card elevation="10" class="grey darken-1">
            <v-row align="center">
              <v-col align="center">
                <div class="positions ">
                  <v-col align="center pt-10"> </v-col>
                </div>
              </v-col>
              <v-col align="center">
                <div class="positions ">
                  <v-col align="center"> </v-col></div
              ></v-col>
              <v-col align="center">
                <div class="positions centesition ">
                  <v-col align="center"> </v-col></div
              ></v-col>
            </v-row>
            <v-row>
              <v-col align="center">
                {{ mentality }}
                {{ risk }}
                {{ gamesmanship }}
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
                      v-model="getFighter(fighter).match.condition"
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

  components: {},

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
      var string;
      if (this.tactic.instructions.mentality == 1) {
        string = 'Containing';
      } else if (this.tactic.instructions.mentality == 2) {
        string = 'Defending';
      } else if (this.tactic.instructions.mentality == 3) {
        string = 'Attacking';
      }
      return string;
    },
    risk() {
      var string;
      if (this.tactic.instructions.risk == 1) {
        string = 'Safe';
      } else if (this.tactic.instructions.risk == 2) {
        string = 'Normal';
      } else if (this.tactic.instructions.risk == 3) {
        string = 'Reckless';
      }
      return string;
    },
    gamesmanship() {
      var string;
      if (this.tactic.instructions.gamesmanship == 1) {
        string = 'Clean';
      } else if (this.tactic.instructions.gamesmanship == 2) {
        string = 'Neutral';
      } else if (this.tactic.instructions.gamesmanship == 3) {
        string = 'Dirty';
      }
      return string;
    },
    checkTactic() {
      if (
        this.tactic.instructions.mentality &&
        this.tactic.instructions.risk &&
        this.tactic.instructions.gamesmanship &&
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
  }),

  methods: {
    getClub(id) {
      return this.$store.getters.getClubById(id);
    },
    getFighter(id) {
      return this.$store.getters.getFighterById(id);
    },

    savedTactic() {
      return this.$store.getters.tactic;
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
      this.tactic.instructions.mentality = selection;
      this.setSelected(this.tactic);
    },
    setRisk(selection) {
      this.tactic.instructions.risk = selection;
      this.setSelected(this.tactic);
    },
    setGamesmanship(selection) {
      this.tactic.instructions.gamesmanship = selection;
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
.positions {
  width: 90px;
  height: 90px;
  margin: 25px;

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
