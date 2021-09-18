<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card class="sixth">
          <v-card-title class="justify-space-between eight">
            <span class="font-shadow"
              >{{ firstName }} '{{ fighter.nickname }}' {{ lastName }} ({{
                fighter.personal.age
              }})</span
            >

            <v-icon class="close" large @click="$router.go(-1)"
              >mdi-close</v-icon
            >
          </v-card-title>
          <v-card-title class="justify-space-between ">
            <v-chip class="sixth darken-1 "
              >Height:<b> {{ fighter.personal.height }}</b
              >cm</v-chip
            >
            <v-chip class="sixth darken-1 ">
              Nationality:
              <b> {{ fighter.personal.nationality }}</b>
            </v-chip>
          </v-card-title>
          <v-row>
            <v-col>
              <v-col class=" pb-0 pt-0">
                <v-card-text
                  class="justify-space-between fifth ma-2"
                  style="width: 75%"
                >
                  <div class="justify-center d-flex">
                    <b class="font-shadow ">{{ typeOfFighter(fighter) }}</b>
                  </div>
                </v-card-text>
              </v-col>
              <v-col class="pb-0 pt-0">
                <v-card-text
                  class="justify-space-between primary ma-2"
                  style="width: 75%"
                >
                  <div class="justify-space-between d-flex">
                    Condition:
                    <b>{{ fighter.condition }}</b>
                  </div>
                  <div class="justify-space-between d-flex">
                    Fitness: <b>{{ fighter.fitness }}</b>
                  </div>
                </v-card-text>
              </v-col>
              <v-col>
                <v-card-text
                  class="justify-space-between seventh ma-2"
                  style="width: 75%"
                >
                  <div class="justify-space-between d-flex">
                    Body:
                    <b>{{ fighter.body.durability }}</b>
                  </div>
                  <div class="justify-space-between d-flex">
                    Head: <b>{{ fighter.head.durability }}</b>
                  </div>
                  <div class="justify-space-between d-flex">
                    Chin:
                    <b>{{ fighter.head.chin }}</b>
                  </div>
                  <div class="justify-space-between d-flex">
                    Power:<b>{{ fighter.body.power }}</b>
                  </div>
                </v-card-text>
              </v-col>
            </v-col>
            <v-col style="flex: 3">
              <v-row style="width: 100%;">
                <!-- mental -->

                <v-col class="secondary ma-1 mb-5">
                  <div
                    class="justify-space-between d-flex mb-2"
                    v-for="attribute in mental"
                    :key="attribute.name"
                  >
                    {{ attribute.name }}
                    <b>
                      {{ attribute.value }}
                    </b>
                  </div>
                </v-col>

                <!-- physical -->
                <v-col class="tertiary ma-1 mb-5">
                  <div
                    class="justify-space-between d-flex mb-2"
                    v-for="attribute in physical"
                    :key="attribute.name"
                  >
                    {{ attribute.name }}
                    <b>
                      {{ attribute.value }}
                    </b>
                  </div>
                </v-col>

                <!-- skill -->
                <v-col class="fourth ma-1 mb-5">
                  <div
                    class="justify-space-between d-flex mb-2"
                    v-for="attribute in skill"
                    :key="attribute.name"
                  >
                    {{ attribute.name }}
                    <b>
                      {{ attribute.value }}
                    </b>
                  </div>
                </v-col>
              </v-row>
            </v-col>
            <v-col class="text-center">
              Interaction
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import engine from '@/engine/engine.js';
export default {
  name: 'Unit',

  props: {},

  computed: {
    fighter() {
      return this.$store.getters.getFighterById(this.$route.params.id);
    },

    firstName() {
      return engine.firstName(this.fighter);
    },
    lastName() {
      return engine.lastName(this.fighter);
    },

    mental() {
      let mental = [];
      mental.push(
        {
          name: 'Adaptability',
          value: this.fighter.mental.adaptability,
        },
        {
          name: 'Determination',
          value: this.fighter.mental.determination,
        },
        {
          name: 'Ambition',
          value: this.fighter.mental.ambition,
        },
        {
          name: 'Loyalty',
          value: this.fighter.mental.loyalty,
        },
        {
          name: 'Pressure',
          value: this.fighter.mental.pressure,
        },
        {
          name: 'Professionalism',
          value: this.fighter.mental.professionalism,
        },
        {
          name: 'Sportsmanship',
          value: this.fighter.mental.sportsmanship,
        },
        {
          name: 'Temperement',
          value: this.fighter.mental.temperement,
        },
        {
          name: 'Dirtiness',
          value: this.fighter.mental.dirtiness,
        }
      );
      return mental;
    },
    physical() {
      let physical = [];
      physical.push(
        {
          name: 'Flair',
          value: this.fighter.physical.flair,
        },
        {
          name: 'Agility',
          value: this.fighter.physical.agility,
        },
        {
          name: 'Strength',
          value: this.fighter.physical.strength,
        },
        {
          name: 'Stamina',
          value: this.fighter.physical.stamina,
        },
        {
          name: 'Work Rate',
          value: this.fighter.physical.workRate,
        },
        {
          name: 'Pace',
          value: this.fighter.physical.pace,
        },
        {
          name: 'Acceleration',
          value: this.fighter.physical.acceleration,
        },
        {
          name: 'Explosiveness',
          value: this.fighter.physical.explosiveness,
        }
      );
      return physical;
    },
    skill() {
      let skill = [];
      skill.push(
        {
          name: 'Anticipation',
          value: this.fighter.skill.anticipation,
        },
        {
          name: 'Positioning',
          value: this.fighter.skill.positioning,
        },
        {
          name: 'Decisions',
          value: this.fighter.skill.decisions,
        },
        {
          name: 'Vision',
          value: this.fighter.skill.vision,
        },
        {
          name: 'Versatility',
          value: this.fighter.skill.versatility,
        },
        {
          name: 'Finishing',
          value: this.fighter.skill.finishing,
        },
        {
          name: 'Footwork',
          value: this.fighter.skill.footwork,
        },
        {
          name: 'Fluidity',
          value: this.fighter.skill.fluidity,
        },
        {
          name: 'Sharpness',
          value: this.fighter.skill.sharpness,
        }
      );
      return skill;
    },
  },

  data: () => ({}),

  methods: {
    typeOfFighter(fighter) {
      return engine.typeOfFighter(fighter);
    },
  },
};
</script>
