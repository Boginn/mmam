<template>
  <span class="ml-4">
    <v-row :style="{ width: navBarLength }">
      <v-col v-for="route in routes" :key="route.name" class="small">
        <router-link
          v-if="!disabled"
          class="white--text"
          :to="`/${route.name.toLowerCase()}/`"
        >
          <v-card
            class="d-flex pa-1 font-shadow small justify-center"
            :class="route.color"
          >
            <h5 @click="toggle()">
              {{ route.name }}
              <span
                v-if="route.path == 'news' && unreadMessages"
                class="notification code primary"
              >
                {{ unreadMessages }}
              </span>
              <v-icon x-small class="ml-2" v-else> {{ route.icon }}</v-icon>
            </h5>
          </v-card>
        </router-link>
      </v-col>
    </v-row>
  </span>
</template>

<script>
import engine from '@/engine/engine.js';
export default {
  name: 'Buttons',
  components: {},

  computed: {
    navBarLength() {
      return this.routes.length * 120 + 'px';
    },
    news() {
      return this.$store.getters.news;
    },
    unreadMessages() {
      return engine.newMessages(this.news);
    },
  },

  props: {
    routes: Array,
    disabled: Boolean,
  },
  methods: {
    toggle() {
      this.$store.dispatch('toggleNextUnread');
    },
  },
};
</script>

<style scoped>
.notification {
  padding-left: 5px;
  padding-right: 5px;
  margin: 1px;
  margin-left: 3px;
  border-radius: 100%;
}
</style>
