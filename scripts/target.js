function Target(config) {
  this.x = 0;
  this.y = 0;
  this.hit_count = 0;
  this.end_x;
  this.end_y;
  this.word = config.word;
  this.color = config.color;
  this.word_width = 90;
  this.ctx = TYYP.ctx;
}

Target.prototype = {
  init: function() {
    this.ctx.font = this.font;
    this.x = TYYP.rand(this.word_width, TYYP.c_width - this.word_width * 2);
    this.word_width = this.ctx.measureText(this.word).width;
  },

  update_position: function() {
    this.y += this.velocity;
  },

  hit: function(code) {
    if (this.word[this.hit_count] == KEYS.getChar(code)) {
      this.hit_count++;
      return true
    }
    else {
      return false
    }
  },

  draw: function() {
    if (this.y < TYYP.c_height) {
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, 8, 0, 2 * Math.PI, false);
      if (this.hit_count == this.word.length && this.y >= this.end_y) {
        this.ctx.fillStyle = "#550000";
      }
      else {
        this.ctx.fillStyle = this.color;
      }
      this.ctx.fill();
      this.draw_text();
    }
  }, 

  draw_text: function() {
    var hit_letters = this.word.slice(0, this.hit_count),
        ok_letters  = this.word.slice(this.hit_count),
        hit_width   = this.ctx.measureText(hit_letters).width

    this.ctx.fillStyle = "#555555";
    this.ctx.fillText(hit_letters, this.x - this.word_width / 2, this.y + 15);
    this.ctx.fillStyle = "#ffffff";
    this.ctx.fillText(ok_letters, this.x - this.word_width / 2 + hit_width, this.y + 15);
  }
}

Target.prototype.velocity = 1;
Target.prototype.font = "16px Arial";
Target.prototype.color = "#ff0000";
