module Marksmith
  class Renderer
    def initialize(body:)
      @body = body
    end

    def render
      html = if Marksmith.configuration.parser == "commonmarker"
        render_commonmarker
      elsif Marksmith.configuration.parser == "kramdown"
        render_kramdown
      else
        render_redcarpet
      end

      render_audio(html)
    end

    def render_audio(html)
      html = html.gsub(/<img src="([^"]+\.(?:mp3|wav|ogg|oga|m4a|aac|flac|opus|weba))"[^>]*>/i) do
        %(<audio controls src="#{Regexp.last_match(1)}"></audio>)
      end
      html.gsub(%r{<a href="([^"]+\.(?:mp3|wav|ogg|oga|m4a|aac|flac|opus|weba))"[^>]*>([^<]*)</a>}i) do
        %(<audio controls src="#{Regexp.last_match(1)}">#{Regexp.last_match(2)}</audio>)
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
