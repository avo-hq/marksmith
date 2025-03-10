module Marksmith
  module Helper
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

    def marksmith_button_classes
      class_names("ms:flex ms:items:center ms:cursor-pointer ms:py-1 ms:px-1.5 ms:hover:bg-neutral-200 ms:rounded")
    end

    def marksmith_toolbar_button(name, **kwargs)
      content_tag "md-#{name}", marksmith_toolbar_svg(name), title: t("marksmith.#{name.to_s.gsub("-", "_")}").humanize, class: marksmith_button_classes
    end

    def marksmith_toggle_button_classes
      class_names(marksmith_button_classes, "ms:bg-neutral-200 ms:border-0 ms:bg-none ms:text-sm ms:hover:bg-neutral-300 ms:uppercase ms:text-xs ms:font-semibold ms:text-neutral-800")
    end

    # TODO: maybe inline svgs in the future
    def marksmith_toolbar_svg(name)
      image_tag asset_path("marksmith/svgs/#{name}.svg"), class: "ms:inline ms:size-4"
    end
  end
end
