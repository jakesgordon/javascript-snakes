require 'bundler/setup'
require 'unified_assets/tasks'

UnifiedAssets::Tasks.new do |t|
  t.minify = true
  t.assets = {
    "snakes.js"  => [
      'js/game/vendor/stats.js',            # https://github.com/mrdoob/stats.js
      'js/game/vendor/sizzle.js',           # http://sizzlejs.com/
      'js/game/vendor/animator.js',         # http://berniesumption.com/software/animator/
      'js/game/vendor/audio-fx.js',         #    (not public yet)
      'js/game/vendor/state-machine.js',    # https://github.com/jakesgordon/javascript-state-machine
      'js/game/base.js',
      'js/game/game.js',
      'js/game/dom.js',
      'js/game/menu.js',
      'js/game/key.js',
      'js/game/math.js',
      'js/game/vector.js',
      'js/snakes.js'
    ],
    "snakes.css" => [
      'css/vendor/normalize.css',
      'css/snakes.css'
    ]
  }
end

namespace :assets do
  desc 'recreate sprite sheets'
  task 'resprite' do
    require 'sprite_factory'
    SpriteFactory.library = :chunkypng
    SpriteFactory.run!('images/fruit', :layout => :horizontal, :nocss => true)
    SpriteFactory.run!('images/head',  :layout => :horizontal, :nocss => true)
  end
end

