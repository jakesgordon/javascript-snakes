module UnifiedAssets
  class Builder

    attr :files
    attr :unified_file_name
    attr :unified_file_mtime
    attr :minified_file_name
    attr :minified_file_mtime
    attr :options

    def initialize(files, unified_file_name, options = {})
      @options             = options
      @files               = Array(files)
      @unified_file_name   = unified_file_name
      @unified_file_mtime  = File.stat(unified_file_name).mtime if File.exists?(unified_file_name)
      @minified_file_name  = Minifier.minified_name(unified_file_name) if minifying?
      @minified_file_mtime = File.stat(minified_file_name).mtime if minifying? && File.exists?(minified_file_name)
    end

    def unified_file_missing?
      unified_file_mtime.nil?
    end

    def minified_file_missing?
      minifying? && minified_file_mtime.nil?
    end

    def minifying?
      !!options[:minify] && Minifier.enabled?(unified_file_name)
    end

    def rebuild?
      if @rebuild_because.nil?
        @rebuild_because = []
        @rebuild_because << "UNIFIED FILE IS MISSING" if unified_file_missing?
        @rebuild_because << "MINIFIED FILE IS MISSING" if minified_file_missing?
        @rebuild_because << "MINIFIED FILE IS OUT OF DATE" if minifying? && !minified_file_missing? && !unified_file_missing? && (minified_file_mtime < unified_file_mtime)
        unless unified_file_missing?
          files.each do |name|
            file_mtime = File.stat(name).mtime
            if (file_mtime > unified_file_mtime)
              @rebuild_because << "#{name} IS OUT OF DATE"
            end
          end
        end
      end
      !@rebuild_because.empty?
    end

    def rebuild_reason
      @rebuild_because.join(', ') if rebuild?
    end

    def build
      if rebuild?
        debug("**** REGENERATING #{unified_file_name} BECAUSE #{rebuild_reason} ****", options)
        File.open(unified_file_name, 'w') do |uf|
          files.each do |filename|
            debug("**** RENDERING #{filename}")
            uf << IO.read(filename)
          end
        end
        Minifier.minify(unified_file_name) if minifying?
      end
    end

    def debug(msg, options = {})
      puts msg if options[:debug]
    end

  end # class Builder
end # module UnifiedAssets
