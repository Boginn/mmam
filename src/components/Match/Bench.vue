<template>
  <v-row>
    <v-card-text>
      <p class="text-center ">
        Finished
      </p>
      <v-row align="center">
        <v-col class="ma-2">
          <div class="primary" style="minHeight: 70px">
            <v-col class="ma-0" align="center">
              <div
                v-for="(fighter, index) in homeTactic.selection"
                :key="index"
              >
                <div
                  class="secondary font-shadow ma-1"
                  v-if="getFighter(fighter).match.finished"
                >
                  <span class="red--text">
                    {{ getFighter(fighter).personal.name }}
                  </span>
                  <div>
                    - c:
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
          <div class="fourth" style="minHeight: 70px">
            <v-col class="ma-0" align="center">
              <div
                v-for="(fighter, index) in awayTactic.selection"
                :key="index"
              >
                <div
                  class="secondary font-shadow ma-1"
                  v-if="getFighter(fighter).match.finished"
                >
                  <span class="red--text">
                    {{ getFighter(fighter).personal.name }}
                  </span>

                  <div>
                    - c:
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
          <div class="primary">
            <v-col
              align="center"
              v-for="(fighter, index) in homeSubs"
              :key="index"
            >
              <div class="secondary font-shadow ma-1">
                {{ getFighter(fighter).personal.name }}
                <div>
                  - c:
                  <b class="font-shadow amber--text">
                    {{ getFighter(fighter).match.condition }}
                  </b>
                </div>
              </div></v-col
            >
          </div>
        </v-col>
        <v-col class="ma-2">
          <div class="fourth">
            <v-col
              align="center"
              v-for="(fighter, index) in awaySubs"
              :key="index"
            >
              <div class="secondary font-shadow ma-1">
                {{ getFighter(fighter).personal.name }}
                <div>
                  - c:
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
  components: {},

  props: {
    homeTactic: Object,
    awayTactic: Object,
    homeSubs: Array,
    awaySubs: Array,
    substitutionAvailable: Boolean,
  },

  methods: {
    getFighter(id) {
      return this.$store.getters.getFighterById(id);
    },
  },
};
</script>
