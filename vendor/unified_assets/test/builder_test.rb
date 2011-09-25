require "test_helper"

class BuilderTest < Test::Unit::TestCase

  #----------------------------------------------------------------------------

  def test_unified_javascript_file
    UnifiedAssets.build(SOURCE_JS, UNIFIED_JS)
    assert_equal(REF_UNIFIED_JS, IO.read(UNIFIED_JS))
  end

  def test_unified_css_file
    UnifiedAssets.build(SOURCE_CSS, UNIFIED_CSS)
    assert_equal(REF_UNIFIED_CSS, IO.read(UNIFIED_CSS))
  end

  #----------------------------------------------------------------------------

  def test_minified_javascript_file
    UnifiedAssets.build(SOURCE_JS, UNIFIED_JS, :minify => true)
    assert_equal(REF_UNIFIED_JS, IO.read(UNIFIED_JS))
    assert_equal(REF_MINIFIED_JS, IO.read(MINIFIED_JS))
  end

  def test_minified_css_file
    UnifiedAssets.build(SOURCE_CSS, UNIFIED_CSS, :minify => true)
    assert_equal(REF_UNIFIED_CSS, IO.read(UNIFIED_CSS))
    assert_equal(REF_MINIFIED_CSS, IO.read(MINIFIED_CSS))
  end

  #----------------------------------------------------------------------------

  def test_rebuild_required_because_unified_file_is_missing
    ua = UnifiedAssets::Builder.new(SOURCE_JS, UNIFIED_JS)
    assert_equal(SOURCE_JS,                 ua.files)
    assert_equal(UNIFIED_JS,                ua.unified_file_name)
    assert_equal(nil,                       ua.unified_file_mtime)
    assert_equal(nil,                       ua.minified_file_name)
    assert_equal(nil,                       ua.minified_file_mtime)
    assert_equal(true,                      ua.unified_file_missing?)
    assert_equal(false,                     ua.minified_file_missing?)
    assert_equal(false,                     ua.minifying?)
    assert_equal(true,                      ua.rebuild?)
    assert_equal("UNIFIED FILE IS MISSING", ua.rebuild_reason)
  end

  def test_rebuild_required_because_unified_file_is_out_of_date
    with_unified_js do
      tickle SOURCE_JS[0]
      ua = UnifiedAssets::Builder.new(SOURCE_JS, UNIFIED_JS)
      assert_equal(SOURCE_JS,                        ua.files)
      assert_equal(UNIFIED_JS,                       ua.unified_file_name)
      assert_equal(File.stat(UNIFIED_JS).mtime,      ua.unified_file_mtime)
      assert_equal(nil,                              ua.minified_file_name)
      assert_equal(nil,                              ua.minified_file_mtime)
      assert_equal(false,                            ua.unified_file_missing?)
      assert_equal(false,                            ua.minified_file_missing?)
      assert_equal(false,                            ua.minifying?)
      assert_equal(true,                             ua.rebuild?)
      assert_equal("#{SOURCE_JS[0]} IS OUT OF DATE", ua.rebuild_reason)
    end
  end

  def test_rebuild_not_required
    with_unified_js do
      ua = UnifiedAssets::Builder.new(SOURCE_JS, UNIFIED_JS)
      assert_equal(SOURCE_JS,                   ua.files)
      assert_equal(UNIFIED_JS,                  ua.unified_file_name)
      assert_equal(File.stat(UNIFIED_JS).mtime, ua.unified_file_mtime)
      assert_equal(nil,                         ua.minified_file_name)
      assert_equal(nil,                         ua.minified_file_mtime)
      assert_equal(false,                       ua.unified_file_missing?)
      assert_equal(false,                       ua.minified_file_missing?)
      assert_equal(false,                       ua.minifying?)
      assert_equal(false,                       ua.rebuild?)
      assert_equal(nil,                         ua.rebuild_reason)
    end
  end

  #----------------------------------------------------------------------------

  def test_rebuild_required_because_minified_file_is_missing
    with_unified_js do
      ua = UnifiedAssets::Builder.new(SOURCE_JS, UNIFIED_JS, :minify => true)
      assert_equal(SOURCE_JS,                   ua.files)
      assert_equal(UNIFIED_JS,                  ua.unified_file_name)
      assert_equal(File.stat(UNIFIED_JS).mtime, ua.unified_file_mtime)
      assert_equal(MINIFIED_JS,                 ua.minified_file_name)
      assert_equal(nil,                         ua.minified_file_mtime)
      assert_equal(false,                       ua.unified_file_missing?)
      assert_equal(true,                        ua.minified_file_missing?)
      assert_equal(true,                        ua.minifying?)
      assert_equal(true,                        ua.rebuild?)
      assert_equal("MINIFIED FILE IS MISSING",  ua.rebuild_reason)
    end
  end

  def test_rebuild_required_because_minified_file_is_out_of_date
    with_minified_js do
      tickle UNIFIED_JS
      ua = UnifiedAssets::Builder.new(SOURCE_JS, UNIFIED_JS, :minify => true)
      assert_equal(SOURCE_JS,                      ua.files)
      assert_equal(UNIFIED_JS,                     ua.unified_file_name)
      assert_equal(File.stat(UNIFIED_JS).mtime,    ua.unified_file_mtime)
      assert_equal(MINIFIED_JS,                    ua.minified_file_name)
      assert_equal(File.stat(MINIFIED_JS).mtime,   ua.minified_file_mtime)
      assert_equal(false,                          ua.unified_file_missing?)
      assert_equal(false,                          ua.minified_file_missing?)
      assert_equal(true,                           ua.minifying?)
      assert_equal(true,                           ua.rebuild?)
      assert_equal("MINIFIED FILE IS OUT OF DATE", ua.rebuild_reason)
    end
  end

  def test_rebuild_not_required_when_minifying
    with_minified_js do
      ua = UnifiedAssets::Builder.new(SOURCE_JS, UNIFIED_JS, :minify => true)
      assert_equal(SOURCE_JS,                    ua.files)
      assert_equal(UNIFIED_JS,                   ua.unified_file_name)
      assert_equal(File.stat(UNIFIED_JS).mtime,  ua.unified_file_mtime)
      assert_equal(MINIFIED_JS,                  ua.minified_file_name)
      assert_equal(File.stat(MINIFIED_JS).mtime, ua.minified_file_mtime)
      assert_equal(false,                        ua.unified_file_missing?)
      assert_equal(false,                        ua.minified_file_missing?)
      assert_equal(true,                         ua.minifying?)
      assert_equal(false,                        ua.rebuild?)
      assert_equal(nil,                          ua.rebuild_reason)
    end
  end

  #----------------------------------------------------------------------------

  def test_minify_is_ignored_if_minifier_is_not_enabled
    UnifiedAssets::Minifier.enabled = false
    ua = UnifiedAssets::Builder.new(SOURCE_JS, UNIFIED_JS, :minify => true)
    assert_equal(SOURCE_JS,                   ua.files)
    assert_equal(UNIFIED_JS,                  ua.unified_file_name)
    assert_equal(nil,                         ua.unified_file_mtime)
    assert_equal(nil,                         ua.minified_file_name)
    assert_equal(nil,                         ua.minified_file_mtime)
    assert_equal(true,                        ua.unified_file_missing?)
    assert_equal(false,                       ua.minified_file_missing?)
    assert_equal(false,                       ua.minifying?)
    assert_equal(true,                        ua.rebuild?)
    assert_equal("UNIFIED FILE IS MISSING",   ua.rebuild_reason)
  end

  #----------------------------------------------------------------------------

end

