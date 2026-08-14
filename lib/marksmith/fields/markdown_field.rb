module Marksmith
  module Fields
    class MarkdownField < Avo::Fields::BaseField
      # Avo >= 4.2 lets the editor viewport be resized with a persisted height.
      resizable_editor target: ".marksmith-textarea" if respond_to?(:resizable_editor)

      attr_reader :extra_preview_params,
        :file_uploads,
        :always_show

      def initialize(id, **args, &block)
        @media_library = args[:media_library].nil? ? true : args[:media_library]
        @extra_preview_params = args[:extra_preview_params] || {}
        @file_uploads = args[:file_uploads]
        @always_show = args[:always_show] || false

        super(id, **args, &block)

        hide_on :index
      end

      def view_component_namespace
        "Marksmith::MarkdownField"
      end

      def gallery_enabled?
        Avo::MediaLibrary.configuration.enabled && @media_library
      end
    end
  end
end
