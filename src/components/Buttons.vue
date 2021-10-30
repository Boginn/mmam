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
              <span
                v-if="route.path == 'news' && unreadMessages"
                class="notification code primary"
              >
                {{ unreadMessages }}
              </span>
            </v-card-title>
          </router-link>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import engine from '@/engine/engine.js';
export default {
  name: 'Buttons',
  components: {},

  props: {
    routes: Array,
  },

  computed: {
    news() {
      return this.$store.getters.news;
    },
    unreadMessages() {
      return engine.newMessages(this.news);
    },
  },
};
</script>

<style scoped>
.notification {
  padding-left: 10px;
  padding-right: 10px;
  margin: 1px;
  margin-left: 3px;
  border-radius: 100%;
}
</style>
