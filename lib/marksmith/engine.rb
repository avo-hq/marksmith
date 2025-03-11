module Marksmith
  class Engine < ::Rails::Engine
    isolate_namespace Marksmith

    initializer "marksmith.view_helpers" do
      ActiveSupport.on_load :action_view do
        require_relative "../../app/helpers/marksmith/marksmith_helper"
        ActionView::Base.include Marksmith::MarksmithHelper

        module FormBuilderExtensions
          def marksmith(*args, **kwargs, &block)
            @template.marksmith_tag(*args, **kwargs.merge(form: self), &block)
          end
        end

        ActionView::Helpers::FormBuilder.include FormBuilderExtensions
      end
    end

    initializer "marksmith.routes" do |app|
      if Marksmith.configuration.automatically_mount_engine
        app.routes.append do
          mount Marksmith::Engine => Marksmith.configuration.mount_path
        end
      end
    end

    initializer "marksmith.assets.precompile" do |app|
      if Rails.application.config.respond_to?(:assets)
        # The manifest will expose the asset files to the main app.
        app.config.assets.precompile << "marksmith_manifest.js"
      end
    end

    generators do |app|
      Rails::Generators.configure! app.config.generators
    end

    initializer "avo-markdown_field.init" do |app|
      if defined?(Avo)
        require "marksmith/fields/markdown_field"

        ActiveSupport.on_load(:avo_boot) do
          Avo.plugin_manager.register :marksmith_field

          Avo.plugin_manager.register_field :markdown, Marksmith::Fields::MarkdownField
          Avo.plugin_manager.register_field :marksmith, Marksmith::Fields::MarkdownField

          Avo.asset_manager.add_stylesheet "marksmith"
          Avo.asset_manager.add_javascript "marksmith_controller-no-stimulus.esm"
          Avo.asset_manager.add_javascript "list_continuation_controller-no-stimulus.esm"

          Avo.asset_manager.register_stimulus_controller "marksmith", "MarksmithController"
          Avo.asset_manager.register_stimulus_controller "list-continuation", "ListContinuationController"
        end
      else
        # Ignore the markdown_field components if Avo is not defined
        app.autoloaders.main.ignore(
          root.join("app", "components", "marksmith", "markdown_field"),
        )
      end
    end
  end
end
