<template>
  <v-container>
    <v-card class="news-inbox-card">
      <v-row>
        <v-col cols="2" class="divider-border">
          <div
            class="news-inbox-date  balance--text text-center"
            v-for="item in news"
            :key="item.id"
          >
            <div class="bgcolor darken-1 rounded">
              {{ item.date }}
            </div>
          </div>
        </v-col>
        <v-col>
          <div
            class="news-inbox "
            v-for="item in news"
            :key="item.id"
            v-bind:class="{
              'font-weight-bold ': !item.read,
              'primary white--text': selectedItem.id == item.id,
              'grey--text': item.read,
            }"
            @click="selectItem(item)"
          >
            {{ item.title }}
          </div>
        </v-col>
      </v-row>
    </v-card>
    <div class="justify-end d-flex ">
      <v-tab
        class="sixth rounded unread-btn"
        @click="nextUnread()"
        v-bind:class="{
          tertiary: true,
          sixth: false,
        }"
        >next unread</v-tab
      >
    </div>
    <v-card class="news-title-card  yellow--text">
      <v-card-title>
        {{ selectedItem.title }}
      </v-card-title>
    </v-card>
    <v-card class="news-content-card">
      <v-card-text class="news-content white--text">
        {{ selectedItem.content }}
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'News',
  components: {},
  created() {
    this.selectedItem = this.lastSelectedNewsItem;
    if (!this.selectedItem) {
      this.selectedItem = this.news.slice().reverse()[0];
    }
  },

  watch: {
    toggleNextUnread: {
      handler: function() {
        this.nextUnread();
      },
    },
  },

  computed: {
    toggleNextUnread() {
      return this.$store.getters.toggleNextUnread;
    },
    news() {
      return this.$store.getters.news.slice().reverse();
    },
    lastSelectedNewsItem() {
      return this.$store.getters.lastSelectedNewsItem;
    },
  },
  data: () => ({
    selectedItem: null,
  }),

  methods: {
    selectItem(item) {
      this.selectedItem = item;
      this.$store.dispatch('markAsRead', item);
      this.$store.dispatch('setLastSelectedNewsItem', item);
    },
    nextUnread() {
      let nextUnread;
      let okay = false;
      this.news.forEach((element) => {
        if (!element.read) {
          nextUnread = element;
          okay = true;
        }
      });
      if (okay) {
        this.$store.dispatch('markAsRead', nextUnread);
        this.selectedItem = nextUnread;
      }
    },
  },
};
</script>

<style scoped>
.divider-border {
  border-right: 1px solid white;
}
.unread-btn {
  padding-top: 2px;
  padding-bottom: 2px;
  margin-bottom: 10px;
}
.news-inbox-card {
  padding: 10px;
  height: 175px;
  margin-bottom: 10px;
  margin-top: 25px;
  overflow-y: auto;
  overflow-x: hidden;
}
.news-inbox-date {
  margin-left: 3px;
  padding: 1px;
}
.news-inbox {
  cursor: pointer;
  padding: 1px;
  padding-left: 5px;
}
.news-content-card {
  font-size: 14pt;
  height: 400px;
}
.news-content {
  font-size: 14pt;
}
.news-title-card {
  display: flex;
  justify-content: center;
  margin-bottom: 5px;
}
</style>
