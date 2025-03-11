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

    def marksmith_button_classes
      class_names(
        "ms:flex ms:items:center ms:cursor-pointer ms:py-1 ms:px-1.5 ms:hover:bg-neutral-200 ms:rounded",
        "ms:dark:text-neutral-300 ms:dark:hover:bg-neutral-600"
      )
    end

    def marksmith_toolbar_button(name, **kwargs)
      content_tag "md-#{name}", marksmith_toolbar_svg(name), title: t("marksmith.#{name.to_s.gsub("-", "_")}").humanize, class: marksmith_button_classes
    end

    def marksmith_tab_classes
      class_names(
        # marksmith_button_classes,
        "marksmith-toggle-button ms:text-sm ms:hover:bg-neutral-300 ms:uppercase ms:text-xs ms:font-semibold ms:cursor-pointer ms:text-neutral-400",
        # borders
        "ms:bg-transparent ms:hover:bg-transparent",
        "ms:-my-px ms:-ml-px ms:border ms:border-transparent",
        "ms:h-[calc(100%+3px)] ms:border-b-none",
        # "ms:border-b-neutral-00",
        # active classes
        "ms:[.active]:bg-neutral-50 ms:[.active]:text-neutral-600 ms:dark:[.active]:text-neutral-300 ms:[.active]:dark:bg-neutral-800 ms:[.active]:dark:border-neutral-500 ms:[.active]:rounded-t-md ms:[.active]:border-neutral-500",

      )
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
