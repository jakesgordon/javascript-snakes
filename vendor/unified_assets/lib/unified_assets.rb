require 'unified_assets/builder'
require 'unified_assets/minifier'

module UnifiedAssets

  def self.build(files, unified_file_name, options = {})
    Builder.new(files, unified_file_name, options).build
  end

end


