<template>
  <v-container>
    <Buttons :routes="routes" />
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="league"
          :items-per-page="10"
          item-key="name"
          class="elevation-6 tertiary darken-5  ma-5 pa-4 mt-8 fill-width  font-shadow"
        >
          <!-- eslint-disable-next-line -->
          <template v-slot:item.name="{ item }">
            <router-link :to="`/league/${item.id}`" class="table">
              {{ item.name }}
            </router-link>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Buttons from '@/components/Buttons.vue';
import data from '@/data/data.js';

export default {
  name: 'League',
  components: {
    Buttons,
  },
  computed: {
    headers() {
      return data.headers.league;
    },
    league() {
      return this.$store.getters.league;
    },
    routes() {
      return data.routes.league;
    },
  },
  data: () => ({}),
};
</script>
