module Marksmith
  class MarkdownPreviewsController < ApplicationController
    def create
      @body = Marksmith::Renderer.new(body: params[:body]).render
    end
  end
end
