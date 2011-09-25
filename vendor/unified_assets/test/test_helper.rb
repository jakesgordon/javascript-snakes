require "test/unit"
require 'fileutils'
require "unified_assets"

class Test::Unit::TestCase

  #----------------------------------------------------------------------------

  SOURCE_JS    = ["test/js/a.js", "test/js/b.js", "test/js/c.js"]
  SOURCE_CSS   = ["test/css/a.css", "test/css/b.css", "test/css/c.css"]

  UNIFIED_JS   = "test/unified.js"
  UNIFIED_CSS  = "test/unified.css"
  MINIFIED_JS  = "test/unified.min.js"
  MINIFIED_CSS = "test/unified.min.css"

  REF_UNIFIED_JS   = IO.read("test/reference/unified.js")
  REF_UNIFIED_CSS  = IO.read("test/reference/unified.css")
  REF_MINIFIED_JS  = IO.read("test/reference/unified.min.js")
  REF_MINIFIED_CSS = IO.read("test/reference/unified.min.css")

  #----------------------------------------------------------------------------

  def setup
    [UNIFIED_JS, UNIFIED_CSS, MINIFIED_JS, MINIFIED_CSS].each{|name| assert(!File.exists?(name), "preconditions") }
    assert(UnifiedAssets::Minifier.enabled, "preconditions")
  end

  def teardown
    [UNIFIED_JS, UNIFIED_CSS, MINIFIED_JS, MINIFIED_CSS].each{|name| File.delete(name) if File.exists?(name) }
    UnifiedAssets::Minifier.enabled = true
  end

  #----------------------------------------------------------------------------

  def with_ref(source, target)
    FileUtils.cp(source, target)
    yield
    File.delete(target)
  end

  def with_unified_js(&block)
    with_ref("test/reference/unified.js", UNIFIED_JS, &block)
  end

  def with_unified_css(&block)
    with_ref("test/reference/unified.css", UNIFIED_CSS, &block)
  end

  def with_minified_js(&block)
    with_ref("test/reference/unified.js", UNIFIED_JS) do
      with_ref("test/reference/unified.min.js", MINIFIED_JS, &block)
    end
  end

  def with_minified_css(&block)
    with_ref("test/reference/unified.css", UNIFIED_CSS) do
      with_ref("test/reference/unified.min.css", MINIFIED_CSS, &block)
    end
  end

  #----------------------------------------------------------------------------

  def tickle(file)
    sleep(0.1)
    `touch #{file}`
  end

  #----------------------------------------------------------------------------

end

