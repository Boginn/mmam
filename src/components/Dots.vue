<template>
  <v-container>
    <div id="sketch">
      <!-- Canvas -->
      <canvas id="c"></canvas>
      <!-- Add Rectangle Button -->
      <div>
        <button @click="drawRect">Add Rect</button>
        <button @click="subWidth">-</button>
        <button @click="addWidth">+</button>
      </div>
    </div>
  </v-container>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Dots',

  mounted() {
    var c = document.getElementById('c');
    var ctx = c.getContext('2d');
    this.vueCanvas = ctx;
  },

  data: () => ({
    vueCanvas: null,
    rectWidth: 200,
  }),

  computed: {},

  methods: {
    drawRect() {
      // clear canvas
      this.vueCanvas.clearRect(0, 0, 400, 200);

      // draw rect
      this.vueCanvas.beginPath();
      this.vueCanvas.rect(20, 20, this.rectWidth, 100);
      this.vueCanvas.stroke();
    },
    addWidth() {
      this.rectWidth += 10;
      this.drawRect();
    },
    subWidth() {
      this.rectWidth -= 10;
      this.drawRect();
    },
  },
};
</script>

<style scoped>
#scetch {
  padding: 20px;
  margin: 20px;
}

#c {
  height: 200px;
  width: 400px;
  border: 1px solid gray;
}
</style>
