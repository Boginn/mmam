const app = new Vue({
  el: '#app',
  data: {
    message: 'Vue + Canvas API',
    vueCanvas: null,
    rectWidth: 200
  },
  mounted() {
      var c = document.getElementById("c");
      var ctx = c.getContext("2d");    
      this.vueCanvas = ctx;
  },
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
      this.rectWidth += 10
      this.drawRect()
    },
    subWidth() {
      this.rectWidth -= 10
      this.drawRect()      
    }
  }
})