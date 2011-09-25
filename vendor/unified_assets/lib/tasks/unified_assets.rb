require 'rake/tasklib'
require 'unified_assets'

module UnifiedAssets
  class Task < Rake::TaskLib

    attr_accessor :assets
    attr_accessor :minify
    attr_accessor :server

    def initialize(options = {})
      @assets = options[:assets]
      @minify = options[:minify]
      @server = options[:server] || {}
      yield(self) if block_given?
      define
    end

    def define
      namespace :assets do
        define_clear_task
        define_create_task
        define_server_task
      end
    end

    def define_clear_task
      desc "clear unified asset files"
      task :clear do
        assets.keys.each do |asset|
          Dir[asset, Minifier.minified_name(asset)].each {|f| File.delete(f) if File.exists?(f) }
        end
      end
    end

    def define_create_task
      desc "create unified asset files"
      task :create do
        Rake::Task["assets:clear"].invoke
        assets.keys.each do |asset|
          UnifiedAssets.build(assets[asset], asset, :minify => minify)
        end
      end
    end

    def define_server_task
      desc "simple webserver that auto-regenerates assets if they are out of date"
      task :server do |t, args|
        require 'rack'
        require 'unified_assets/server'
        options = {
          :root   => ENV['ROOT']  || server[:root]  || '.',
          :port   => ENV['PORT']  || server[:port]  || 3000,
          :debug  => ENV['DEBUG'] || server[:debug] || true,
          :assets => assets
        }
        app = Rack::Builder.new do
          use Rack::CommonLogger
          use Rack::ShowExceptions
          use Rack::Lint
          use UnifiedAssets::Server, options
          run Rack::File.new(options[:root])
        end.to_app
        handler   = Rack::Handler.get(ENV['HANDLER'] || server[:handler])
        handler ||= begin; Rack::Handler::Thin;    rescue LoadError; end
        handler ||= begin; Rack::Handler::Mongrel; rescue LoadError; end
        handler ||= Rack::Handler::WEBrick
        handler.run(app, :Port => options[:port])
      end
    end

  end # class Task
end # module UnifiedAsset

