//=============================================================================
// Snakes
//=============================================================================

Snakes = function() {

  DIR = {
    UP:    0,
    DOWN:  1,
    LEFT:  2,
    RIGHT: 3,
    OPPOSITE: [1, 0, 3, 2]
  };

  CORNER = {
    NONE: 0,
    BL:   1,
    BR:   2,
    TL:   3,
    TR:   4
  };

  CORNER.LOOKUP = [
    [CORNER.NONE, CORNER.NONE, CORNER.BL,   CORNER.BR  ],
    [CORNER.NONE, CORNER.NONE, CORNER.TL,   CORNER.TR  ],
    [CORNER.TR,   CORNER.BR,   CORNER.NONE, CORNER.NONE],
    [CORNER.TL,   CORNER.BL,   CORNER.NONE, CORNER.NONE]
  ];

  var cfg = {

    runner: {
      stats: true
    },

    state: {
      initial: 'loading',
      events: [
        { name: 'ready',         from: 'loading',    to: 'menu'        },
        { name: 'viewScores',    from: 'menu',       to: 'highscores'  },
        { name: 'viewCredits',   from: 'menu',       to: 'credits'     },
        { name: 'backToMenu',    from: 'highscores', to: 'menu'        },
        { name: 'backToMenu',    from: 'credits',    to: 'menu'        },
        { name: 'newGame',       from: 'menu',       to: 'game'        },
        { name: 'quitGame',      from: 'game',       to: 'quit'        },
        { name: 'quitGame',      from: 'quit',       to: 'menu'        },
        { name: 'continueGame',  from: 'quit',       to: 'game'        },
        { name: 'loseGame',      from: 'game',       to: 'menu'        },
        { name: 'newHighScore',  from: 'game',       to: 'name'        },
        { name: 'saveHighScore', from: 'name',       to: 'highscores'  },
      ]
    },

    keys: [
      { keys: [Game.Key.Y,     Game.Key.Q],      mode: 'down', state: 'quit',       action: function() { this.quitGame();            } },
      { keys: [Game.Key.N,     Game.Key.ESC],    mode: 'down', state: 'quit',       action: function() { this.continueGame();        } },
      { keys: [Game.Key.ESC,   Game.Key.RETURN], mode: 'down', state: 'highscores', action: function() { this.backToMenu();          } },
      { keys: [Game.Key.ESC,   Game.Key.RETURN], mode: 'down', state: 'credits',    action: function() { this.backToMenu();          } },
      { keys: [Game.Key.ESC,   Game.Key.RETURN], mode: 'down', state: 'name',       action: function() { this.saveHighScore();       } },
      { keys: [Game.Key.LEFT,  Game.Key.A],      mode: 'down', state: 'game',       action: function() { this.snake.move(DIR.LEFT);  } },
      { keys: [Game.Key.RIGHT, Game.Key.D],      mode: 'down', state: 'game',       action: function() { this.snake.move(DIR.RIGHT); } },
      { keys: [Game.Key.UP,    Game.Key.W],      mode: 'down', state: 'game',       action: function() { this.snake.move(DIR.UP);    } },
      { keys: [Game.Key.DOWN,  Game.Key.S],      mode: 'down', state: 'game',       action: function() { this.snake.move(DIR.DOWN);  } },
      { key:  Game.Key.ESC,                      mode: 'down', state: 'game',       action: function() { this.quitGame();            } }
    ],

    difficulties: [
      { label: 'Slow',   dstep: 0.09, dscore: 0.75 },
      { label: 'Normal', dstep: 0.07, dscore: 1.00 },
      { label: 'Fast',   dstep: 0.05, dscore: 1.25 },
      { label: 'Insane', dstep: 0.03, dscore: 1.5  }
    ],

    highscores: [
      { name: "amy",        score:  3000 }, 
      { name: "jake",       score:  2500 },
      { name: "ritchie",    score:  2000 },
      { name: "eddie",      score:  1500 },
      { name: "code",       score:  1000 },
      { name: "incomplete", score:   500 },
      { name: "liquid",     score:   250 },
      { name: "planner",    score:   100 }
    ],

    colors: {
      head: '#000',
      body:  { fill: '#FF2D1C', stroke: 'black' },
      fruit: { fill: 'green',   stroke: 'black' },
      wall:  { fill: '#1F4367', stroke: 'black' },
      particles: ['#F03F37', '#85BD3D', '#EFCA05', '#D41433', '#3D526D', '#DC1135', '#7B5643', '#4E1D4E', '#EB7923', '#EBDA3D', '#EC5675', '#F99120', '#F5AD87', '#DA961E', '#DFBC27', '#ED2920']
    },

    images: [
      { id: 'head',  url: "images/head.png"  }, // (self made)
      { id: 'fruit', url: "images/fruit.png" }  // http://www.istockphoto.com/stock-illustration-12757612-fruit-icon-set.php?st=9f9a85e
    ],

    sounds: [
      { id: 'menu',      name: 'sounds/menu',      formats: ['mp3', 'ogg'], loop: true            }, // 'Beyond the Sky'        - http://luckylionstudios.com/royalty-free-video-game-music-library/#ecwid:mode=product&product=5937383
      { id: 'game',      name: 'sounds/game',      formats: ['mp3', 'ogg'], loop: true            }, // 'Pulse'                 - http://luckylionstudios.com/royalty-free-video-game-music-library/#ecwid:mode=product&product=5478792
      { id: 'eat',       name: 'sounds/eat',       formats: ['mp3', 'ogg'], pool: 3               }, // 'Game Progress Made 11' - http://www.premiumbeat.com/sfx/detail/game-progress-made-11-2
      { id: 'die',       name: 'sounds/die',       formats: ['mp3', 'ogg']                        }, // 'World Barrel Break a'  - http://www.premiumbeat.com/sfx/detail/world-barrel-break-a
      { id: 'turn',      name: 'sounds/turn',      formats: ['mp3', 'ogg'], pool: 5, volume: 0.02 }, // 'Buttons Push Small'    - http://www.premiumbeat.com/sfx/detail/buttons-push-small
      { id: 'click',     name: 'sounds/turn',      formats: ['mp3', 'ogg'], pool: 5, volume: 0.05 }, // 'Buttons Push Small'    - http://www.premiumbeat.com/sfx/detail/buttons-push-small 
      { id: 'highscore', name: 'sounds/highscore', formats: ['mp3', 'ogg']                        }, // 'Success cue 03'        - http://www.premiumbeat.com/sfx/detail/success-cue-03
    ],

    sparkles: {
      duration: 1200,
      spread:   8,
      max:      200,
      each:     80
    },

    fruit: { score: 10, growth: 5, images: 16, size: 64 },
    snake: { x: 45, y: 26, length: 10, dir: DIR.LEFT }, 
    court: { w: 48, h: 36, layout: [
      "wwwwww                                    wwwwww", 
      "w                                              w",  
      "w                                              w",  
      "w                                              w",  
      "w                                              w",  
      "w                                              w",  
      "                                                ",  
      "                                                ",  
      "                                                ",  
      "                                                ",  
      "                                                ",  
      "                                                ",  
      "                                                ",  
      "                                                ",  
      "                                                ",  
      "                                                ",  
      "                                                ",  
      "                                                ",  
      "                                                ",  
      "                                                ",  
      "                                                ",  
      "                                                ",  
      "                                                ",  
      "                                                ",  
      "                                                ",  
      "                                                ",  
      "                                                ",  
      "                                                ",  
      "                                                ",  
      "                                                ",  
      "w                                              w",  
      "w                                              w",  
      "w                                              w",  
      "w                                              w",  
      "w                                              w",  
      "wwwwww                                    wwwwww", 
    ]}

  };

  //=============================================================================

  var game = Class.create({

    initialize: function() {

      this.runner  = new Game.Runner('canvas', this, cfg.runner);
      this.storage = Game.storage();

      this.dom = {
        main:    $('snakes'),
        overlay: $('overlay'),
        loading: $('loading'),
        credits: $('credits'),
        sound:   $('sound')
      };

      this.render   = new render(this);
      this.score    = new score(this);
      this.court    = new court(this);
      this.snake    = new snake(this);
      this.fruit    = new fruit(this);
      this.sparkles = new sparkles(this);

      this.resetDifficulty();
      this.resetGame();

      this.menu     = this.buildMenu();
      this.quitmenu = this.buildQuitMenu();

      Game.Key.map(cfg.keys, this);
      StateMachine.create(cfg.state, this);

      Game.loadResources(cfg.images, cfg.sounds, function(resources) {
        this.images = resources.images;
        this.sounds = resources.sounds;
        this.initSound();
        this.ready();
      }.bind(this));
    },

    onenterloading:    function(event, from, to) { this.dom.loading.show();    },
    onleaveloading:    function(event, from, to) { this.dom.loading.fadeout(); },
    onenterhighscores: function(event, from, to) { if (from !== 'name') this.score.dom.highscores.page.fadein(); },
    onleavehighscores: function(event, from, to) { this.score.dom.highscores.page.fadeout(); },
    onentername:       function(event, from, to) { this.score.newHighScore();  },
    onleavename:       function(event, from, to) { this.score.save();          },
    onentercredits:    function(event, from, to) { this.dom.credits.fadein();  },
    onleavecredits:    function(event, from, to) { this.dom.credits.fadeout(); },
    onenterquit:       function(event, from, to) { this.quitmenu.fadein();     },
    onleavequit:       function(event, from, to) { this.quitmenu.fadeout();    },
    onentermenu:       function(event, from, to) { this.menu.fadein();         },
    onleavemenu:       function(event, from, to) { this.menu.fadeout();        },
    onentergame:       function(event, from, to) { this.dom.overlay.fadeout(); this.playGameMusic(); },
    onleavegame:       function(event, from, to) { this.dom.overlay.fadein();  this.playMenuMusic(); },

    onready: function() {
      this.runner.start();
    },

    onnewGame: function() {
      this.resetGame();
    },

    onbackToMenu: function() {
      this.playClickFx();
    },

    onchangestate:  function(event, from, to) {
      this.dom.main.removeClassName("state_is_" + from);
      this.dom.main.addClassName("state_is_" + to);
    },

    resetDifficulty: function(n) {
      this.storage.difficulty = Game.Math.minmax(is.valid(n) ? n : toInt(this.storage.difficulty, 1), 0, cfg.difficulties.length-1);
      this.difficulty = cfg.difficulties[this.storage.difficulty];
    },

    resetGame: function() {
      this.w     = cfg.court.w;
      this.h     = cfg.court.h;
      this.dw    = this.runner.width  / this.w;
      this.dh    = this.runner.height / this.h;
      this.maxX  = this.w - 1;
      this.maxY  = this.h - 1;
      this.court.reset(cfg.court);
      this.snake.reset(cfg.snake);
      this.fruit.reset(this.unoccupied(this.fruit.pos), this.fruit.image); // leave fruit in same place/style if possible
      this.score.reset();
    },

    initSound: function() {
      this.toggleMute(this.isMute());
      this.dom.sound.on('click', function() { this.toggleMute(); }.bind(this));
      this.dom.sound.show();
    },

    update: function(dt) {
      if (this.is('game')) {
        this.court.update(dt);
        this.snake.update(dt);
        this.fruit.update(dt);
        this.score.update(dt);
        if ((this.snake.occupies(this.snake.head, true)) ||
            (this.court.occupies(this.snake.head))) {
          this.playDieFx();
          this.sparkles.add(this.snake.head, { color: cfg.colors.head });
          if (this.score.isworthy()) {
            this.playHighScoreFx();
            this.newHighScore();
          }
          else {
            this.loseGame();
          }
        }
        else if (this.fruit.occupies(this.snake.head)) {
          this.playEatFx();
          this.sparkles.add(this.fruit.pos, { image: this.fruit.image });
          this.score.increase(Game.Math.random(1,9)); // to avoid large round numbers in the score (they look odd)
          this.score.increase(this.fruit.score * this.snake.length * this.difficulty.dscore); // you get more points the longer you are (so the longer you survive the more points you get)
          this.snake.grow(this.fruit.growth);
          this.fruit.reset(this.unoccupied());
        }
      }
    },

    draw: function(ctx) {
      if (!this.is('loading'))
        this.render.draw(ctx); // defer to helper class
    },

    onclick: function(ev) {
      if (this.can('backToMenu'))
        if (!is.link(ev.target))
          this.backToMenu();
    },

    onfocus: function(ev) {
      if (this.is('menu'))
        this.menu.focus();
      else if (this.is('quit'))
        this.quitmenu.focus();
    },

    onresize: function() {
      this.dw = this.runner.width / this.w;
      this.dh = this.runner.height / this.h;
      this.render.onresize();
    },

    unoccupied: function(pos) {
      var max = 100, p = pos || new Game.Point(), p1 = new Game.Point(), p2 = new Game.Point(), p3 = new Game.Point(), p4 = new Game.Point();
      while(--max) {
        if (!p.blank()) { // a fruit occupies 3x3 cells, check center and corners
          p1.x = p.x-1; p1.y = p.y-1;
          p2.x = p.x+1; p2.y = p.y-1;
          p3.x = p.x-1; p3.y = p.y+1;
          p4.x = p.x+1; p4.y = p.y+1;
          if (!this.court.occupies(p)   && !this.snake.occupies(p)   &&
              !this.court.occupies(p1)  && !this.snake.occupies(p1)  &&
              !this.court.occupies(p2)  && !this.snake.occupies(p2)  &&
              !this.court.occupies(p3)  && !this.snake.occupies(p3)  &&
              !this.court.occupies(p4)  && !this.snake.occupies(p4)) {
            // console.log('took ' + (100-max) + ' attempts to find unoccupied space');
            return p;
          }
        }
        p.x = Math.round(Game.Math.random(2, this.maxX - 2));
        p.y = Math.round(Game.Math.random(2, this.maxY - 2));
      }
      return pos; // could not find unoccupied space within 100 attempts just bail out and hope for the best!
    },

    step: function(pos, dir) {
      switch(dir) {
        case DIR.LEFT:  return new Game.Point(pos.x == 0         ? this.maxX : pos.x-1, pos.y                                   );
        case DIR.RIGHT: return new Game.Point(pos.x == this.maxX ? 0         : pos.x+1, pos.y                                   );
        case DIR.UP:    return new Game.Point(pos.x,                                    pos.y == 0         ? this.maxY : pos.y-1);
        case DIR.DOWN:  return new Game.Point(pos.x,                                    pos.y == this.maxY ? 0         : pos.y+1);
      }
    },

    toggleMute: function(on) {
      var mute = toBool(on, this.isNotMute());
      this.storage.mute = mute;
      this.dom.sound.setClassName(mute ? 'off' : 'on');
      if (mute) {
        this.sounds.game.stop();
        this.sounds.menu.stop();
      }
      else {
        if (this.is('game'))
          this.playGameMusic();
        else
          this.playMenuMusic();
      }
    },

    allowMusic:      function()   { return true;                      },
    allowFx:         function()   { return !userAgent.isSafari;       }, // safari sucks at playing short sound FX (delays)
    isMute:          function()   { return toBool(this.storage.mute); },
    isNotMute:       function()   { return !this.isMute();            },
    playMenuMusic:   function()   { if (this.allowMusic() && this.isNotMute()) { this.sounds.game.stop(); this.sounds.menu.play(); } },
    playGameMusic:   function()   { if (this.allowMusic() && this.isNotMute()) { this.sounds.menu.stop(); this.sounds.game.play(); } },
    playDieFx:       function()   { if (this.allowFx()    && this.isNotMute()) { this.sounds.die.play();       } },
    playEatFx:       function()   { if (this.allowFx()    && this.isNotMute()) { this.sounds.eat.play();       } },
    playTurnFx:      function()   { if (this.allowFx()    && this.isNotMute()) { this.sounds.turn.play();      } },
    playClickFx:     function()   { if (this.allowFx()    && this.isNotMute()) { this.sounds.click.play();     } },
    playHighScoreFx: function()   { if (this.allowFx()    && this.isNotMute()) { this.sounds.highscore.play(); } },

    buildMenu: function() {
      var n, difficulties = [];
      for(n = 0 ; n < cfg.difficulties.length ; n++)
        difficulties.push(cfg.difficulties[n].label);

      return new Game.Menu(this.dom.overlay, this, {
        id: 'menu',
        visible: false,
        onselect: function() { this.playClickFx(); },
        onclick:  function() { this.playClickFx(); },
        items: [
          { text: 'New Game',    title: "Start a new game of snakes...",    action: function()  { this.newGame();          }                                                        },
          {                      title: "Change Difficulty level",          action: function(d) { this.resetDifficulty(d); }, choice: difficulties, chosen: this.storage.difficulty },
          { text: 'High Scores', title: "View the high score table",        action: function()  { this.viewScores();       }                                                        },
          { text: 'Credits',     title: "Thanks to the games contributors", action: function()  { this.viewCredits();      }                                                        },
        ]
      });
    }, 

    buildQuitMenu: function() {
      return new Game.Menu(this.dom.overlay, this, {
        id: 'quitmenu',
        visible: false,
        onselect: function() { this.playClickFx(); },
        items: [
        { text: 'Abandon',  title: "Abandon the current game (Y/N) ?", action: function() { this.quitGame();     } },
        { text: 'Continue', title: "Continue the current game ?",      action: function() { this.continueGame(); } }
      ]});
    }

  });

  //=============================================================================

  var score = Class.create({

    initialize: function(game) {
      this.game = game;
      this.dom = {
        highscores: {
          page:  $('highscores'),
          title: $('highscores').down('h1'),
          list:  $('highscores').down('ul'),
          input: $({tag: 'input', maxlength: 10})
        },
        score: {
          current: $('score').down('.current .value'),
          high:    $('score').down('.high .value')
        }
      };
      this.load();
      this.reset();
    },

    reset:     function()  { this.set(0); },
    set:       function(n) { this.vset(this.score = Math.floor(n)); },
    vset:      function(n) { this.vscore = Math.floor(n); this.redraw = true; },
    increase:  function(n) { this.score = this.score + Math.floor(n); },
    format:    function(n) { return ("0000000" + Math.floor(n)).slice(-6); },
    ishigh:    function()  { return (this.vscore > this.highscore); },
    isworthy:  function()  { this.vset(this.score); return (this.score > this.lowscore); },

    update: function(dt) {
      if (this.vscore < this.score) {
        var wasHigh = this.ishigh();
        this.vset(Math.min(this.score, this.vscore + 1 + (this.score - this.vscore)/10)); // increment in 10ths of the remaining difference (MIN 1)
        if (!wasHigh && this.ishigh())
          this.game.playHighScoreFx();
      }
    },

    draw: function() {
      if (this.redraw) {
        this.drawScore(this.vscore);
        if (this.ishigh())
          this.drawHighScore(this.vscore);
        this.game.dom.main.toggleClassName('highscore', this.ishigh());
        this.redraw = false;
      }
    },

    drawScore:     function(n) { this.dom.score.current.update(this.format(n)); },
    drawHighScore: function(n) { this.dom.score.high.update(this.format(n));    },

    buildHighScoreTable: function(data, editEntry) {
      data = data || this.highscores;
      var list = this.dom.highscores.list;
      list.removeChildren();
      var n, entry, current, editing, klass, name, score, item;
      for(n = 0 ; n < data.length ; n++) {
        entry   = data[n];
        current = (entry.name.toUpperCase() === this.name.toUpperCase()); // case insensitive comparison
        editing = (entry === editEntry);
        klass   = editing ? "editing" : (current ? "current" : "");
        name    = $({tag: 'span', klass: 'name',  text: editing ? null : entry.name, dom: editing ? this.dom.highscores.input : null });
        score   = $({tag: 'span', klass: 'score', text: entry.score});
        item    = $({tag: 'li',   klass: klass,   dom: [score, name]});
        list.append(item);
      }
      if (is.valid(this.game.storage.highscores) && !editEntry) {
        list.append({tag: 'li', dom: $({tag: 'span', html: 'reset', klass: 'reset', on: { click: this.onreset.bind(this) } })});
      }
    },

    newHighScore: function() {
      var entry = {name: this.name, score: this.score};
      this.buildHighScoreTable(this.insert(entry), entry);
      this.dom.highscores.page.show();
      this.dom.highscores.input.focus();
      this.dom.highscores.input.value = entry.name; // add value AFTER focus to avoid selecting all the text
    },

    onreset: function(ev) {
      delete this.game.storage.highscores;
      this.reset();
      this.load();
      Game.Event.stop(ev);
    },

    load: function() {
      this.name       = this.game.storage.highscorename || "";
      this.highscores = JSON.parse(this.game.storage.highscores || "null") || cfg.highscores;
      this.highscore  = this.highscores[0].score;
      this.lowscore   = this.highscores[this.highscores.length-1].score;
      this.buildHighScoreTable();
      this.drawHighScore(this.highscore);
    },

    save: function() {
      this.name       = this.dom.highscores.input.value;
      this.highscores = this.insert({name: this.name, score: this.score});
      this.highscore  = this.highscores[0].score;
      this.lowscore   = this.highscores[this.highscores.length-1].score;
      this.game.storage.highscores = JSON.stringify(this.highscores);
      this.game.storage.highscorename = this.name;
      this.buildHighScoreTable();
    },

    insert: function(item) {
      var n, index = null;
      for(n = 0 ; n < this.highscores.length ; n++) {
        if (item.score > this.highscores[n].score) {
          index = n;
          var start  = this.highscores.slice(0, index)
          var middle = [item];
          var end    = this.highscores.slice(index, this.highscores.length-1);
          return start.concat(middle).concat(end);
        }
      }
      return this.highscores;
    }

  });

  //=============================================================================

  var court = Class.create({ 

    initialize: function(game) {
      this.game = game;
    },

    reset: function(map) {
      this.walls = [];
      var x,y,row;
      for(y = 0 ; y < map.layout.length ; y++) {
        row = map.layout[y];
        for(x = 0 ; x < row.length ; x++) {
          if (row[x] == "w")
            this.walls.push(new Game.Point(x,y));
        }
      }
      var n, wall;
      for(n = 0 ; n < this.walls.length ; ++n) {
        wall = this.walls[n];
        wall.north = !this.occupies(new Game.Point(wall.x, wall.y-1));
        wall.south = !this.occupies(new Game.Point(wall.x, wall.y+1));
        wall.east  = !this.occupies(new Game.Point(wall.x+1, wall.y));
        wall.west  = !this.occupies(new Game.Point(wall.x-1, wall.y));
      }
    },

    update: function(dt) {
    },

    occupies: function(pos) {
      var wall, n, max = this.walls.length;
      for(n = 0 ; n < max ; n++) {
        wall = this.walls[n];
        if (wall.equals(pos))
          return true;
      }
      return false;
    }

  });

  //=============================================================================

  var fruit = Class.create({

    initialize: function(game) {
      this.game    = game;
      this.score   = cfg.fruit.score;
      this.growth  = cfg.fruit.growth;
    },

    reset: function(pos, image) {
      this.pos   = pos || this.pos;
      this.image = is.valid(image) ? image : toInt(this.image, -1) + 1;
      this.image = (this.image >= cfg.fruit.images) ? 0 : this.image;
      this.occupied = [ // a fruit occupies 3x3 cells
        new Game.Point(this.pos.x - 1, this.pos.y - 1),
        new Game.Point(this.pos.x,     this.pos.y - 1),
        new Game.Point(this.pos.x + 1, this.pos.y - 1),
        new Game.Point(this.pos.x - 1, this.pos.y),
        this.pos,
        new Game.Point(this.pos.x + 1, this.pos.y),
        new Game.Point(this.pos.x - 1, this.pos.y + 1),
        new Game.Point(this.pos.x,     this.pos.y + 1),
        new Game.Point(this.pos.x + 1, this.pos.y + 1)
      ];
    },

    occupies: function(pos) {
      for(var n = 0 ; n < this.occupied.length ; n++) {
        if (this.occupied[n].equals(pos))
          return true;
      }
      return false;
    },

    update: function(dt) {
    }

  });

  //=============================================================================

  var sparkles = Class.create({

    initialize: function(game) {
      this.game      = game;
      this.all       = [];
      this.particles = [];
      for(var n = 0 ; n < cfg.sparkles.max ; n++) {
        this.particles.push({
          dx: Game.Math.random(-cfg.sparkles.spread, cfg.sparkles.spread),
          dy: Game.Math.random(-cfg.sparkles.spread, cfg.sparkles.spread),
          size: Game.Math.random(0, 1)
        });
      }
    },

    add: function(pos, options) {
      options = options || [];
      var spark = { pos: pos, image: options.image, color: options.color || (cfg.colors.particles[options.image]), opacity: 1.0, particles: this.getParticles(cfg.sparkles.each) };
      this.all.push(spark);
      spark.animator = new Animator({
        duration:   cfg.sparkles.duration,
        transition: Animator.tx.easeOut,
        onComplete: function() { this.remove(spark); }.bind(this)
      });
      spark.animator.addSubject(function(value) { this.explode(spark, value); }.bind(this));
      spark.animator.play();
    },

    getParticles: function(max) {
      var particles = this.particles.splice(0, max);
      var n, max, p;
      for(n = 0, max = particles.length ; n < max ; ++n) {
        p = particles[n];
        p.x = p.y = 0;
      }
      return particles;
    },

    remove: function(spark) {
      delete spark.animator;
      this.particles = this.particles.concat(spark.particles); // put them back in the pool
      var index = this.all.indexOf(spark);
      if (index >= 0)
        this.all.splice(index, 1);
    },

    explode: function(spark, value) {
      spark.opacity = 1.0 - value;
      if (spark.particles) {
        var n, particle;
        for(n = 0 ; n < spark.particles.length ; n++) {
          particle = spark.particles[n];
          particle.x = particle.dx * value;
          particle.y = particle.dy * value;
        }
      }
    }

  });

  //=============================================================================

  var snake = Class.create({

    initialize: function(game) {
      this.game = game;
    },

    reset: function(options) {
      this.head   = this.tail = new Game.Point(options.x, options.y);
      this.dir    = options.dir;
      this.dt     = 0;
      this.dstep  = this.game.difficulty.dstep;
      this.moves  = [];
      this.length = 1;
      this.growth = options.length || 10;
      while(--this.growth)
        this.increase();
    },

    update: function(dt) {
      this.dt = this.dt + dt;
      if (this.dt > this.dstep) {
        this.dt = this.dt - this.dstep;
        this.increase(this.moves.shift());
        this.decrease();
      }
    },

    increase: function(changeDir) {
      if (typeof changeDir != 'undefined') {
        this.head.corner = CORNER.LOOKUP[this.dir][changeDir];
        this.dir = changeDir;
        this.game.playTurnFx();
      }
      this.push(this.game.step(this.head, this.dir));
    },

    decrease: function() {
      if (this.growth)
        this.growth--;
      else
        this.pop();
    },

    push: function(segment) {
      segment.next = this.head;
      this.head.prev = segment;
      this.head = segment;
      this.length++;
    },

    pop: function() {
      this.tail = this.tail.prev;
      this.tail.next = null;
      this.length--;
    },

    grow: function(n) {
      this.growth += n;
    },

    move:  function(dir) {
      var previous = this.moves.length ? this.moves[this.moves.length-1] : this.dir;
      if ((dir != previous) && (dir != DIR.OPPOSITE[previous]))
        this.moves.push(dir);
    },

    occupies: function(pos, ignoreHead) {
      var segment = ignoreHead ? this.head.next : this.head;
      do {
        if (segment.equals(pos))
          return true;
      } while (segment = segment.next);
      return false;
    }

  });

  //=============================================================================

  var render = Class.create({

    initialize: function(game) {
      this.game = game;
    },

    draw: function(ctx) {
      if (!this.parts)
        this.renderParts();

      ctx.clearRect(0, 0, this.game.runner.width, this.game.runner.height);

      var n, max, p, spark, particle, segment;

      // sparkles (fading fruit)
      for(n = 0, max = this.game.sparkles.all.length ; n < max ; ++n) {
        spark = this.game.sparkles.all[n];
        if (is.valid(spark.image)) {
          ctx.globalAlpha = spark.opacity;
          ctx.drawImage(this.game.images.fruit,
                        spark.image * cfg.fruit.size, 0, cfg.fruit.size, cfg.fruit.size,
                        (spark.pos.x-1) * this.game.dw,
                        (spark.pos.y-1) * this.game.dh,
                        this.game.dw * 3,
                        this.game.dh * 3);
        }
      } 

      // render faded when its the background behind a menu
      ctx.globalAlpha = this.game.is('game') ? 1.0 : 0.2;

      // fruit
      ctx.drawImage(this.game.images.fruit,
                    this.game.fruit.image * cfg.fruit.size, 0, cfg.fruit.size, cfg.fruit.size,
                    (this.game.fruit.pos.x-1) * this.game.dw,
                    (this.game.fruit.pos.y-1) * this.game.dh,
                    this.game.dw * 3,
                    this.game.dh * 3);

      // walls
      for(n = 0, max = this.game.court.walls.length ; n < max ; n++)
        this.drawPart(ctx, this.game.court.walls[n], n, 5);

      // head
      ctx.drawImage(this.game.images.head, this.game.snake.dir * 40, 0, 40, 40, this.game.snake.head.x * this.game.dw - (this.game.dw/4), this.game.snake.head.y * this.game.dh - (this.game.dh/4), this.game.dw + (this.game.dw/2), this.game.dh + (this.game.dh/2));

      // body
      segment = this.game.snake.head, n = 1;
      while(segment = segment.next)
        this.drawPart(ctx, segment, 1 + Math.floor(this.nparts * (n++/this.game.snake.length)), toInt(segment.corner));

      // sparkles (particles)
      for(n = 0, max = this.game.sparkles.all.length ; n < max ; n++) {
        spark = this.game.sparkles.all[n];
        ctx.fillStyle = spark.color;
        ctx.globalAlpha = spark.opacity;
        for(p = 0 ; p < spark.particles.length ; p++) {
          particle = spark.particles[p];
          ctx.fillRect((spark.pos.x+particle.x+0.5) * this.game.dw, (spark.pos.y+particle.y+0.5) * this.game.dh, particle.size*(this.game.dw/2), particle.size*(this.game.dh/2));
        }
      } 

      // score draws itself into DOM elements
      this.game.score.draw();
    },

    drawPart: function(ctx, pos, px, py) {
      ctx.drawImage(this.parts, px * this.game.dw, py * this.game.dh, this.game.dw, this.game.dh, pos.x * this.game.dw, pos.y * this.game.dh, this.game.dw, this.game.dh);
    },

    //-----------

    renderParts: function() {
      this.nparts = 100;
      this.parts  = Game.renderToCanvas((1 + this.nparts) * this.game.dw, 6 * this.game.dh, function(ctx) {
        var n, percent;
        for(var n = 0 ; n < this.nparts ; n++) {
          percent = n/this.nparts;
          this.renderSegment(ctx, { x: 1+n, y: 0 }, CORNER.NONE, percent);
          this.renderSegment(ctx, { x: 1+n, y: 1 }, CORNER.BL,   percent);
          this.renderSegment(ctx, { x: 1+n, y: 2 }, CORNER.BR,   percent);
          this.renderSegment(ctx, { x: 1+n, y: 3 }, CORNER.TL,   percent);
          this.renderSegment(ctx, { x: 1+n, y: 4 }, CORNER.TR,   percent);
        }
        if (this.game.court.walls.length > this.nparts)
          throw "not enough room to render all the wall parts - I need to optimize away repeating parts"
        for(var n = 0 ; n < this.game.court.walls.length ; n++)
          this.renderWall(ctx, { x: n, y: 5 }, this.game.court.walls[n]);
      }.bind(this));
    },

    renderWall: function(ctx, pos, wall) {
      var x1 = pos.x * this.game.dw;
      var y1 = pos.y * this.game.dh;
      var x2 = x1 + this.game.dw;
      var y2 = y1 + this.game.dh;
      ctx.fillStyle   = cfg.colors.wall.fill;
      ctx.fillRect(x1, y1, this.game.dw, this.game.dh);

      x1 = x1 + 0.5;
      y1 = y1 + 0.5;
      x2 = x2 - 0.5;
      y2 = y2 - 0.5;

      ctx.strokeStyle = cfg.colors.wall.stroke;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      wall.north ? ctx.lineTo(x2, y1) : ctx.moveTo(x2, y1);
      wall.east  ? ctx.lineTo(x2, y2) : ctx.moveTo(x2, y2);
      wall.south ? ctx.lineTo(x1, y2) : ctx.moveTo(x1, y2);
      wall.west  ? ctx.lineTo(x1, y1) : ctx.moveTo(x1, y1);
      ctx.stroke();
      ctx.closePath();
    },

    renderSegment: function(ctx, pos, corner, percentage) {
      var shrinkw = this.game.dw * (percentage/4.0) / 2.0;
      var shrinkh = this.game.dh * (percentage/4.0) / 2.0;
      var x1 = pos.x * this.game.dw + shrinkw;
      var y1 = pos.y * this.game.dh + shrinkh;
      var w  = this.game.dw - (2*shrinkw);
      var h  = this.game.dh - (2*shrinkh);
      var x2 = x1 + w;
      var y2 = y1 + h;
      ctx.strokeStyle = cfg.colors.body.stroke;
      ctx.fillStyle = Game.Math.brighten(cfg.colors.body.fill, 50 * percentage);
      x1++;
      x2--;
      y1++;
      y2--;
      w -= 2;
      h -= 2;
      switch(corner) {
        case CORNER.TL:
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x1, y2);
          ctx.lineTo(x2, y1);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          break;
        case CORNER.TR:
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y1);
          ctx.lineTo(x2, y2);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          break;
        case CORNER.BL:
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.lineTo(x1, y2);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          break;
        case CORNER.BR:
          ctx.beginPath();
          ctx.moveTo(x1, y2);
          ctx.lineTo(x2, y1);
          ctx.lineTo(x2, y2);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          break;
        default: 
          ctx.fillRect(x1, y1, w, h);
          ctx.strokeRect(x1, y1, w, h);
          break;
      }
    },

    onresize: function() {
      delete this.parts; // will be redrawn on next draw() cycle
    }

  });

  //=============================================================================

  return new game();

  //=============================================================================

};



