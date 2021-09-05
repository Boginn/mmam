<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>
            {{ firstName }} '{{ fighter.nickname }}' {{ lastName }} ({{
              fighter.personal.age
            }}) - {{ fighter.personal.height }}cm -
            {{ fighter.personal.nationality }}
          </v-card-title>
          <v-row>
   

            <v-col>
              <v-card-text>
                <div>
                  Head: Durability:<b>{{ fighter.head.durability }}</b> Chin:
                  <b>{{ fighter.head.chin }}</b>
                </div>
                <div>
                  Left arm: Power: <b>{{ fighter.arms[0].power }}</b> Reach:
                  <b>{{ fighter.arms[0].reach }}</b> Durability:
                  <b>{{ fighter.arms[0].durability }}</b>
                </div>
                <div>
                  Right arm: Power: <b>{{ fighter.arms[1].power }}</b> Reach:
                  <b>{{ fighter.arms[1].reach }}</b> Durability:
                  <b>{{ fighter.arms[1].durability }}</b>
                </div>

                <div>
                  Body: Durability: <b>{{ fighter.body.durability }}</b>
                </div>

                <div>
                  Left leg: Power: <b>{{ fighter.legs[0].power }}</b> Reach:
                  <b>{{ fighter.legs[0].reach }}</b> Durability:
                  <b>{{ fighter.legs[0].durability }}</b>
                </div>
                <div>
                  Right leg: Power: <b>{{ fighter.legs[1].power }}</b> Reach:
                  <b>{{ fighter.legs[1].reach }}</b> Durability:
                  <b>{{ fighter.legs[1].durability }}</b>
                </div>
              </v-card-text>
            </v-col>

            <!-- mental -->
            <v-col>

              <v-row>
                <v-col>
                  Adaptability
                </v-col>
                <v-col>
                  {{ fighter.mental.adaptability }}
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  Determination
                </v-col>
                <v-col>
                  {{ fighter.mental.determination }}
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  Ambition
                </v-col>
                <v-col>
                  {{ fighter.mental.ambition }}
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  Loyalty
                </v-col>
                <v-col>
                  {{ fighter.mental.loyalty }}
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  Pressure
                </v-col>
                <v-col>
                  {{ fighter.mental.pressure }}
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  Professionalism
                </v-col>
                <v-col>
                  {{ fighter.mental.professionalism }}
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  Sportsmanship
                </v-col>
                <v-col>
                  {{ fighter.mental.sportsmanship }}
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  Temperement
                </v-col>
                <v-col>
                  {{ fighter.mental.temperement }}
                </v-col>
              </v-row>
              
            </v-col>
<!-- physical -->
            <v-col>
              <v-row>
                <v-col>
                  Flair
                </v-col>
                <v-col>
                  {{ fighter.physical.flair }}
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  Agility
                </v-col>
                <v-col>
                  {{ fighter.physical.agility }}
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  Strength
                </v-col>
                <v-col>
                  {{ fighter.physical.strength }}
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  Stamina
                </v-col>
                <v-col>
                  {{ fighter.physical.stamina }}
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  Pace
                </v-col>
                <v-col>
                  {{ fighter.physical.pace }}
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  Acceleration
                </v-col>
                <v-col>
                  {{ fighter.physical.acceleration }}
                </v-col>
              </v-row>
            </v-col>

  
<!-- skill -->
            <v-col>
              <v-row>
                <v-col>
                  Anticipation
                </v-col>
                <v-col>
                  {{ fighter.skill.anticipation }}
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  Leadership
                </v-col>
                <v-col>
                  {{ fighter.skill.leadership }}
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  Positioning
                </v-col>
                <v-col>
                  {{ fighter.skill.positioning }}
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  Decisions
                </v-col>
                <v-col>
                  {{ fighter.skill.decisions }}
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  Vision
                </v-col>
                <v-col>
                  {{ fighter.skill.vision }}
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  Versatility
                </v-col>
                <v-col>
                  {{ fighter.skill.versatility }}
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  Finishing
                </v-col>
                <v-col>
                  {{ fighter.skill.finishing }}
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

export default {
  name: "Unit",

  props: {
  },

  computed: {

       fighter() {
      return this.$store.getters.getFighterById(this.$route.params.id);
    },

    firstName() {
      return this.fighter.personal.name.split(" ")[0];
    },
    lastName() {
      return this.fighter.personal.name.split(" ")[1];
    },
  },

  data: () => ({}),
};
</script>
