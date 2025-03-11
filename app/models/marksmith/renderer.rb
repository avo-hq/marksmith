module Marksmith
  class Renderer
    def initialize(body:)
      @body = body
    end

    def render
      if Marksmith.configuration.parser == "commonmarker"
        render_commonmarker
      elsif Marksmith.configuration.parser == "kramdown"
        render_kramdown
      else
        render_redcarpet
      end
    end

    def render_commonmarker
      # commonmarker expects an utf-8 encoded string
      body = @body.to_s.dup.force_encoding("utf-8")
      Commonmarker.to_html(body)
    end

    def render_redcarpet
      ::Redcarpet::Markdown.new(
        ::Redcarpet::Render::HTML,
        tables: true,
        lax_spacing: true,
        fenced_code_blocks: true,
        space_after_headers: true,
        hard_wrap: true,
        autolink: true,
        strikethrough: true,
        underline: true,
        highlight: true,
        quote: true,
        with_toc_data: true
      ).render(@body)
    end

    def render_kramdown
      body = @body.to_s.dup.force_encoding("utf-8")
      Kramdown::Document.new(body).to_html
    end
  end
end
