Game.Vector = Game.Point = Class.create({

  initialize: function(x, y) {
    this.x = x;
    this.y = y;
  },

  equals: function(other) { return ((this.x == other.x) && (this.y == other.y)); },
  blank:  function()      { return (is.invalid(this.x) || is.invalid(this.y));   }

});

