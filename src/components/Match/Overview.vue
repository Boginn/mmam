<template>
  <v-row class="mt-0">
    <v-card-text>
      <v-row align="center" class="ma-0 pt-0">
        <v-col
          align="center"
          v-for="(fighter, index) in homeTactic.selection"
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

            <div v-if="isDeveloper">
              e:
              <b class="font-shadow red--text">
                {{ getFighter(fighter).match.exposed }}
              </b>
              - c:
              <b class="font-shadow amber--text">
                {{ getFighter(fighter).match.condition }}
              </b>
              - l:
              <b class="font-shadow green--text">
                {{ getFighter(fighter).match.learned }}
              </b>
              - m:
              <b class="font-shadow blue--text">
                {{ getFighter(fighter).match.momentum }}
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
      <v-row align="center">
        <v-col align="center">
          <div
            class="positions centerPosition "
            v-bind:class="{
              red: $parent.ringFinishedLeft,
              primary: !$parent.ringFinishedLeft,
            }"
          >
            <v-row>
              <v-col class="pa-7 pt-6 white--text ring-message">
                <span v-if="!$parent.ringFinishedLeft">
                  {{ messages[0].slice().reverse()[0] }}</span
                >
              </v-col>
            </v-row>
          </div>
        </v-col>
        <v-col align="center">
          <div
            class="positions centerPosition "
            v-bind:class="{
              red: $parent.ringFinishedCenter,
              primary: !$parent.ringFinishedCenter,
            }"
          >
            <v-row>
              <v-col class="pa-7 pt-6 white--text ring-message">
                <span v-if="!$parent.ringFinishedCenter">
                  {{ messages[1].slice().reverse()[0] }}</span
                >
              </v-col>
            </v-row>
          </div></v-col
        >
        <v-col align="center">
          <div
            class="positions centerPosition "
            v-bind:class="{
              red: $parent.ringFinishedRight,
              primary: !$parent.ringFinishedRight,
            }"
          >
            <v-row>
              <v-col class="pa-7 pt-6 white--text ring-message">
                <span v-if="!$parent.ringFinishedRight">
                  {{ messages[2].slice().reverse()[0] }}</span
                >
              </v-col>
            </v-row>
          </div></v-col
        >
      </v-row>
      <v-row align="center" class="ma-0 pt-0">
        <v-col
          align="center"
          v-for="(fighter, index) in awayTactic.selection"
          :key="index"
        >
          <div
            class="fourth font-shadow body-1 pb-1"
            v-if="
              !getFighter(fighter).match.finished &&
                !getFighter(fighter).match.substituted &&
                getFighter(fighter).personal.name != 'Select'
            "
          >
            <div>
              <v-progress-linear
                height="15"
                v-model="getFighter(fighter).match.condition"
                :buffer-value="100"
                color="green"
                background-color="red"
              ></v-progress-linear>
            </div>
            <div>
              {{ firstName(getFighter(fighter)) }} '<b>{{
                getFighter(fighter).nickname
              }}</b
              >' {{ lastName(getFighter(fighter)) }}
            </div>

            <div v-if="isDeveloper">
              e:
              <b class="font-shadow red--text">
                {{ getFighter(fighter).match.exposed }}</b
              >
              - c:
              <b class="font-shadow amber--text">
                {{ getFighter(fighter).match.condition }}</b
              >
              - l:
              <b class="font-shadow green--text">
                {{ getFighter(fighter).match.learned }}</b
              >
              - m:
              <b class="font-shadow blue--text">
                {{ getFighter(fighter).match.momentum }}</b
              >
            </div>
          </div></v-col
        >
      </v-row>
    </v-card-text>
  </v-row>
</template>

<script>
export default {
  name: "Overview",
  components: {},

  props: {
        homeTactic: Object,
    awayTactic: Object,
    messages: Array,
  },

  computed: {
        isDeveloper() {
      return this.$store.getters.isDeveloper;
    },
  },

  methods: {
    firstName(fighter) {
      return fighter.personal.name.split(" ")[0];
    },
    lastName(fighter) {
      return fighter.personal.name.split(" ")[1];
    },
    getFighter(id) {
      return this.$store.getters.getFighterById(id);
    },
  },
};
</script>
