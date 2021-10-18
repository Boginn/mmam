<template>
  <span class="code">
    <v-chip
      v-for="(entry, index) in form.slice(-4)"
      :key="index"
      style="margin-left: 2px; margin-right: 2px;"
      v-bind:class="{
        small: small,
        'success success--text': entry == 'W',
        'warning warning--text': entry == 'F',
        'red red--text': entry == 'L',
        'white white--text': entry == 'D',
      }"
      outlined
      :small="small"
    >
      {{ entry }}
    </v-chip>
  </span>
</template>

<script>
export default {
  name: 'FormChips',

  props: {
    form: Array,
    small: Boolean,
  },
};
</script>

<style scoped>
.small {
  padding: 8px;
  /* border: 0; */
}
</style>
