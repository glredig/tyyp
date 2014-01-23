function Target(word) {
  this.x = 0;
  this.y = 0;
  this.hit_count = 0;
  this.end_x;
  this.end_y;
  this.word = word;
  this.word_width = 90;
}

Target.prototype = {
  init: function() {
    ctx.font = this.font;
    this.x = rand(this.word_width, CANVAS_WIDTH - this.word_width * 2);
    this.word_width = ctx.measureText(this.word).width;
  },

  update_position: function() {
    if (this.y < CANVAS_HEIGHT) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 8, 0, 2 * Math.PI, false);
      if (this.hit_count == this.word.length && this.y >= this.end_y) {
        ctx.fillStyle = "#550000";
      }
      else {
        ctx.fillStyle = this.color;
      }
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.fillText(this.word, this.x - this.word_width / 2, this.y + 15);
    }
  
    this.y += this.velocity;
  
  }
}

Target.prototype.velocity = 1;
Target.prototype.font = "16px Arial";
Target.prototype.color = "#ff0000";
