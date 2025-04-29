require "uri"

class Marksmith::Editor
  attr_reader :name,
    :extra_preview_params,
    :form,
    :disabled,
    :controller_data_attributes,
    :classes,
    :data_attributes,
    :placeholder,
    :autofocus,
    :style,
    :gallery,
    :kwargs,
    :id

  def initialize(name:,
    upload_url: nil,
    rails_direct_uploads_url: nil,
    enable_file_uploads: nil,
    extra_preview_params: {},
    form: nil,
    disabled: false,
    controller_data_attributes: {},
    classes: {},
    data_attributes: {},
    placeholder: nil,
    autofocus: false,
    style: nil,
    value: nil,
    id: "marksmith-instance-#{rand(1000..9999)}",
    gallery: {},
    **kwargs)
    @name = name
    @kwargs = kwargs

    @upload_url = upload_url
    @rails_direct_uploads_url = rails_direct_uploads_url
    @enable_file_uploads = enable_file_uploads
    @extra_preview_params = extra_preview_params
    @form = form
    @disabled = disabled
    @controller_data_attributes = controller_data_attributes
    @classes = classes
    @data_attributes = data_attributes
    @placeholder = placeholder
    @autofocus = autofocus
    @style = style
    @value = value
    @id = id
    @gallery = gallery
  end

  def element_classes(element, **options)
    # backwards compatibility
    @classes = { textarea: @classes } if @classes.is_a?(String)

    [
      "ms--#{element.to_s.gsub('_', '-')}",
      Marksmith::DefaultClasses.for(element, **options),
      @classes[element]
    ].compact_blank.join(" ")
  end

  def gallery_enabled
    gallery.fetch(:enabled, false)
  end

  def gallery_open_path
    gallery.fetch(:open_path, nil)
  end

  def gallery_params
    gallery.fetch(:params, {})
  end

  def gallery_turbo_frame
    gallery.fetch(:turbo_frame, nil)
  end

  def gallery_full_path
    if gallery_open_path.present?
      uri = URI.parse(gallery_open_path)
      uri.query = [ uri.query, gallery_params.map { |k, v| "#{k}=#{v}" }.join("&") ].compact.join("&")
      uri.to_s
    end
  end

  def upload_url
    if @upload_url.present?
      @upload_url
    elsif defined?(ActiveStorage)
      @rails_direct_uploads_url
    end
  end

  def enable_file_uploads
    if upload_url.blank?
      false
    elsif @enable_file_uploads.nil?
      true
    else
      @enable_file_uploads
    end
  end

  def field_name
    form&.field_name(name) || name
  end

  def value
    form&.object&.send(name) || @value || nil
  end

  def textarea_id
    "#{id}-textarea"
  end

  def preview_pane_id
    "#{id}-preview-pane"
  end
end
