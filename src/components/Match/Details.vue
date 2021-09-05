<template>
    <v-col class="pb-0">
      <v-row class="pb-0">
        <v-col
          align="center"
          v-for="(ring, index) in activity"
          :key="index"
        >
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-header class="text-center body-2 font-shadow">
                Details
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-chip outlined>
                  Actions: {{ ring.home }} -
                  {{ ring.away }}
                </v-chip>
                <v-chip outlined>
                  Significant: {{ ring.homeSignificant }} -
                  {{ ring.awaySignificant }}
                </v-chip>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
    </v-col>
</template>

<script>
export default {
  name: "Details",
  components: {},

  props: {
    activity: Array,

  },

}
</script>
