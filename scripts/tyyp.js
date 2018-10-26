var TYYP = {
  frame_count: 0,
  words: [],
  targets: [],
  bullets: [],
  score_balloons: [],
  target_count: 0,
  score: 0,
  hits: 0,
  misses: 0,
  level: 1,
  missed_alien_count: 0,
  MAX_LEVEL: 10,

  init: function() {
    TYYP.canvas         = document.getElementById('game_board');
    TYYP.canvas.style.height = TYYP.canvas.height = window.innerHeight;
    TYYP.ctx            = TYYP.canvas.getContext('2d');
    TYYP.c_width        = TYYP.canvas.width;
    TYYP.c_height       = TYYP.canvas.height;

    // Wait for word retrieving AJAX to finish before starting the
    // game
    TYYP.getWords(TYYP.level).then(function(data) {
      var parsedJSON = typeof data === 'object' ? data : JSON.parse(data);
      

      // Add game friendly words to the array
      for (var i = 0; i < parsedJSON.length; i++) {
        var word = parsedJSON[i]["word"];
        if (TYYP.noSpecialCharacters(word)) {
          TYYP.words.push(word.toLowerCase());          
        }
      }
      TYYP.setupListener();
      requestAnimationFrame(TYYP.loop);  
    });

    // TODO: remove jQuery dependency
  },

  getWords: function(level) {
    
    var deferred      = Q.defer(),
        req           = new XMLHttpRequest();
        maxWordLength = 4 + level;
        minWordLength = Math.min(2 + level, 10);
        url           = "http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=true&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=" + minWordLength + "&maxLength=" + maxWordLength + "&limit=80&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5";
    
    req.open('GET', url, true);

    req.onreadystatechange = function(e) {
      if (req.readyState != 4) {
        return;
      }

      // Error case
      if (req.status != 200 && req.status != 304) {
        // In case the API is down, use the limited static data

        deferred.resolve(TYYP.getStaticWords(minWordLength, maxWordLength));
        // deferred.reject(new Error('Server responded with ' + req.status));
      }
      // Success case; resolve
      else {
        deferred.resolve(req.responseText);
      }
    }

    req.send();

    return deferred.promise;
  },

  // Grab words from JSON file as fallback
  getStaticWords: function(minLength, maxLength) {
    var super_set = [];
    Object.keys(sample_words).forEach(function(key) {
      if (parseInt(key, 10) <= maxLength) {
        super_set = super_set.concat(sample_words[key]);
      }
    });

    return super_set;
  },

  // Exclude words containing any special characters 
  noSpecialCharacters: function(word) {
    return /^[a-zA-Z]+$/.test(word);
  },

  advanceLevel: function() {
    TYYP.getWords(TYYP.level + 1).then(function(data) {
      var parsedJSON = typeof data === 'object' ? data : JSON.parse(data);
      TYYP.words.splice(0, 70);
      
      // Add game friendly words to the array
      for (var i = 0; i < parsedJSON.length; i++) {
        var word = parsedJSON[i]["word"];
        if (TYYP.noSpecialCharacters(word)) {
          TYYP.words.push(word.toLowerCase());          
        }
      }
    });
    TYYP.level++;

    TYYP.targets = [];
    TYYP.target_count = 0;
    TYYP.score_balloons = [];

    var new_target = new Target({word: TYYP.words[TYYP.rand(0, TYYP.words.length)]});
    new_target.init();
    TYYP.targets.push(new_target);
    TYYP.target_count++;

    requestAnimationFrame(TYYP.loop); 
  },

  // Generic functions
  rand: function(min, max) {
    return Math.floor(Math.random() * max + min);
  },

  setupListener: function() {
    $(document).keydown(function(e) {
      if (TYYP.assigned_target == undefined || TYYP.assigned_target.dead) {
        TYYP.findTarget(e.keyCode);
      }

      // Key was pressed but didn't assign a target (i.e. total miss)
      if (TYYP.assigned_target == undefined) {
        TYYP.misses++;
      }

      // If a target is assigned, and the pressed key registers a hit on it
      // we create a bullet
      if (TYYP.assigned_target && TYYP.assigned_target.hit(e.keyCode)) {
        var new_bullet = new Bullet(TYYP.assigned_target);
        TYYP.hits++;
        new_bullet.init();
        TYYP.bullets.push(new_bullet);
        TYYP.assigned_target.end_y = new_bullet.end_y;

        // If kepress was a kill shot, we add to the score and reset 
        // the assigned target
        if (TYYP.assigned_target.dead) {
          TYYP.score += TYYP.assigned_target.word.length;
          TYYP.assigned_target = undefined;
        }
      }
    });
  },

  // Game loop functions
  // 
  
  loop: function() {
    TYYP.update();
    TYYP.draw();

    // Targets are still in play, so we continue looping
    if (TYYP.target_count > 0 && TYYP.targets.length > 0) {
      requestAnimationFrame(TYYP.loop);      
    }
    // No targets, but we met minimum hit requirement,
    // so we advance to the next level
    else if (TYYP.missed_alien_count < 4) {
      TYYP.advanceLevel();
    }
    // Failed to kill enough aliens
    else {
      TYYP.endGame();
    }
  },

  // Checking to see what target (if any) becomes the assigned target
  findTarget: function(code) {
    for (var i = 0; i < TYYP.targets.length; i++) {
      if (TYYP.targets[i].hit_count < TYYP.targets[i].word.length && TYYP.targets[i].getNextLetter() == KEYS.getChar(code)) {
        TYYP.assigned_target = TYYP.targets[i];
        break;    
      }
    } 
  },

  // General update function to update Targets, Bullets, Score balloons
  update: function() {
    var missed_letters,
        balloon;

    for (var i = 0; i < TYYP.targets.length; i++) {
      missed_letters = TYYP.targets[i].word.length - TYYP.targets[i].hit_count;
      TYYP.targets[i].updatePosition();

      // Handle aliens that made it to the bottom
      if (TYYP.targets[i].y > TYYP.c_height + 50) {

        // If the alien is alive (has missed letters)
        if (!TYYP.targets[i].dead && missed_letters > 0) {
          // Track missed aliens
          TYYP.missed_alien_count++;
          // Score penalty
          TYYP.score = TYYP.score - missed_letters;

          // Create a score balloon showing the negative impact
          if (TYYP.targets[i].score_balloon == undefined) {
            balloon = new ScoreBalloon({
              x: TYYP.targets[i].x,
              y: Math.min(TYYP.targets[i].y, TYYP.c_height - 20),
              val: "-" + missed_letters,
              velocity: -.09,
              opacity: 1,
              decay_rate: .01,
              color: {r: 100, g: 0, b: 0}
            });

            TYYP.targets[i].score_balloon = balloon;
            TYYP.score_balloons.push(balloon);  
          }
        }

        // Reset assigned target
        if (TYYP.targets[i] == TYYP.assigned_target) {
          TYYP.assigned_target = undefined;
        }
        // Cleanup targets array
        TYYP.targets.splice(i, 1);
        i--;
      }
    }

    for (var i = 0; i < TYYP.bullets.length; i++) {
      TYYP.bullets[i].updatePosition();

      if (TYYP.bullets[i].y < TYYP.bullets[i].end_y ) {
        TYYP.bullets.splice(i, 1);
        i--;
      }
    }

    for (var j = 0; j < TYYP.score_balloons.length; j++) {
      TYYP.score_balloons[j].updatePosition();

      if (TYYP.score_balloons[j].dead || TYYP.score_balloons[j].y > TYYP.c_height + 50) {
        TYYP.score_balloons.splice(j, 1);
      }
    }

    // Control the creation of new targets (depending on the number on screen, limited by
    // frame count, and limited by total number of targets created for this level)
    if (TYYP.targets.length < 9 && TYYP.frame_count % 150 == 0 && TYYP.target_count < 10) {
      var new_target = new Target({word: TYYP.words[TYYP.rand(0, TYYP.words.length)]});
      new_target.init();
      TYYP.targets.push(new_target);
      TYYP.target_count++;
    }

    TYYP.frame_count++;  
  },

  // Draw function to draw all Bullets, Targets, Score balloons
  draw: function() {
    var percentage;

    TYYP.ctx.clearRect(0, 0, TYYP.c_width, TYYP.c_height);

    for (var i = 0; i < TYYP.targets.length; i++) {
      TYYP.targets[i].draw();
    }

    for (var i = 0; i < TYYP.bullets.length; i++) {
      TYYP.bullets[i].draw();
    }

    for (var j = 0; j < TYYP.score_balloons.length; j++) {
      TYYP.score_balloons[j].draw();
    }

    // TYYP.ctx.font = "20px Arial";
    TYYP.ctx.fillStyle = "#333333";
    TYYP.ctx.fillText("Score: " + TYYP.score, 20, 20);

    if (TYYP.hits == 0 && TYYP.misses == 0) {
      percentage = 100;
    }
    else {
      percentage = ((TYYP.hits / (TYYP.hits + TYYP.misses)) * 100).toFixed(1);
    }
    TYYP.ctx.fillText("Accuracy: " + percentage + "%", 20, 50);
    TYYP.ctx.fillText("Level: " + TYYP.level, 20, 80);
  },

  endGame: function() {
    var word_width;

    TYYP.ctx.fillStyle = "#550000";
    TYYP.ctx.font = "50px Arial";
    word_width = TYYP.ctx.measureText("GAME OVER").width;
    TYYP.ctx.fillText("GAME OVER", 250 - (word_width / 2), TYYP.c_height / 2);
  }
}

$(document).ready(function() {
  TYYP.init();    
});