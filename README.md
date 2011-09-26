Javascript Snakes
=================

An HTML5 Snakes Game

 * [play the game](http://codeincomplete.com/projects/snakes/)
 * read a [blog article](http://codeincomplete.com/posts/2011/9/25/javascript_snakes/)
 * view the [source](https://github.com/jakesgordon/javascript-snakes)

SUPPORTED BROWSERS
==================

 - Chrome 13/14
 - Firefox 5/6
 - IE 9
 - Safari 5
 - Opera 11

KNOWN ISSUES
============

 - No sound FX in Safari because of delay when playing <audio> elements
 - Opera ignores <audio> volume and plays music/sounds very loud (and slightly delayed - uck!)

DEVELOPMENT
===========

>> _for all of the gory details checkout the blog article (coming soon)_

The game is split into multiple source files (.js, .css and .png) that must be
unified (and minified) for the final run-time game:

    snakes.js      # the unified javascript file
    snakes.min.js  # the unified and minified javascript file
    snakes.css     # the unified css stylesheet
    snakes.min.css # the unified and minified css stylesheet
    fruit.png      # multiple fruit image spritesheet
    head.png       # multiple snake head image spritesheet
 
If you have the Ruby language available, Rake tasks can be used to auto generate these
unified files:

    rake assets:create   # re-create unified javascript/css asset files
    rake assets:resprite # re-create css sprite image files

These must be run every time you change one of the source files.

To make development easier, an auto-asset-generating Rack server can be used that
will automatically recreate the unified asset files when they detect a change in the
underlying source files:

    rake assets:server   # run a simple Rack server that autogenerates unified assets files automatically on change

TODO
====

 * gameplay:     specials - speedup, slowdown, shrink, temporary immunity
 * presentation: fixed width font for high score table ?
 * presentation: better styles when current score >= high score, ***new high score*** flash the moment score >= high score
 * presentation: game over message
 * usability:    back button support (hashtag support for credits vs highscores vs game ?)
 * performance:  use invalid rectangles to only update changed segments (will help when length > 100)
 * techdebt:     use event driven pub/sub patterns instead of allowing snake/score/court to call back into game object
 * techdebt:     move score rendering out of score class and into render class
 * techdebt:     abstract credits   list into re-usable Game.Credits class
 * techdebt:     abstract highscore list into re-usable Game.Leaderboard class
 * future:       player vs player
 * future:       player vs AI
 * future:       touch support

License
=======

[MIT](http://en.wikipedia.org/wiki/MIT_License) license.

>> NOTE: the graphics and sounds included in this project are royalty free resources paid
for and licensed from [iStockPhoto](http://istockphoto.com), [Lucky Lion Studios](http://luckylionstudios.com/) and
[Premium Beat](http://www.premiumbeat.com/). They are licensed ONLY for use in this project
and should not be reproduced.

Thanks for your honesty!


