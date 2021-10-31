<template>
  <v-col class="ml-0 pl-0 mr-0 pr-0">
    <v-card class="commentary">
      <v-card-text class="pa-5">
        <v-row v-for="(msg, index) in messages.slice().reverse()" :key="index">
          <v-col
            v-if="msg.primary"
            :style="{
              backgroundColor: msg.primary,
              color: msg.secondary,
            }"
            class="msg mt-1 mb-1 pa-1 font-shadow"
            :class="{ title: index == 0 }"
          >
            {{ msg.text }}
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
export default {
  name: 'Commentary',
  components: {},

  props: {
    messages: Array,
  },
};
</script>

<style scoped>
.commentary {
  height: 650px;

  overflow-y: auto;
}
.msg {
  text-align: center;
  border-bottom: 1px solid rgb(48, 48, 48);
}
</style>
