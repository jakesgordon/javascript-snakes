Javascript Snakes
=================

An HTML5 Snakes Game

 * play the game (coming soon)
 * read a blog article (coming soon)
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
 - Opera ignores <audio> volume and plays music/sounds very loud

TODO
====
 * gameplay:     specials - speedup, slowdown, shrink, temporary immunity
 * presentation: fixed width font for high score table ?
 * presentation: better styles when current score >= high score, ***new high score*** flash the moment score >= high score
 * presentation: game over message
 * usability:    back button support (hashtag support for credits vs highscores vs game ?)
 * performance:  use invalid rectangles to only update changed segments (will help when length > 100)

FUTURE
======
 * player vs player
 * player vs AI
 * touch support

TECHDEBT
========
 * use event driven pub/sub patterns instead of allowing snake/score/court to call back into game object
 * move score rendering out of score class and into render class
 * abstract credits   list into re-usable Game.Credits class
 * abstract highscore list into re-usable Game.Leaderboard class

License
=======

[MIT](http://en.wikipedia.org/wiki/MIT_License) license.

>> NOTE: the graphics and sounds included in this project are royalty free resources paid
for and licensed from [iStockPhoto](http://istockphoto.com), [Lucky Lion Studios](http://luckylionstudios.com/) and
[Premium Beat](http://www.premiumbeat.com/). They are licensed ONLY for use in this project
and should not be reproduced.

Thanks for your honesty!


