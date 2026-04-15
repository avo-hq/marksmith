module Marksmith
  class Configuration
    class RedcarpetOptions
      DEFAULTS = {
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
      }.freeze

      DEFAULTS.each do |name, default|
        class_attribute name, default: default
      end

      def self.merge(options)
        options.to_h.each do |key, value|
          writer = "#{key}="

          unless respond_to?(writer)
            raise ArgumentError, "Unknown Redcarpet option: #{key}"
          end

          public_send(writer, value)
        end

        self
      end

      def self.to_h
        DEFAULTS.keys.index_with { |key| public_send(key) }
      end
    end

    class_attribute :automatically_mount_engine, default: true
    class_attribute :mount_path, default: "/marksmith"
    class_attribute :parser, default: "commonmarker"
    class_attribute :redcarpet_options, default: RedcarpetOptions

    def redcarpet_options=(options)
      self.class.redcarpet_options = redcarpet_options.merge(options.to_h)
    end
  end

  def self.configuration
    @configuration ||= Configuration.new
  end

  def self.configure
    yield configuration
  end
end
