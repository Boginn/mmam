<template>
  <v-row>
    <div @click="closeUnitModal">
      <!-- TODO: Make this modal a component -->
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
      <p class="text-center ">
        Finished
      </p>
      <v-row align="center">
        <v-col class="ma-2">
          <div :style="{ backgroundImage: homeBanner }" style="minHeight: 70px">
            <v-col class="ma-0" align="center">
              <div
                v-for="(fighter, index) in homeTactic.selection"
                :key="index"
              >
                <div
                  class="sixth title darken-1 font-shadow ma-1"
                  v-if="getFighter(fighter).match.finished"
                >
                  <a @click="showUnitModal(fighter)" class="red--text">
                    {{ getFighter(fighter).personal.name }}
                  </a>

                  <div>
                    CON
                    <b class="font-shadow amber--text">
                      {{ getFighter(fighter).match.condition }}
                    </b>
                  </div>
                </div>
              </div>
            </v-col>
          </div>
        </v-col>

        <v-col class="ma-2">
          <div :style="{ backgroundImage: awayBanner }" style="minHeight: 70px">
            <v-col class="ma-0" align="center">
              <div
                v-for="(fighter, index) in awayTactic.selection"
                :key="index"
              >
                <div
                  class="sixth title darken-1 font-shadow ma-1"
                  v-if="getFighter(fighter).match.finished"
                >
                  <a @click="showUnitModal(fighter)" class="red--text">
                    {{ getFighter(fighter).personal.name }}
                  </a>

                  <div>
                    CON
                    <b class="font-shadow amber--text">
                      {{ getFighter(fighter).match.condition }}
                    </b>
                  </div>
                </div>
              </div>
            </v-col>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-text v-if="substitutionAvailable">
      <p class="text-center ">
        Substitutes
      </p>
      <v-row align="center">
        <v-col class="ma-2">
          <div :style="{ backgroundImage: homeBanner }">
            <v-col
              align="center"
              v-for="(fighter, index) in homeSubs"
              :key="index"
            >
              <div class="sixth title darken-1 font-shadow ma-1">
                <a @click="showUnitModal(fighter)" class="white--text">
                  {{ getFighter(fighter).personal.name }}
                </a>

                <div>
                  CON
                  <b class="font-shadow amber--text">
                    {{ getFighter(fighter).match.condition }}
                  </b>
                </div>
              </div></v-col
            >
          </div>
        </v-col>
        <v-col class="ma-2">
          <div :style="{ backgroundImage: awayBanner }">
            <v-col
              align="center"
              v-for="(fighter, index) in awaySubs"
              :key="index"
            >
              <div class="sixth title darken-1 font-shadow ma-1">
                <a @click="showUnitModal(fighter)" class="white--text">
                  {{ getFighter(fighter).personal.name }}
                </a>

                <div>
                  CON
                  <b class="font-shadow amber--text">
                    {{ getFighter(fighter).match.condition }}
                  </b>
                </div>
              </div></v-col
            >
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-row>
</template>

<script>
export default {
  name: 'Bench',
  components: {
    Unit: () => import('@/components/Unit.vue'),
    Modal: () => import('@/components/Modal.vue'),
  },

  props: {
    homeTactic: Object,
    awayTactic: Object,
    homeSubs: Array,
    awaySubs: Array,
    substitutionAvailable: Boolean,
    colors: Object,
  },

  data: () => ({
    isUnitModalVisible: false,
    fighterId: null,
  }),

  computed: {
    homeBanner() {
      return `linear-gradient(140deg,  ${this.colors.home.primary}, ${this.colors.home.primary}, ${this.colors.home.primary},${this.colors.home.primary}, ${this.colors.home.primary}, ${this.colors.home.secondary}, ${this.colors.home.secondary})`;
    },
    awayBanner() {
      return `linear-gradient(140deg,  ${this.colors.away.primary}, ${this.colors.away.primary}, ${this.colors.away.primary},${this.colors.away.primary}, ${this.colors.away.primary}, ${this.colors.away.secondary}, ${this.colors.away.secondary})`;
    },
  },

  methods: {
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
