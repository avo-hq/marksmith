require "test_helper"

class ConfigurationTest < ActiveSupport::TestCase
  def setup
    @original_redcarpet_options = Marksmith.configuration.redcarpet_options.to_h
  end

  def teardown
    Marksmith.configuration.redcarpet_options = @original_redcarpet_options
  end

  test "redcarpet options expose defaults" do
    assert_equal Marksmith::Configuration::RedcarpetOptions::DEFAULTS, Marksmith.configuration.redcarpet_options.to_h
  end

  test "redcarpet options hash assignment merges with existing options" do
    Marksmith.configuration.redcarpet_options = { underline: false }
    Marksmith.configuration.redcarpet_options = { highlight: false }

    assert_equal false, Marksmith.configuration.redcarpet_options.underline
    assert_equal false, Marksmith.configuration.redcarpet_options.highlight
    assert_equal true, Marksmith.configuration.redcarpet_options.tables
  end

  test "redcarpet options can be overridden through DSL setters" do
    Marksmith.configuration.redcarpet_options.underline = false
    Marksmith.configuration.redcarpet_options.highlight = false

    assert_equal false, Marksmith.configuration.redcarpet_options.underline
    assert_equal false, Marksmith.configuration.redcarpet_options.highlight
    assert_equal true, Marksmith.configuration.redcarpet_options.tables
  end

  test "redcarpet options reject unknown keys" do
    error = assert_raises(ArgumentError) do
      Marksmith.configuration.redcarpet_options = { invalid_option: true }
    end

    assert_equal "Unknown Redcarpet option: invalid_option", error.message
  end
end
