<template>
  <v-container>
    <h1>The English League Fixtures</h1>
    <v-card
      class="ma-5 pb-1"
      v-for="matchDate in usedFixtures"
      :key="matchDate.id"
    >
      <v-card-title>
        {{ dateByDay(matchDate[0].date) }}
      </v-card-title>
      <v-divider></v-divider>
      <v-row
        class="d-flex justify-space-between ma-5 title"
        v-for="fixture in matchDate"
        :key="fixture.id"
      >
        <v-col>
          <router-link
            :to="`/league/${fixture.clubs[0]}`"
            class="white--text"
            v-bind:class="{
              'yellow--text': fixture.clubs[0] == selectedClubId,
            }"
          >
            {{ getClub(fixture.clubs[0]).name }}
          </router-link>
        </v-col>
        <v-col class="text-center" v-if="fixture.score">
          {{ fixture.score.home }} - {{ fixture.score.away }}
        </v-col>
        <v-col class="text-center" v-else>
          vs
        </v-col>
        <v-col class="text-end">
          <router-link
            :to="`/league/${fixture.clubs[1]}`"
            class="white--text"
            v-bind:class="{
              'yellow--text': fixture.clubs[1] == selectedClubId,
            }"
          >
            {{ getClub(fixture.clubs[1]).name }}
          </router-link>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
// @ is an alias to /src
import data from '@/data/data.js';
import engine from '@/engine/engine.js';
export default {
  name: 'Fixtures',

  watch: {
    matches: function() {
      this.usedFixtures = this.fixtures;
    },
    isPostMatch: function() {
      this.usedFixtures = this.fixtures;
    },
  },

  created() {
    this.usedFixtures = this.fixtures;
  },

  computed: {
    selectedClubId() {
      return this.$store.getters.selectedClubId;
    },
    // displayDate() {
    //   return this.$store.getters.displayDate;
    // },
    routes() {
      return data.routes.home;
    },
    schedule() {
      return this.$store.getters.schedule;
    },
    matches() {
      return this.$store.getters.matches;
    },
    isPostMatch() {
      return this.$store.getters.isPostMatch;
    },
    day() {
      return this.$store.getters.day;
    },

    fixtures() {
      let fixtures = [];
      console.log(this.isPostMatch);
      if (this.isPostMatch) {
        this.matches.forEach((match) => {
          if (match.date > this.day - 3 && match.date < this.day - 3 + 6) {
            fixtures.push(match);
          }
        });
      } else {
        this.schedule.forEach((match) => {
          if (match.date > this.day && match.date < this.day + 7) {
            fixtures.push(match);
          }
        });
      }

      fixtures = fixtures.reduce(function(f, prop) {
        if (!f[prop['date']]) {
          f[prop['date']] = [];
        }
        f[prop['date']].push(prop);
        return f;
      }, {});

      console.log(fixtures);

      return fixtures;
    },
  },
  data: () => ({
    usedFixtures: null,
    // displayDate: engine.arrangeDate(this.splitDate),
  }),
  methods: {
    getClub(id) {
      return this.$store.getters.getClubById(id);
    },
    dateByDay(day) {
      return this.splitDate(engine.dateByDay(day));
    },
    splitDate(date) {
      return engine.arrangeDate(date.toString().split(' '));
    },
  },
};
</script>
