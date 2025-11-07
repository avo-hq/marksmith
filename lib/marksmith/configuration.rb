module Marksmith
  class Configuration
    attr_accessor :automatically_mount_engine, :mount_path, :parser

    def initialize
      @automatically_mount_engine = true
      @mount_path = "/marksmith"
      @parser = "commonmarker"
    end
  end

  def self.configuration
    @configuration ||= Configuration.new
  end

  def self.configure
    yield configuration
  end
end
