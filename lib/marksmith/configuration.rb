module Marksmith
  class Configuration
    class_attribute :automatically_mount_engine, default: true
    class_attribute :mount_path, default: "/marksmith"
    class_attribute :parser, default: "commonmarker"
  end

  def self.configuration
    @configuration ||= Configuration.new
  end

  def self.configure
    yield configuration
  end
end
