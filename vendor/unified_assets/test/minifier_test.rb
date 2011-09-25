require "test_helper"

class MinifierTest < Test::Unit::TestCase

  def test_minifier_defaults
    assert_equal(true,            UnifiedAssets::Minifier.enabled)
    assert_equal(['.js', '.css'], UnifiedAssets::Minifier.extensions)
    assert_equal(true,            UnifiedAssets::Minifier.available?)
  end

  def test_minifier_enabled
    UnifiedAssets::Minifier.enabled = true
    assert_equal(true,          UnifiedAssets::Minifier.enabled?("foo.js"))
    assert_equal(true,          UnifiedAssets::Minifier.enabled?("foo.css"))
    assert_equal(false,         UnifiedAssets::Minifier.enabled?("foo.png"), ".png is not appopriate for minifying")
    assert_equal("foo.min.js",  UnifiedAssets::Minifier.minified_name("foo.js"))
    assert_equal("foo.min.css", UnifiedAssets::Minifier.minified_name("foo.css"))
    assert_equal("foo.png",     UnifiedAssets::Minifier.minified_name("foo.png"), ".png is not appropriate for minifying")
  end

  def test_minifier_disabled
    UnifiedAssets::Minifier.enabled = false
    assert_equal(false,     UnifiedAssets::Minifier.enabled?("foo.js"))
    assert_equal(false,     UnifiedAssets::Minifier.enabled?("foo.css"))
    assert_equal(false,     UnifiedAssets::Minifier.enabled?("foo.png"))
    assert_equal("foo.js",  UnifiedAssets::Minifier.minified_name("foo.js"))
    assert_equal("foo.css", UnifiedAssets::Minifier.minified_name("foo.css"))
    assert_equal("foo.png", UnifiedAssets::Minifier.minified_name("foo.png"))
  end

  def test_minify_javascript
    with_unified_js do
      assert_equal(true,  File.exists?(UNIFIED_JS),  "preconditions")
      assert_equal(false, File.exists?(MINIFIED_JS), "preconditions")
      UnifiedAssets::Minifier.minify(UNIFIED_JS)
      assert_equal(true, File.exists?(UNIFIED_JS))
      assert_equal(true, File.exists?(MINIFIED_JS))
      assert_equal(REF_MINIFIED_JS, IO.read(MINIFIED_JS))
    end
  end

  def test_minify_css
    with_unified_css do
      assert_equal(true,  File.exists?(UNIFIED_CSS),  "preconditions")
      assert_equal(false, File.exists?(MINIFIED_CSS), "preconditions")
      UnifiedAssets::Minifier.minify(UNIFIED_CSS)
      assert_equal(true, File.exists?(UNIFIED_CSS))
      assert_equal(true, File.exists?(MINIFIED_CSS))
      assert_equal(REF_MINIFIED_CSS, IO.read(MINIFIED_CSS))
    end
  end

end

