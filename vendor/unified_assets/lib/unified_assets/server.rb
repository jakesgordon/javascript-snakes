module UnifiedAssets
  class Server

    def initialize(app, options)
      @app    = app
      @root   = options[:root] or raise ArgumentError, ":root option is required"
      @assets = options[:assets]
      @minify = options[:minify]
      @debug  = options[:debug]
    end

    def call(env)

      path_info = Rack::Utils.unescape(env["PATH_INFO"])
      path      = File.join(@root, path_info)

      # redirect with trailing slash if necessary
      if File.directory?(path) && path_info !~ /\/$/
        new_path_info = path_info + "/"
        return [
          302,
          { 'Location' => new_path_info, 'Content-Type' => 'text/html' },
          [ "Redirecting you to #{new_path_info}&hellip;" ]
        ]
      end

      # add index.html if necessary
      new_env = env.dup
      if File.directory?(path) 
        path_to_index = File.join(path, "index.html")
        if File.file?(path_to_index)
          new_env["PATH_INFO"] = File.join(path_info, "index.html")
        end
      end

      # regenerate assets if necessary
      asset = path_info[1..-1] # trim leading slash
      if @assets && @assets.keys.include?(asset)
        UnifiedAssets.build(@assets[asset], asset, :minify => @minify, :debug => @debug)
      end
    
      @app.call(new_env)

    end

  end # class Server
end # module UnifiedAssets
