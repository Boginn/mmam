<template>
<v-container>
  <v-row>
    <v-col>
<span v-for="n in 3" :key="n">{{n-1}}</span>
    </v-col>
  </v-row>
</v-container>
</template>

<script>



export default {
  name: 'Staff',
  components: {
    
  },
  computed: {

  },
  data: () =>({
    
  })
}
</script>
