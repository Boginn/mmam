<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card class="pa-5">
          <v-card-title class="justify-space-between">
            <p>{{ club.name }}</p>
            <p>{{ club.nationality }}</p>
          </v-card-title>

          <v-card
            class="secondary ma-1"
            v-for="fighter in squad"
            :key="fighter.id"
          >
            <v-card-title class="justify-space-between">
              <span>{{ getFighter(fighter).personal.name }}</span>
              <span>{{ getFighter(fighter).personal.nationality }}</span>
            </v-card-title>
          </v-card>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import data from '@/data/data.js';
export default {
  name: 'Club',

  props: {},

  computed: {
    headers() {
      return data.headers.squad;
    },
    squad() {
      return this.club.squad;
    },
    club() {
      return this.$store.getters.getClubById(this.$route.params.id);
    },

    data: () => ({}),
  },

  methods: {
    getFighter(id) {
      return this.$store.getters.getFighterById(id);
    },
  },
};
</script>
