function Target(config) {
  this.x = 0;
  this.y = 0;
  this.hit_count = 0;
  this.end_x;
  this.end_y;
  this.word = config.word;
  this.word_width = 90;
  this.ctx = TYYP.ctx;
  this.img = new Image();
  this.dead = false;
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
    if (this.dead && this.y >= this.end_y) {
      this.velocity = 6;

      if (typeof this.score_balloon == 'undefined') {
        this.score_balloon = new ScoreBalloon({
          x: this.x,
          y: this.y,
          val: "+ " + this.hit_count.toString(),
          velocity: -.05,
          opacity: 1,
          decay_rate: .01,
          color: {r: 0, g: 100, b: 0}
        });
        TYYP.score_balloons.push(this.score_balloon);
      }
    }
  },

  hit: function(code) {
    var score_balloon;

    if (this.word[this.hit_count] == KEYS.getChar(code)) {
      TYYP.score++;
      TYYP.hits++;
      this.hit_count++;
      if (this.hit_count == this.word.length && !this.dead) {
        this.dead = true;
      }
      return true
    }
    else {
      TYYP.misses++;
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

    this.ctx.font = this.font;
    this.ctx.fillStyle = "#ff0000";
    this.ctx.fillText(hit_letters, this.x - this.word_width / 2, this.y + 15);
    this.ctx.fillStyle = "#000000";
    this.ctx.fillText(ok_letters, this.x - this.word_width / 2 + hit_width, this.y + 15);
  }
}

Target.prototype.velocity = 1;
Target.prototype.font = "16px Arial";
Target.prototype.color = "#ff0000";
