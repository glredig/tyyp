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
  this.img = new Image();
}

Target.prototype = {
  init: function() {
    this.ctx.font = this.font;
    this.x = TYYP.rand(this.word_width, TYYP.c_width - this.word_width * 2);
    this.word_width = this.ctx.measureText(this.word).width;
    this.source_img = document.getElementById('chuters');
    this.img.src = this.source_img.src;
  },

  updatePosition: function() {
    this.y += this.velocity;
    if (this.hit_count == this.word.length && this.y >= this.end_y) {
      this.velocity = 6;
    }
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

  getNextLetter: function() {
    return this.word[this.hit_count];
  },

  draw: function() {
    var img = document.getElementById('')
    if (this.y < TYYP.c_height + 50) {
      if (this.hit_count == this.word.length && this.y >= this.end_y) {
        this.ctx.drawImage(this.img, this.source_img.width / 2, 0, this.source_img.width / 2, this.source_img.height, this.x - this.source_img.width / 5, this.y - this.source_img.height * .85, this.source_img.width / 2, this.source_img.height);
      }
      else {
        this.ctx.drawImage(this.img, 0, 0, this.source_img.width / 2, this.source_img.height, this.x - this.source_img.width / 4, this.y - this.source_img.height * .85, this.source_img.width / 2, this.source_img.height);
      }
      this.ctx.fill();
      this.drawText();
    }
  }, 

  drawText: function() {
    var hit_letters = this.word.slice(0, this.hit_count),
        ok_letters  = this.word.slice(this.hit_count),
        hit_width   = this.ctx.measureText(hit_letters).width

    this.ctx.fillStyle = "#ff0000";
    this.ctx.fillText(hit_letters, this.x - this.word_width / 2, this.y + 15);
    this.ctx.fillStyle = "#000000";
    this.ctx.fillText(ok_letters, this.x - this.word_width / 2 + hit_width, this.y + 15);
  }
}

Target.prototype.velocity = 1;
Target.prototype.font = "16px Arial";
Target.prototype.color = "#ff0000";
