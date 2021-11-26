<template>
  <div>
    <canvas id="canvas"></canvas>
  </div>
</template>

<script>
// @ is an alias to /src

import classes from '../../data/classes.js';

export default {
  name: 'AwayInitiativeDots',

  mounted() {
    var canvas = document.getElementById('canvas');
    this.canvasElement = canvas;
    this.canvas = canvas.getContext('2d');

    this.animateFoundation();
  },

  props: {
    colors: Object,
  },

  data: () => ({
    canvasElement: null,
    canvas: null,

    //boundaries
    minBounds: 15,
    maxBounds: 65,

    speed: -5,
  }),

  computed: {},

  methods: {
    random() {
      return (
        Math.floor(Math.random() * (this.maxBounds - this.minBounds)) +
        this.minBounds
      );
    },
    drawDot(unit) {
      const { pos, color, size } = unit;
      const { x, y } = pos;

      this.canvas.clearRect(50, 80, 300, 350);

      this.canvas.beginPath();
      this.canvas.arc(x, y, size, 0, 2 * Math.PI);
      this.canvas.fillStyle = color.primary;
      this.canvas.fill();
      this.canvas.strokeStyle = color.secondary;
      this.canvas.stroke();
    },

    // determinePosition() {
    //   return { x: this.random(), y: this.random() };
    // },

    animateFoundation() {
      let home = new classes.MatchDot(this.colors.home, {
        x: 75,
        y: 60,
      });
      let away = new classes.MatchDot(this.colors.away, {
        x: 75,
        y: 120,
      });

      this.animateUnit(away);
      this.drawDot(home);
    },

    animateUnit(unit) {
      unit.pos.y += this.speed;
      setTimeout(() => {
        this.drawDot(unit);
        // this.drawDot(away);
        if (unit.pos.y > 75) {
          this.animateUnit(unit);
        }
      }, 120);
    },
  },
};
</script>

<style scoped>
#c {
  height: 200px;
  width: 400px;
  border: 1px solid gray;
}
</style>
