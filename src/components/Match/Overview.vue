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
      <v-row align="center">
        <v-col align="center">
          <div
            class="positions-match "
            v-bind:class="{
              red: $parent.ringFinishedLeft,
              homePrimary: !$parent.ringFinishedLeft,
            }"
          >
            <v-row class="ring-message-row">
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
            class="positions-match centerPosition"
            v-bind:class="{
              red: $parent.ringFinishedCenter,
              homePrimary: !$parent.ringFinishedCenter,
            }"
          >
            <v-row class="ring-message-row">
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
            class="positions-match "
            v-bind:class="{
              red: $parent.ringFinishedRight,
              homePrimary: !$parent.ringFinishedRight,
            }"
          >
            <v-row class="ring-message-row">
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
  },

  props: {
    homeTactic: Object,
    awayTactic: Object,
    messages: Array,
    colors: Object,
  },

  created() {
    console.log(this.colors);
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
      return `linear-gradient(140deg,  ${this.colors.home.primary}, ${this.colors.home.primary}, ${this.colors.home.primary},${this.colors.home.primary}, ${this.colors.home.primary}, ${this.colors.home.secondary}, ${this.colors.home.secondary})`;
    },
    awayBanner() {
      return `linear-gradient(140deg,  ${this.colors.away.primary}, ${this.colors.away.primary}, ${this.colors.away.primary},${this.colors.away.primary}, ${this.colors.away.primary}, ${this.colors.away.secondary}, ${this.colors.away.secondary})`;
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

.ring-message {
  text-overflow: ellipsis;
  overflow: hidden;
  max-height: 170px;
  font-size: 13pt;
}
.ring-message-row {
  display: flex;
  align-items: center;
  height: 170px;
}
</style>
