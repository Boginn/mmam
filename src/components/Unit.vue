<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card class="sixth">
          <v-card-title
            class="justify-space-between "
            :style="`background: ${color.primary}; color: ${color.secondary}`"
          >
            <span class="font-shadow"
              >{{ firstName }} '{{ fighter.nickname }}' {{ lastName }} ({{
                fighter.personal.age
              }})</span
            >

            <v-icon class="close" large @click="handleClose">mdi-close</v-icon>
          </v-card-title>
          <v-card-title>
            <v-chip class="sixth darken-1 ma-1"
              >Height:<b> {{ fighter.personal.height }}</b
              >cm</v-chip
            >
            <v-chip class="sixth darken-1 ">
              <img
                :src="imageSource(fighter)"
                width="16"
                height="12"
                :alt="fighter.personal.nationality"
              />
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
              <v-col class="pb-0 pt-0 d-flex text-center">
                <v-card-text class="sixth ma-2" style="width: 75%">
                  <FormChips :form="fighter.form" />
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
                <v-col class="fifth  ma-1 mb-5">
                  Interaction
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import engine from '@/engine/engine.js';
import data from '@/data/data.js';
export default {
  name: 'Unit',

  components: {
    FormChips: () => import('@/components/FormChips.vue'),
  },

  props: {
    fighterId: Number,
  },

  // watch: {
  //   fighterId: () => {
  //     console.log('id change');
  //   },
  // },

  created() {
    const id = this.isFromRoute ? this.$route.params.id : this.fighterId;
    this.fighter = this.$store.getters.getFighterById(id);

    console.log(this.league);

    this.league.forEach((club) => {
      club.squad.forEach((fighter) => {
        console.log(fighter);
        console.log(this.fighterId);

        if (this.isFromRoute) {
          this.fighterId = this.$route.params.id;
        }

        if (fighter == this.fighterId) {
          this.color = { ...club.color };
          console.log(this.color);
        }
      });
    });
  },

  computed: {
    league() {
      return this.$store.getters.league;
    },
    isFromRoute() {
      return this.$route.params.id < data.idCodes.fighter + 1000 ? true : false;
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
          name: 'Endurance',
          value: this.fighter.physical.endurance,
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

  data: () => ({
    fighter: undefined,
    color: undefined,
  }),

  methods: {
    typeOfFighter(fighter) {
      return engine.typeOfFighter(fighter);
    },
    handleClose() {
      if (this.isFromRoute) {
        this.$router.go(-1);
      } else {
        this.$emit('close');
      }
    },
    imageSource(item) {
      return engine.countryCode(item.personal.nationality);
    },
  },
};
</script>
