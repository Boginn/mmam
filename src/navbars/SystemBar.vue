<template>
  <v-app-bar app class="abcolor " dark>
    <img alt="logo" src="../assets/logo-white.png" />
    <router-link :to="`/`" class="ml-5">
      <v-btn :disabled="isMatchday" class="primary secondary--text font-shadow">
        {{ selectedClub.name }}
      </v-btn>
    </router-link>
    <router-link
      :to="`/league`"
      class="text-center ml-5 title font-shadow white--text"
      v-if="!isMatchday"
    >
      {{ placeInLeague }} in The English League
    </router-link>
    <span class="text-center ml-5 title font-shadow" v-if="isMatchday">
      {{ matchTitle }}
    </span>
    <ButtonsSmall :routes="routes" :disabled="isMatchday" />
    <v-col class="text-end">
      <!-- <v-btn
        v-if="!isMatchday"
        outlined
        small
        class="mr-3 "
        :disabled="isMatchday || isAdvancingDate"
        @click="$router.go(-1)"
        ><span> &larr;</span>
      </v-btn>
      <v-btn
        v-if="!isMatchday"
        outlined
        small
        class="mr-3 "
        :disabled="isMatchday || isAdvancingDate"
        @click="$router.go(1)"
        ><span> &rarr;</span>
      </v-btn> -->

      <!-- <v-btn
          class="green darken-3"
          :disabled="isMatchday || isAdvancingDate"
          @click="this.continue"
          ><span v-if="isMatchday"> Match Day</span>
          <span v-else>Continue</span></v-btn
        > -->
      <span class="text-center ml-5 title font-shadow " v-if="isDeveloper">
        <span class="grey--text"> Day:</span> <b> {{ day }}</b
        ><span class="grey--text"> displayDate:</span>
        <b style="cursor: pointer;" @click="$router.push('/fixtures')">{{
          displayDate
        }}</b>
      </span>
      <span
        @click="$router.push('/fixtures')"
        style="cursor: pointer;"
        class="text-center ml-5 title font-shadow code"
        v-else
      >
        <b>{{ displayDate }}</b>
      </span>
    </v-col>
  </v-app-bar>
</template>

<script>
import ButtonsSmall from '@/components/ButtonsSmall.vue';
import data from '../data/data';

export default {
  name: 'SystemBar',
  components: {
    ButtonsSmall,
  },

  props: {
    selectedClubId: Number,
    displayDate: String,
    match: Object,
  },

  computed: {
    selectedClub() {
      return this.getClub(this.$store.getters.selectedClubId);
    },
    isMatchday() {
      return this.$store.getters.isMatchday;
    },
    isDeveloper() {
      return this.$store.getters.isDeveloper;
    },
    isAdvancingDate() {
      return this.$store.getters.isAdvancingDate;
    },
    league() {
      return this.$store.getters.league;
    },
    routes() {
      return data.routes.appbar;
    },
    matchTitle() {
      return `${this.getClub(this.match.clubs[0]).name} vs ${
        this.getClub(this.match.clubs[1]).name
      }`;
    },

    placeInLeague() {
      const place = this.league.indexOf(this.getClub(this.selectedClubId)) + 1;
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

    day() {
      if (this.isAdvancingDate) {
        return this.$store.getters.day - 1;
      } else {
        return this.$store.getters.day;
      }
    },
  },
  data: () => ({}),

  methods: {
    getClub(id) {
      return this.$store.getters.getClubById(id);
    },
  },
};
</script>
