<template>
  <span class="ml-4">
    <v-row
     :style="{'width': navBarLength}"
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
        class="small"
      >
          <router-link
            class="white--text"
            :to="`/${route.name.toLowerCase()}/`"
          >
        <v-card class="d-flex pa-1 font-shadow small justify-center" :class="route.color">
            <h5 class="">
              {{ route.name }}
              <v-icon x-small class="ml-2"> {{ route.icon }}</v-icon>
            </h5>
        </v-card>
          </router-link>
      </v-col>
    </v-row>

  </span>
</template>

<script>

export default {
  name: "Buttons",
  components: {},

  computed: {

    navBarLength(){
      return (this.routes.length*120)+'px';
    }
  },

props: {
 routes: Array,
},

};
</script>

<style >
.small {
  width: 110px;
}

</style>