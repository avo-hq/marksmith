module Marksmith
  module Helper
    def marksmithed(body)
      Marksmith::Renderer.new(body:).render
    end

    def marksmith_tag(name, **kwargs, &block)
      render partial: "marksmith/shared/editor", locals: { name: name, **kwargs }
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

    # TODO: maybe inline svgs in the future
    def marksmith_toolbar_svg(name)
      image_tag asset_path("marksmith/svgs/#{name}.svg"), class: "ms:inline ms:size-4"
    end
  end
end
