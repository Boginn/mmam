<template>
      <v-col class="text-center pt-1" >
        <v-col>
          <v-card class="commentary">
            <v-card-text>
              <v-row
                v-for="(msg, index) in messages.slice().reverse()"
                :key="index"
              >
                <v-col class="pa-1 font-shadow" :class="{ title: index == 0 }">
                  {{ msg }}
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-col>
</template>

<script>
export default {
  name: "Commentary",
  components: {},

  props: {
    messages: Array,


  },

}
</script>

<style >
.commentary {
  height: 145px;

  overflow-y: auto;
}
</style>
