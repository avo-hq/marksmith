require "test_helper"

class RedcarpetHelperTest < ActiveSupport::TestCase
  include Marksmith::MarksmithHelper

  def setup
    @original_parser = Marksmith.configuration.parser
    @original_redcarpet_options = Marksmith.configuration.redcarpet_options.to_h
    Marksmith.configuration.parser = "redcarpet"
  end

  def teardown
    Marksmith.configuration.parser = @original_parser
    Marksmith.configuration.redcarpet_options = @original_redcarpet_options
  end

  test "marksmithed#renders simple markdown" do
    body = "# Hello World\n\nThis is a test."
    expected = "<h1>Hello World</h1>\n\n<p>This is a test.</p>\n"

    assert_equal expected, marksmithed(body)
  end

    test "marksmithed#when rendering a header" do
    body = "# Header"
    expected = "<h1>Header</h1>\n"

    assert_equal expected, marksmithed(body)
  end

  # Test rendering a list
  test "marksmithed#when rendering a list" do
    body = "- item1\n- item2"
    expected = "<ul>\n<li>item1</li>\n<li>item2</li>\n</ul>\n"

    assert_equal expected, marksmithed(body)
  end

  # Test rendering a code block
  test "marksmithed#when rendering a code block" do
    body = "```\ndef hello\n  puts 'hello'\nend\n```"
    expected = "<pre><code>def hello\n  puts &#39;hello&#39;\nend\n</code></pre>\n"

    assert_equal expected, marksmithed(body)
  end

  # Test rendering a table
  test "marksmithed#when rendering a table" do
    body = "| a | b |\n|---|---|\n| c | d |"
    expected = "<table><thead>\n<tr>\n<th>a</th>\n<th>b</th>\n</tr>\n</thead><tbody>\n<tr>\n<td>c</td>\n<td>d</td>\n</tr>\n</tbody></table>\n"

    assert_equal expected, marksmithed(body)
  end

  # Test rendering strikethrough text
  test "marksmithed#when rendering strikethrough text" do
    body = "This is ~~strikethrough~~ text."
    expected = "<p>This is <del>strikethrough</del> text.</p>\n"

    assert_equal expected, marksmithed(body)
  end

  # Test rendering underline text using single underscores (emphasis)
  test "marksmithed#when rendering underline (emphasis) text" do
    body = "This is _underline_ text."
    expected = "<p>This is <u>underline</u> text.</p>\n"

    assert_equal expected, marksmithed(body)
  end

  # Test rendering underline text using double underscores (underline)
  test "marksmithed#when rendering strong text using double underscores" do
    body = "This is __underline__ text."
    expected = "<p>This is <strong>underline</strong> text.</p>\n"

    assert_equal expected, marksmithed(body)
  end

  # Test rendering highlighted text
  test "marksmithed#when rendering highlighted text" do
    body = "This is ==highlighted== text."
    expected = "<p>This is <mark>highlighted</mark> text.</p>\n"

    assert_equal expected, marksmithed(body)
  end

  # Test rendering a blockquote
  test "marksmithed#when rendering a blockquote" do
    body = "> This is a blockquote."
    expected = "<blockquote>\n<p>This is a blockquote.</p>\n</blockquote>\n"

    assert_equal expected, marksmithed(body)
  end

  # Test rendering autolinks
  test "marksmithed#when rendering autolinks" do
    body = "Visit https://example.com"
    expected = "<p>Visit <a href=\"https://example.com\">https://example.com</a></p>\n"

    assert_equal expected, marksmithed(body)
  end

  # Test rendering fenced code blocks with language specification
  test "marksmithed#when rendering fenced code blocks with language" do
    body = "```ruby\ndef hello\n  puts 'hello'\nend\n```"
    expected = "<pre><code class=\"ruby\">def hello\n  puts &#39;hello&#39;\nend\n</code></pre>\n"

    assert_equal expected, marksmithed(body)
  end

  # Test rendering hard line breaks
  test "marksmithed#when rendering with hard line breaks" do
    body = "Line1\nLine2"
    expected = "<p>Line1\nLine2</p>\n"

    assert_equal expected, marksmithed(body)
  end

  # Test rendering with lax spacing (multiple paragraphs without explicit breaks)
  test "marksmithed#when rendering with lax spacing" do
    body = "Paragraph one

Paragraph two"
    expected = "<p>Paragraph one</p>\n\n<p>Paragraph two</p>\n"

    assert_equal expected, marksmithed(body)
  end

  # Test rendering emphasis and strong emphasis
  test "marksmithed#when rendering emphasis and strong emphasis" do
    body = "This is *emphasized* and this is **strongly emphasized**."
    expected = "<p>This is <em>emphasized</em> and this is <strong>strongly emphasized</strong>.</p>\n"

    assert_equal expected, marksmithed(body)
  end

  # Test rendering an empty string
  test "marksmithed#when rendering an empty string" do
    body = ""
    expected = ""

    assert_equal expected, marksmithed(body)
  end

  # Test handling of nil input
  test "marksmithed#when handling nil input" do
    body = nil
    expected = ""

    assert_equal expected, marksmithed(body.to_s)
  end

  test "marksmithed#allows overriding redcarpet options" do
    Marksmith.configuration.redcarpet_options = {
      underline: false,
      highlight: false
    }

    body = "This is _underline_ and ==highlighted== text."
    expected = "<p>This is <em>underline</em> and ==highlighted== text.</p>\n"

    assert_equal expected, marksmithed(body)
  end
end
