<template>
  <v-container>
    <v-row
      class="d-flex justify-center flex-wrap-reverse align-content-center mt-6"
    >
      <v-col
        cols="8"
        xl="4"
        lg="4"
        md="4"
        sm="8"
        xs="8"
        v-for="route in routes"
        :key="route.name"
      >
        <v-card class="pa-2 ma-3 font-shadow " :class="route.color">
          <router-link
            class="white--text"
            :to="`/${route.name.toLowerCase()}/`"
          >
            <v-card-title class="d-flex justify-center">
              {{ route.name }}
              <v-icon x-large class="ml-2"> {{ route.icon }}</v-icon>
            </v-card-title>
          </router-link>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>

export default {
  name: "Buttons",
  components: {},

props: {
 routes: Array,
},

};
</script>
