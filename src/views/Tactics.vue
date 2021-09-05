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
            <v-row >
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
                <v-row  class="white--text pl-2 mb-1 mt-1 grey darken-2">
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
        <v-card elevation="10" class="grey darken-1">
          <v-card-text>
            <v-row align="center" style="height: 150px;">
              <v-col align="center" class="tactics primary">{{
                getFighter(this.tactic.selection.left).personal.name
              }}</v-col>
              <v-col align="center" class="tactics primary">{{
                getFighter(this.tactic.selection.center).personal.name
              }}</v-col>
              <v-col align="center" class="tactics primary"
                >{{ getFighter(this.tactic.selection.right).personal.name }}
              </v-col>
            </v-row>
            <v-row>
              <v-col align="center">
                {{ mentality }}
                {{ risk }}
                {{ gamesmanship }}
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-btn :disabled="!this.checkTactic" v-if="this.matchday" @click="go()"
        >Confirm and Kick Off!</v-btn
      >
      <v-btn @click="defaultSelection()">Default</v-btn>
    </v-row>
  </v-container>
</template>

<script>
import data from "@/data/data.js";
import classes from "@/data/classes.js";

export default {
  name: "Tactics",

  created() {
    if (!this.$route.params.id) {
      this.id = this.playerClubId;
      this.club = this.getClub(this.playerClubId);
      console.log(this.club);
    } else {
      this.id = this.$route.params.id;
      this.club = this.getClub(this.id);
    }

    if (!this.club.tactic) {
      this.tactic = new classes.Tactic();
    }
  },

  components: {},

  computed: {
    headers() {
      return data.headers.tactics;
    },
    currentMatch() {
      return this.$store.getters.currentMatch;
    },
    matchday() {
      return this.$store.getters.matchday;
    },
    playerClubId() {
      return this.$store.getters.selectedClubId;
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
        string = "Containing";
      } else if (this.tactic.instructions.mentality == 2) {
        string = "Defending";
      } else if (this.tactic.instructions.mentality == 3) {
        string = "Attacking";
      }
      return string;
    },
    risk() {
      var string;
      if (this.tactic.instructions.risk == 1) {
        string = "Safe";
      } else if (this.tactic.instructions.risk == 2) {
        string = "Normal";
      } else if (this.tactic.instructions.risk == 3) {
        string = "Reckless";
      }
      return string;
    },
    gamesmanship() {
      var string;
      if (this.tactic.instructions.gamesmanship == 1) {
        string = "Clean";
      } else if (this.tactic.instructions.gamesmanship == 2) {
        string = "Neutral";
      } else if (this.tactic.instructions.gamesmanship == 3) {
        string = "Dirty";
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

    setSelected() {
      this.tactic.clubId = this.id;
      this.$store.dispatch("setSelectedTactic", this.tactic);
    },
    defaultSelection() {
      //for lazy
      this.tactic.clubId = this.id;
      this.setMentality(1);
      this.setRisk(1);
      this.setGamesmanship(1);

      this.tactic.selection = {
        left: 9006,
        center: 9007,
        right: 9008,
      };
      this.$store.dispatch("setSelectedTactic", this.tactic);
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

    go() {
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
</style>
