<template>
  <v-container>
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="coaches"
          :items-per-page="10"
          item-key="name"
          class="elevation-6  ma-5 pa-4 mt-8 fill-width  font-shadow"
          :hide-default-footer="true"
        >
        </v-data-table>
        <!-- <span v-for="n in 3" :key="n">{{ n - 1 }}</span> -->
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import data from '../data/data';

export default {
  name: 'Staff',
  components: {},
  created() {
    if (!this.$route.params.id) {
      this.id = this.selectedClubId;
      this.club = this.getClub(this.selectedClubId);
    } else {
      this.id = this.$route.params.id;
      this.club = this.getClub(this.id);
    }

    console.log(this.club);
  },
  computed: {
    headers() {
      return data.headers.staff;
    },
    coaches() {
      const coaches = [];
      this.club.staff.forEach((coach) => {
        coaches.push(this.getCoach(coach));
      });
      return coaches;
    },
    selectedClubId() {
      return this.$store.getters.selectedClubId;
    },
    // club() {
    //   return this.getClub(this.playerClubId);
    // },
    routes() {
      return data.routes.staff;
    },
  },
  data: () => ({
    id: undefined,
    club: undefined,
  }),
  methods: {
    getClub(id) {
      return this.$store.getters.getClubById(id);
    },
    getCoach(id) {
      return this.$store.getters.getCoachById(id);
    },
  },
};
</script>
