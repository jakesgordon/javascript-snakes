module UnifiedAssets
  module Minifier

    class << self
      attr_accessor :enabled
      attr_accessor :extensions
      attr_accessor :jarfile
    end
    self.enabled    = true
    self.extensions = ['.js', '.css']
    self.jarfile    = "#{File.expand_path(File.join(File.dirname(__FILE__), "..", "..", "yuicompressor"))}/yuicompressor-2.4.6.jar"

    def self.available?
      @available ||= !`which java`.empty?   # warning: linux only way of checking if java is available
    end

    def self.enabled?(name = nil)
      enabled && available? && (name.nil? || extensions.include?(File.extname(name)))
    end

    def self.minified_name(name)
      if enabled?(name)
        ext = File.extname(name)
        name.sub(ext, ".min#{ext}")
      else
        name
      end
    end

    def self.minify(name)
      if name && enabled?(name) && File.exists?(name)
        minified_name = minified_name(name)
        `java -jar "#{jarfile}" "#{name}" -o "#{minified_name}"`
      end
    end

  end # module Minifier
end # module UnifiedAssets
