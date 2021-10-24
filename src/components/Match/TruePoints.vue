<template>
  <v-container style="position: absolute; bottom: 0%; left: 73%;">
    <v-card width="25%">
      <v-card-title class="text-center">
        True Points
      </v-card-title>

      <v-card-text>
        <v-row align="center">
          <v-col
            align="center"
            v-for="(ring, index) in truePoints"
            :key="index"
          >
            <div class=" ">
              <v-col class="primary">
                {{ ring[0].home + ring[0].homeSignificant }}
                -
                {{ ring[1].home + ring[1].homeSignificant }}
                -
                {{ ring[2].home + ring[2].homeSignificant }}
              </v-col>
              <v-col class="fourth">
                {{ ring[0].away + ring[0].awaySignificant }}
                -
                {{ ring[1].away + ring[1].awaySignificant }}
                -
                {{ ring[2].away + ring[2].awaySignificant }}
              </v-col>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'TruePoints',
  components: {},

  props: {
    truePoints: Array,
  },

  created() {},

  data: () => ({}),

  computed: {
    rings() {
      return ['Left', 'Center', 'Right'];
    },
  },

  methods: {},
};
</script>
