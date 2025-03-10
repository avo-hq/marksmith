require "uri"

class Marksmith::Editor
  attr_reader :name,
    :args,
    :disabled,
    :controller_data_attributes,
    :classes,
    :rows,
    :data_attributes,
    :form,
    :extra_preview_params,
    :data_attributes,
    :placeholder,
    :autofocus,
    :style,
    :gallery

  def initialize(name:, upload_url: nil, rails_direct_uploads_url: nil, enable_file_uploads: nil, extra_preview_params: {}, form: nil, disabled: false, controller_data_attributes: {}, classes: nil, rows: 15, data_attributes: {}, placeholder: nil, autofocus: false, style: nil, gallery: {}, **kwargs)
    @name = name
    @args = kwargs

    @upload_url = upload_url
    @rails_direct_uploads_url = rails_direct_uploads_url
    @enable_file_uploads = enable_file_uploads
    @extra_preview_params = extra_preview_params
    @form = form
    @disabled = disabled
    @controller_data_attributes = controller_data_attributes
    @classes = classes
    @rows = rows
    @data_attributes = data_attributes
    @placeholder = placeholder
    @autofocus = autofocus
    @style = style
    @gallery = gallery
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
    if defined?(form)
      form&.object&.send(name)
    else
      @value || nil
    end
  end
end
