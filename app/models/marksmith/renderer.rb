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
        Marksmith.configuration.redcarpet_options.to_h
      ).render(@body)
    end

    def render_kramdown
      body = @body.to_s.dup.force_encoding("utf-8")
      Kramdown::Document.new(body).to_html
    end
  end
end
