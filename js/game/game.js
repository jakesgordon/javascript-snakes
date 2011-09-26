Game = {

  ready: function() {
    var ready = [];
    document.addEventListener('DOMContentLoaded', function() {
      for(var n = 0 ; n < ready.length ; n++)
        ready[n]();
      ready = true;
    }, false);
    return function(fn) { (ready === true) ? fn() : ready.push(fn); };
  }(),

  //===========================================================================
  // GAME RUNNER
  //===========================================================================

  Runner: Class.create({

    initialize: function(id, game, cfg) {
      this.game          = game;
      this.cfg           = cfg || {};
      this.canvas        = $(id);
      this.bounds        = this.canvas.getBoundingClientRect();
      this.width         = this.cfg.width  || this.canvas.offsetWidth;
      this.height        = this.cfg.height || this.canvas.offsetHeight;
      this.canvas        = this.canvas;
      this.canvas.width  = this.width;
      this.canvas.height = this.height;
      this.ctx           = this.canvas.getContext('2d');
      this.addEvents();
      this.resetStats();
      if (toBool(cfg.start))
        this.start();
    },

    start: function() {
      var timestamp = function() { return new Date().getTime(); };
      var dt, start, middle, end, last = timestamp(), stopping = false, self = this;
      var frame = function() {
        start  = timestamp(); self.update(Math.min(0.1, (start - last)/1000.0)); // send dt as seconds, MAX of 0.1s (to avoid huge delta's when requestAnimationFrame put us in the background)
        middle = timestamp(); self.draw();
        end    = timestamp();
        last   = start;
        self.updateStats(middle - start, end - middle);
        if (!stopping)
          requestAnimationFrame(frame);
      }
      this.stop = function() { stopping = true; }
      frame();
    },

    update: function(dt) {
      dt = Math.min(dt, 500); // when tab is invisible, requestAnimationFrame doesn't fire, and we need to ensure we dont pass on huge dt values (> 500ms)
      this.game.update(dt);
    },

    draw: function() {
      this.ctx.save();
      this.game.draw(this.ctx);
      this.ctx.restore();
      this.drawStats(this.ctx);
    },

    resetStats: function() {
      if (this.cfg.stats) {
        this.stats = new Stats();
        this.stats.extra = {
          update: 0,
          draw:   0,
        };
        this.stats.domElement.id = 'stats';
        this.canvas.parentNode.appendChild(this.stats.domElement);
      }
    },

    updateStats: function(update, draw) {
      if (this.cfg.stats) {
        this.stats.update();
        this.stats.extra.update = Math.max(1, update);
        this.stats.extra.draw   = Math.max(1, draw);
      }
    },

    drawStats: function(ctx) {
      // if (this.cfg.stats) {
      //   ctx.fillText("update: " + Math.round(this.stats.extra.update) + "ms", this.width - 100, this.height - 40);
      //   ctx.fillText("draw: "   + Math.round(this.stats.extra.draw)   + "ms", this.width - 100, this.height - 30);
      // }
    },

    addEvents: function() {
      $(window).on('resize', this.onresize.bind(this));
      var game = this.game;
      if (game.onfocus) {
        document.body.tabIndex = toInt(document.body.tabIndex, 0); // body needs tabIndex to recieve focus
        $(document.body).on('focus', function(ev) { game.onfocus(ev); });
      }
      if (game.onclick) {
        $(document).on('click', function(ev) { game.onclick(ev); });
      }
    },

    onresize: function() {
      if (this.onresizeTimer)
        clearTimeout(this.onresizeTimer);
      this.onresizeTimer = setTimeout(this.onresizeend.bind(this), 50); // dont fire resize event until 50ms after user has stopped resizing (avoid flickering)
    },

    onresizeend: function() {
      this.resize();
    },

    resize: function() {
      if ((this.width != this.canvas.offsetWidth) || (this.height != this.canvas.offsetHeight)) {
        // console.log("CANVAS RESIZED " + this.canvas.offsetWidth + ", " + this.canvas.offsetHeight);
        this.width  = this.canvas.width  = this.canvas.offsetWidth;
        this.height = this.canvas.height = this.canvas.offsetHeight;
        if (this.game && this.game.onresize)
          this.game.onresize(this.width, this.height);
      }
    }

  }),

  //===========================================================================
  // UTILS
  //===========================================================================

  storage: function() {
    try {
      return this.localStorage = this.localStorage || window.localStorage || {};
    }
    catch(e) { // IE localStorage throws exceptions when using non-standard port (e.g. during development)
      return this.localStorage = {};
    }
  },

  renderToCanvas: function(width, height, render, canvas) { // http://kaioa.com/node/103
    canvas = canvas || document.createElement('canvas');
    canvas.width  = width;
    canvas.height = height;
    render(canvas.getContext('2d'));
    return canvas;
  },

  createImage: function(url, options) {
    options = options || {};
    var image = $({tag: 'img'});
    if (options.onload)
      image.on('load', options.onload);
    image.src = url;
    return image;
  },

  loadResources: function(images, sounds, callback) { /* load multiple images and sounds and callback when ALL have finished loading */
    images    = images || [];
    sounds    = sounds || [];
    var count = images.length + sounds.length;
    var resources = { images: {}, sounds: {} };
    if (count == 0) {
      callback(resources);
    }
    else {

      var done = false;
      var loaded = function() {
        if (!done) {
          done = true; // ensure only called once, either by onload, or by setTimeout
          callback(resources);
        }
      }

      var onload = function() {
        if (--count == 0)
          loaded();
      };

      for(var n = 0 ; n < images.length ; n++) {
        var image = images[n];
        image = is.string(image) ? { id: image, url: image } : image;
        resources.images[image.id] = Game.createImage(image.url, { onload: onload });
      }

      for(var n = 0 ; n < sounds.length ; n++) {
        var sound  = sounds[n];
        sound = is.string(sound) ? { id: sound, name: sound } : sound;
        resources.sounds[sound.id] = AudioFX(sound.name, sound, onload);
      }

      setTimeout(loaded, 4000); // need a timeout because HTML5 audio canplay event is VERY VERY FLAKEY (especially on slow connections)

    }
  }

};

