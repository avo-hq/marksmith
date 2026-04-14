module Marksmith
  class Configuration
    class_attribute :automatically_mount_engine, default: true
    class_attribute :mount_path, default: "/marksmith"
    class_attribute :parser, default: "commonmarker"
    class_attribute :redcarpet_options, default: {
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
    }

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
