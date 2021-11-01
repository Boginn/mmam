<template>
  <v-container>
    <div id="sketch">
      <canvas id="canvas"></canvas>
    </div>
    <div>
      <v-btn @click="pharc()"></v-btn>
    </div>
  </v-container>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Dots',

  mounted() {
    var canvas = document.getElementById('canvas');
    this.canvasElement = canvas;
    this.canvas = canvas.getContext('2d');
  },

  props: {
    colors: Object,
  },

  data: () => ({
    canvasElement: null,
    canvas: null,

    pos: { x: 100, y: 75 },

    //
    circles: [],
    // canvas: document.getElementById('c'),
    // context: this.canvas.getContext('2d'),

    opacity: 1, // the opacity of the circles 0 to 1
    circleColor: ['rgba(34, 49, 63,)'],
    minSize: 15, // the minimum size of the circles in px
    maxSize: 15, // the maximum size of the circles in px
    numCircles: 2, // the number of circles
    minSpeed: -4, // the minimum speed, recommended: -maxspeed
    maxSpeed: 4, // the maximum speed of the circles
    // expandState:  false;                  // the direction of expansion
  }),

  computed: {},

  methods: {
    drawDot(pos, color) {
      // clear canvas
      // this.canvas.clearRect(0, 0, 400, 200);
      const { x, y } = pos;

      this.canvas.clearRect(0, 0, x, y);
      // draw rect
      this.canvas.beginPath();
      this.canvas.arc(x, y, 10, 0, 2 * Math.PI);
      this.canvas.fillStyle = color.primary;
      this.canvas.fill();
      this.canvas.strokeStyle = color.secondary;
      this.canvas.stroke();

      // this.canvas.beginPath();
      // this.canvas.arc(10, 75, 10, 0, 2 * Math.PI);
      // this.canvas.fillStyle = this.colors.away.primary;
      // this.canvas.fill();
      // this.canvas.strokeStyle = this.colors.away.secondary;
      // this.canvas.stroke();
    },

    pharc() {
      this.drawDot({ x: 50, y: 40 }, this.colors.away);
      this.drawDot({ x: 50, y: 30 }, this.colors.home);
      this.buildArray();
      this.build();
    },

    //
    buildArray() {
      'use strict';

      for (var i = 0; i < this.numCircles; i++) {
        var color =
            Math.floor(Math.random() * (this.circleColor.length - 1 + 1)) + 1,
          left =
            Math.floor(Math.random() * (this.canvasElement.width - 0 + 1)) + 0,
          top =
            Math.floor(Math.random() * (this.canvasElement.height - 0 + 1)) + 0,
          size =
            Math.floor(Math.random() * (this.maxSize - this.minSize + 1)) +
            this.minSize,
          leftSpeed =
            (Math.floor(Math.random() * (this.maxSpeed - this.minSpeed + 1)) +
              this.minSpeed) /
            10,
          topSpeed =
            (Math.floor(Math.random() * (this.maxSpeed - this.minSpeed + 1)) +
              this.minSpeed) /
            10,
          expandState = expandState;

        while (leftSpeed == 0 || topSpeed == 0) {
          (leftSpeed =
            (Math.floor(Math.random() * (this.maxSpeed - this.minSpeed + 1)) +
              this.minSpeed) /
            10),
            (topSpeed =
              (Math.floor(Math.random() * (this.maxSpeed - this.minSpeed + 1)) +
                this.minSpeed) /
              10);
        }
        var circle = {
          color: color,
          left: left,
          top: top,
          size: size,
          leftSpeed: leftSpeed,
          topSpeed: topSpeed,
          expandState: expandState,
        };
        this.circles.push(circle);
      }
    },

    build() {
      'use strict';

      for (var h = 0; h < this.circles.length; h++) {
        var curCircle = this.circles[h];
        this.canvas.fillStyle = this.colors[curCircle.color - 1];
        this.canvas.beginPath();
        if (curCircle.left > this.canvasElement.width + curCircle.size) {
          curCircle.left = 0 - curCircle.size;
          this.canvas.arc(
            curCircle.left,
            curCircle.top,
            curCircle.size,
            0,
            2 * Math.PI,
            false
          );
        } else if (curCircle.left < 0 - curCircle.size) {
          curCircle.left = this.canvasElement.width + curCircle.size;
          this.canvas.arc(
            curCircle.left,
            curCircle.top,
            curCircle.size,
            0,
            2 * Math.PI,
            false
          );
        } else {
          curCircle.left = curCircle.left + curCircle.leftSpeed;
          this.canvas.arc(
            curCircle.left,
            curCircle.top,
            curCircle.size,
            0,
            2 * Math.PI,
            false
          );
        }

        if (curCircle.top > this.canvasElement.height + curCircle.size) {
          curCircle.top = 0 - curCircle.size;
          this.canvas.arc(
            curCircle.left,
            curCircle.top,
            curCircle.size,
            0,
            2 * Math.PI,
            false
          );
        } else if (curCircle.top < 0 - curCircle.size) {
          curCircle.top = this.canvasElement.height + curCircle.size;
          this.canvas.arc(
            curCircle.left,
            curCircle.top,
            curCircle.size,
            0,
            2 * Math.PI,
            false
          );
        } else {
          curCircle.top = curCircle.top + curCircle.topSpeed;
          if (
            curCircle.size != this.maxSize &&
            curCircle.size != this.minSize &&
            curCircle.expandState == false
          ) {
            curCircle.size = curCircle.size - 0.1;
          } else if (
            curCircle.size != this.maxSize &&
            curCircle.size != this.minSize &&
            curCircle.expandState == true
          ) {
            curCircle.size = curCircle.size + 0.1;
          } else if (
            curCircle.size == this.maxSize &&
            curCircle.expandState == true
          ) {
            curCircle.expandState = false;
            curCircle.size = curCircle.size - 0.1;
          } else if (
            curCircle.size == this.minSize &&
            curCircle.expandState == false
          ) {
            curCircle.expandState = true;
            curCircle.size = curCircle.size + 0.1;
          }
          this.canvas.arc(
            curCircle.left,
            curCircle.top,
            curCircle.size,
            0,
            2 * Math.PI,
            false
          );
        }

        this.canvas.closePath();
        this.canvas.fill();
        this.canvas.ellipse;
      }
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
