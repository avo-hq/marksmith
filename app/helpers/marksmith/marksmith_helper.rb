module Marksmith
  module MarksmithHelper
    def marksmithed(body)
      Marksmith::Renderer.new(body:).render
    end

    def marksmith_tag(name, **kwargs, &block)
      rails_direct_uploads_url = if defined?(ActiveStorage)
        main_app.rails_direct_uploads_url
      end

      editor = Marksmith::Editor.new(name:, rails_direct_uploads_url:, **kwargs, &block)

      render partial: "marksmith/shared/editor", locals: { name: editor.name, editor: }
    end

    def marksmith_asset_tags(*args, **kwargs)
      stylesheet_link_tag("marksmith", *args, **kwargs) +
      javascript_include_tag("marksmith.esm.js", *args, **kwargs)
    end

    def marksmith_toolbar_button(name, hotkey_scope: nil, hotkey: nil, editor: nil, **kwargs)
      content_tag "md-#{name}", marksmith_toolbar_svg(name),
        title: t("marksmith.#{name.to_s.gsub("-", "_")}").humanize,
        class: editor&.element_classes(:toolbar_button),
        data: {
          hotkey_scope:,
          hotkey:
        }
    end

    def marksmith_inline_svg(path)
      File.open(Marksmith::Engine.root.join(path)).read.html_safe
    end

    # TODO: maybe inline svgs in the future
    def marksmith_toolbar_svg(name)
      marksmith_inline_svg("app/assets/images/marksmith/svgs/#{name}.svg")
    rescue
      "<!-- Failed to load SVG for #{name} -->"
    end
  end
end
