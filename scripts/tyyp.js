var TYYP = {
  frame_count: 0,
  words: ["hello", "world", "game", "time", "longshanks", "answer"],
  targets: [],
  bullets: [],

  init: function() {
    TYYP.canvas = document.getElementById('game_board');
    TYYP.ctx = TYYP.canvas.getContext('2d');
    TYYP.c_width = TYYP.canvas.width;
    TYYP.c_height = TYYP.canvas.height;

    // TODO: remove jQuery dependency
    $(document).keydown(function(e) {
        if (e.keyCode == 32) {
          var assigned_target;
          for (var i = 0; i < TYYP.targets.length; i++) {
            if (TYYP.targets[i].hit_count < TYYP.targets[i].word.length) {
              assigned_target = TYYP.targets[i];
              break;    
            }
          }
          if (assigned_target) {
            var new_bullet = new Bullet(assigned_target);
            new_bullet.init();
            TYYP.bullets.push(new_bullet);
            assigned_target.end_y = new_bullet.end_y;
            assigned_target.hit_count++;  
          }
        } 
      });

      requestAnimationFrame(TYYP.loop);
  },

  // Generic functions
  get_random_color: function() {
    var letters  = '0123456789ABCDEF'.split(''),
        color    = '#';

    for (var i = 0; i < 6; i++ ) {
      color += letters[Math.round(Math.random() * 15)];
    }
    return color;
  },

  rand: function(min, max) {
    return Math.floor(Math.random() * max + min);
  },


  // Game loop functions
  // 
  
  loop: function() {
    TYYP.update();
    TYYP.draw();
    requestAnimationFrame(TYYP.loop);
  },

  update: function() {
    for (var i = 0; i < TYYP.targets.length; i++) {
      TYYP.targets[i].update_position();
      if (TYYP.targets[i].y > TYYP.c_height + 5) {
        TYYP.targets.splice(i, 1);
        i--;
      }
    }

    for (var i = 0; i < TYYP.bullets.length; i++) {
      TYYP.bullets[i].update_position();

      if (TYYP.bullets[i].y < TYYP.bullets[i].end_y ) {
        TYYP.bullets.splice(i, 1);
        i--;
      }
    }

    if (TYYP.targets.length < 9 && TYYP.frame_count % 150 == 0) {
      var new_target = new Target({word: TYYP.words[TYYP.rand(0, TYYP.words.length)], color: TYYP.get_random_color()});
      new_target.init();
      TYYP.targets.push(new_target);
    }

    TYYP.frame_count++;  
  },

  draw: function() {
    TYYP.ctx.clearRect(0, 0, TYYP.c_width, TYYP.c_height);
    TYYP.ctx.fillStyle = "222222";
    TYYP.ctx.fillRect(0, 0, TYYP.c_width, TYYP.c_height);

    for (var i = 0; i < TYYP.targets.length; i++) {
      TYYP.targets[i].draw();
    }

    for (var i = 0; i < TYYP.bullets.length; i++) {
      TYYP.bullets[i].draw();
    }
  }
}

$(document).ready(function() {
  TYYP.init();
});