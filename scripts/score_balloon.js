function ScoreBalloon(config) {
  this.x = config.x;
  this.y = config.y;
  this.val = config.val;
  this.ctx = TYYP.ctx;
  this.velocity = config.velocity;
  this.opacity = config.opacity;
  this.decay_rate = config.decay_rate;
  this.color = config.color;
  this.dead = false;
}

ScoreBalloon.prototype = {
  init: function() {

  },

  updatePosition: function() {
    this.y += this.velocity;
    this.fade();
    if (this.opacity == 0) {
      this.dead = true;
    }
  },

  fade: function() {
    if (this.opacity > 0) {
      this.opacity -= this.decay_rate;
    }
  },

  draw: function() {
    if (this.y < TYYP.c_height + 50) {
      this.ctx.fillStyle = "rgba(" + this.color.r + ", " + this.color.g + 
        ", " + this.color.b + ", " + this.opacity + ")";
      this.ctx.font = "16px Arial";
      this.ctx.fillText(this.val, this.x, this.y);
    }
  }
}