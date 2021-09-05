<template>


    <v-container >
      <Buttons :routes="routes" />
      <v-col>
        <v-divider class="mt-4"></v-divider>
        <h5 class="text-center mt-2">TEAM NAME. MANAGER.</h5>
      </v-col>
    </v-container>
</template>

<script>
// @ is an alias to /src
import Buttons from "@/components/Buttons.vue";
import data from "@/data/data.js";

export default {
  name: "Home",
  components: {
    Buttons,
  },
  computed: {
    routes() {
      // let routes = [];
      // data.routes.forEach((element) => {
      //   routes.push(element);
      // });

      return data.routes.home;
    },
    matchday() {
      return this.$store.getters.matchday;
    },

  },
  data: () => ({}),
};
</script>
