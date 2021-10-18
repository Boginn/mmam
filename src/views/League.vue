<template>
  <v-container>
    <v-row class="justify-center">
      <div>
        <ButtonsSmall :routes="routes" />
      </div>
    </v-row>

    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="league"
          :items-per-page="10"
          item-key="name"
          :hide-default-footer="true"
          class="elevation-6 sixth ma-5 pa-4 mt-8 font-shadow"
        >
          <!-- eslint-disable -->

          <template v-slot:header.name="{ header }">
            <div class="justify-center title">
              The English League
              <!-- well make that a variable much later -->
            </div>
          </template>
          <template v-slot:header.competitions.league.points="{ header }">
            <div class="justify-center point-size"></div>
          </template>
          <template
            v-slot:header.competitions.league.pointsAgainst="{ header }"
          >
            <div class="justify-center point-size">
              Against
            </div>
          </template>
          <template v-slot:header.competitions.league.matches="{ header }">
            <div class="justify-center point-size">
              Matches
            </div>
          </template>
          <template v-slot:header.competitions.league.form="{ header }">
            <div class="justify-center point-size text-center ">
              Form
            </div>
          </template>
          <template v-slot:header.competitions.league.finishes="{ header }">
            <div class="justify-center point-size ">
              Finishes
            </div>
          </template>

          <template v-slot:item.name="{ item }">
            <div class="title ">
              <router-link
                :to="`/league/${item.id}`"
                class="white--text"
                v-bind:class="{
                  'yellow--text': item.id == selectedClubId,
                }"
              >
                <span class="code grey--text">
                  {{ placed(item) }}
                </span>
                {{ item.name }}
              </router-link>
            </div>
          </template>

          <template v-slot:item.competitions.league.points="{ item }">
            <div
              class="point-size title "
              v-bind:class="{
                'grey darken-4':
                  league.indexOf(item) > 0 && league.indexOf(item) < 8,
                'green darken-4': league.indexOf(item) == 0,
                'red darken-4': league.indexOf(item) > 7,
              }"
            >
              {{ item.competitions.league.points }}
            </div>
          </template>

          <template v-slot:item.competitions.league.pointsAgainst="{ item }">
            <div class="point-size error darken-4">
              {{ item.competitions.league.pointsAgainst }}
            </div>
          </template>

          <template v-slot:item.competitions.league.matches="{ item }">
            <div class="point-size brown darken-4">
              {{ item.competitions.league.matches }}
            </div>
          </template>

          <template v-slot:item.competitions.league.form="{ item }">
            <div class="">
              <!-- <v-chip
                class="code"
                v-bind:class="{
                  'success success--text': f == 'W',
                  'red red--text': f == 'L',
                }"
                outlined
                v-for="(f) in item.competitions.league.form.slice(-5)"
                :key="(f)"
              >
                {{ f }}
              </v-chip> -->
              <FormChips :form="item.competitions.league.form" :small="false" />
            </div>
          </template>

          <template v-slot:item.competitions.league.finishes="{ item }">
            <div class="point-size warning darken-4">
              {{ item.competitions.league.finishes }}
            </div>
          </template>
          <!-- eslint-enable -->
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import data from '@/data/data.js';

export default {
  name: 'League',
  components: {
    ButtonsSmall: () => import('@/components/ButtonsSmall.vue'),
    FormChips: () => import('@/components/FormChips.vue'),
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
    date() {
      return this.$store.getters.date;
    },
    selectedClubId() {
      return this.$store.getters.selectedClubId;
    },
  },

  data: () => ({
    showLeague: false,
    sortedLeague: undefined,
    sortBy: undefined,
    sortDesc: false,
  }),

  methods: {
    getClub(id) {
      return this.$store.getters.getClubById(id);
    },
    placed(item) {
      const place = this.league.indexOf(item) + 1;
      if (place == 1) {
        return `${place}st`;
      } else if (place == 2) {
        return `${place}nd`;
      } else if (place == 3) {
        return `${place}rd`;
      } else {
        return `${place}th`;
      }
    },
  },
};
</script>

<style>
.point-size {
  width: 50px;
  text-align: center;
  border-radius: 10px;
}
</style>
