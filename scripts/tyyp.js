var canvas = document.getElementById('game_board');
var ctx = canvas.getContext('2d');
var CANVAS_WIDTH = canvas.width;
var CANVAS_HEIGHT = canvas.height;
var frame_count = 0;
var words = ["hello", "world", "game", "time", "long words", "answer"];

var targets = [];
var bullets = [];

function get_random_color() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
    color += letters[Math.round(Math.random() * 15)];
  }
  return color;
}

var rand = function(min, max) {
  return Math.floor(Math.random() * max + min);
};

$(document).keydown(function(e) {
  if (e.keyCode == 32) {
    var assigned_target;
    for (var i = 0; i < targets.length; i++) {
      if (targets[i].hit_count < targets[i].word.length) {
        assigned_target = targets[i];
        break;    
      }
    }
    if (assigned_target) {
      var new_bullet = new Bullet(assigned_target);
      new_bullet.init();
      bullets.push(new_bullet);
      assigned_target.end_y = new_bullet.end_y;
      assigned_target.hit_count++;  
    }
  } 
});

var drawMap = function () {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.fillStyle = "222222";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  
  for (var i = 0; i < targets.length; i++) {
    targets[i].update_position();
    if (targets[i].y > CANVAS_HEIGHT + 5) {
      targets.splice(i, 1);
      i--;
    }
  }

  for (var i = 0; i < bullets.length; i++) {
    bullets[i].update_position();
    bullets[i].draw_obj();

    if (bullets[i].y < bullets[i].end_y ) {
      bullets.splice(i, 1);
      i--;
    }
  }

  if (targets.length < 9 && frame_count % 150 == 0) {
    var new_target = new Target(words[rand(0, words.length)]);
    new_target.init();
    targets.push(new_target);
  }

  frame_count++;
};

setInterval(drawMap, 1000 / 60);


