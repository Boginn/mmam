<template>
  <v-row class="mt-0">
    <div @click="closeUnitModal">
      <Modal v-show="isUnitModalVisible">
        <template v-slot:body>
          <Unit
            :fighterId="fighterId"
            @close="closeUnitModal"
            v-if="isUnitModalVisible"
          >
          </Unit>
        </template>
      </Modal>
    </div>
    <v-card-text>
      <v-row align="center" class="ma-0 pt-0">
        <v-col
          align="center"
          v-for="(fighter, index) in homeTactic.selection"
          :key="index"
        >
          <div
            :style="{ backgroundImage: homeBanner }"
            class="font-shadow body-1 pt-1"
            v-if="
              !getFighter(fighter).match.finished &&
                !getFighter(fighter).match.substituted &&
                getFighter(fighter).personal.name != 'Select'
            "
          >
            <a @click="showUnitModal(fighter)" class="white--text">
              {{ firstName(getFighter(fighter)) }} '<b>{{
                getFighter(fighter).nickname
              }}</b
              >' {{ lastName(getFighter(fighter)) }}
            </a>

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
              - g:
              <b class="font-shadow lime--text">
                {{ getFighter(fighter).match.grappled }}</b
              >
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
      <v-row align="center" class="ma-0 pt-0">
        <!--  -->
        <v-col align="center" class="ma-0 pt-0">
          <v-card-text class="ma-0 pt-0" v-if="leftMsg">
            <v-col
              class="ring-message font-shadow"
              v-if="!ringFinishedLeft && leftMsg.isHomeAttack"
              :style="{
                backgroundColor: leftMsg.primary,
                color: leftMsg.secondary,
              }"
            >
              {{ leftMsg.text }}</v-col
            >
          </v-card-text>
          <div
            class="positions-match d-flex align-center"
            v-bind:class="{
              red: ringFinishedLeft,
              sixth: !ringFinishedLeft,
            }"
          >
            <Dots
              v-if="leftMsg"
              :colors="colors"
              :isHomeAttack="leftMsg.isHomeAttack"
            />
          </div>
          <v-card-text class="ma-0 pt-0" v-if="leftMsg">
            <v-col
              class=" ring-message font-shadow"
              v-if="!ringFinishedLeft && !leftMsg.isHomeAttack"
              :style="{
                backgroundColor: leftMsg.primary,
                color: leftMsg.secondary,
              }"
            >
              {{ leftMsg.text }}</v-col
            >
          </v-card-text>
        </v-col>
        <!--  -->
        <v-col align="center" class="ma-0 pt-0">
          <v-card-text class="ma-0 pt-0" v-if="centerMsg">
            <v-col
              class=" ring-message font-shadow"
              v-if="!ringFinishedCenter && centerMsg.isHomeAttack"
              :style="{
                backgroundColor: centerMsg.primary,
                color: centerMsg.secondary,
              }"
            >
              {{ centerMsg.text }}</v-col
            >
          </v-card-text>
          <div
            class="positions-match "
            v-bind:class="{
              red: ringFinishedCenter,
              sixth: !ringFinishedCenter,
            }"
          >
            <Dots
              v-if="centerMsg"
              :colors="colors"
              :isHomeAttack="centerMsg.isHomeAttack"
            />
          </div>
          <v-card-text class="ma-0 pt-0" v-if="centerMsg">
            <v-col
              class="ring-message font-shadow"
              v-if="!ringFinishedCenter && !centerMsg.isHomeAttack"
              :style="{
                backgroundColor: centerMsg.primary,
                color: centerMsg.secondary,
              }"
            >
              {{ centerMsg.text }}</v-col
            >
          </v-card-text>
        </v-col>

        <v-col align="center" class="ma-0 pt-0">
          <v-card-text class="ma-0 pt-0" v-if="rightMsg">
            <v-col
              class=" ring-message font-shadow"
              v-if="!ringFinishedRight && rightMsg.isHomeAttack"
              :style="{
                backgroundColor: rightMsg.primary,
                color: rightMsg.secondary,
              }"
            >
              {{ rightMsg.text }}</v-col
            >
          </v-card-text>
          <div
            class="positions-match "
            v-bind:class="{
              red: ringFinishedRight,
              sixth: !ringFinishedRight,
            }"
          >
            <Dots
              v-if="rightMsg"
              :colors="colors"
              :isHomeAttack="rightMsg.isHomeAttack"
            />
          </div>
          <v-card-text class="ma-0 pt-0" v-if="rightMsg">
            <v-col
              class=" ring-message font-shadow"
              v-if="!ringFinishedRight && !rightMsg.isHomeAttack"
              :style="{
                backgroundColor: rightMsg.primary,
                color: rightMsg.secondary,
              }"
            >
              {{ rightMsg.text }}</v-col
            >
          </v-card-text>
        </v-col>
      </v-row>
      <v-row align="center" class="ma-0 pt-0">
        <v-col
          align="center"
          v-for="(fighter, index) in awayTactic.selection"
          :key="index"
        >
          <div
            :style="{ backgroundImage: awayBanner }"
            class="font-shadow body-1 pb-1"
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
            <a @click="showUnitModal(fighter)" class="white--text">
              {{ firstName(getFighter(fighter)) }} '<b>{{
                getFighter(fighter).nickname
              }}</b
              >' {{ lastName(getFighter(fighter)) }}
            </a>

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
              - g:
              <b class="font-shadow lime--text">
                {{ getFighter(fighter).match.grappled }}</b
              >
            </div>
          </div></v-col
        >
      </v-row>
    </v-card-text>
  </v-row>
</template>

<script>
import engine from '@/engine/engine.js';

export default {
  name: 'Overview',
  components: {
    Unit: () => import('@/components/Unit.vue'),
    Modal: () => import('@/components/Modal.vue'),
    Dots: () => import('@/components/Match/Dots.vue'),
  },

  props: {
    homeTactic: Object,
    awayTactic: Object,
    messages: Array,
    colors: Object,
  },

  created() {
    console.log(this.messages);
    this.$vuetify.theme.themes.dark.homePrimary = this.colors.home.primary;
    this.$vuetify.theme.themes.dark.homeSecondary = this.colors.home.secondary;
    this.$vuetify.theme.themes.dark.awayPrimary = this.colors.away.primary;
    this.$vuetify.theme.themes.dark.awaySecondary = this.colors.away.secondary;
  },

  computed: {
    isDeveloper() {
      return this.$store.getters.isDeveloper;
    },
    homeBanner() {
      return `linear-gradient(140deg,  ${this.colors.home.primary} 70%, ${this.colors.home.secondary}, ${this.colors.home.secondary})`;
    },
    awayBanner() {
      return `linear-gradient(140deg,  ${this.colors.away.primary} 70%, ${this.colors.away.secondary}, ${this.colors.away.secondary})`;
    },

    //matchData
    ringFinishedLeft() {
      return this.$store.getters.matchData.ringFinishedLeft;
    },
    ringFinishedCenter() {
      return this.$store.getters.matchData.ringFinishedCenter;
    },
    ringFinishedRight() {
      return this.$store.getters.matchData.ringFinishedRight;
    },

    //
    leftMsg() {
      return this.messages[0].slice().reverse()[0];
    },
    centerMsg() {
      return this.messages[1].slice().reverse()[0];
    },
    rightMsg() {
      return this.messages[2].slice().reverse()[0];
    },
  },
  data: () => ({
    isUnitModalVisible: false,
    fighterId: null,
  }),

  methods: {
    firstName(fighter) {
      return engine.firstName(fighter);
    },
    lastName(fighter) {
      return engine.lastName(fighter);
    },
    getFighter(id) {
      return this.$store.getters.getFighterById(id);
    },

    //ui
    showUnitModal(fighter) {
      this.fighterId = fighter;
      this.isUnitModalVisible = true;
    },
    closeUnitModal() {
      this.isUnitModalVisible = false;
    },
  },
};
</script>

<style scoped>
.positions-match {
  width: 170px;
  height: 170px;
  /* margin: -35px;
  margin-left: 25px;
  margin-right: 25px;
  padding-top: 10px; */
  margin: 25px;

  /* background-color: rgb(80, 76, 21); */
  border-radius: 100%;
}

.ring-message font-shadow {
  text-overflow: ellipsis;
  overflow: hidden;
  max-height: 170px;
  font-size: 13pt;
}
/* 
.dot {
  /* width: 1px;
  /* height: 10px;

  margin: 60px;

  border-radius: 100%;

  background-color: blue;
} */
</style>
