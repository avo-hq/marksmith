module Marksmith
  class Renderer
    VIDEO_URL_PATTERN = %r{^[ \t]*(https?://\S+\.(?:mp4|webm|ogg|ogv|mov|m4v)(?:\?\S*)?)[ \t]*$}i

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
      body = processed_body.dup.force_encoding("utf-8")
      Commonmarker.to_html(body, options: {render: {unsafe: true}})
    end

    def render_redcarpet
      ::Redcarpet::Markdown.new(
        ::Redcarpet::Render::HTML,
        Marksmith.configuration.redcarpet_options.to_h
      ).render(processed_body)
    end

    def render_kramdown
      body = processed_body.dup.force_encoding("utf-8")
      Kramdown::Document.new(body).to_html
    end

    private

    def processed_body
      @body.to_s.gsub(VIDEO_URL_PATTERN) do
        %(<video src="#{$1}" controls></video>)
      end
    end
  end
end
