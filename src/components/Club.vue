<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>

            {{ club.name }}
            {{ club.nationality }}
          </v-card-title>

            <v-card-text>
<v-data-table
        :headers="headers"
        :items="squad"
        :items-per-page="10"
        item-key="name"
        class="elevation-6 seventh ma-5 pa-4 mt-8 fill-width  font-shadow"
      >

         <!-- eslint-disable-next-line -->
        <template v-slot:item.personal.name="{ item }">
          <router-link :to="`/squad/${item.id}`" class="table">
            <v-icon class="mb-1" small>mdi-arrow-top-left</v-icon>
        {{ item.personal.name }}
          </router-link>
        </template>
      </v-data-table>
            </v-card-text>

        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import data from '@/data/data.js';
export default {
  name: "Club",

  props: {
  },

  computed: {
    headers() {
      return data.headers.squad;
    },
    squad() {
      return this.$store.getters.squad(this.$route.params.id);
    },
       club() {
      return this.$store.getters.getClubById(this.$route.params.id);
    },



  data: () => ({}),
},
};
</script>
