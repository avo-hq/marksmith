class Marksmith::DefaultClasses
  include ActionView::Helpers::TagHelper

  def self.for(element, **options)
    new(element, **options).default_classes
  end

  def initialize(element, **options)
    @element = element
    @options = options
  end

  def default_classes
    case @element
    when :action_bar
      class_names("ms:flex ms:flex-wrap ms:px-2 ms:py-1", "ms:pointer-events-none": @options[:disabled])
    when :container
      "marksmith ms:block ms:flex-col ms:w-full ms:border ms:border-neutral-500 ms:rounded-md ms:@container ms:focus-within:outline-2 ms:outline-blue-500 ms:-outline-offset-1"
    when :editor_content
      "ms:border-t ms:w-full ms:border-neutral-500 ms:flex ms:flex-1"
    when :editor_pane
      "ms:flex ms:flex-1 ms:flex-col ms:size-full"
    when :editor_pane_footer
      "ms:flex ms:flex-1 ms:flex-grow ms:space-x-2 ms:py-1 ms:border-t ms:border-neutral-500 ms:px-2 ms:font-sans ms:text-sm ms:p-2 ms:dark:bg-neutral-800 ms:dark:text-neutral-300 ms:rounded-b-md"
    when :footer_gallery_link
      class_names(
        "ms:flex ms:items-center ms:text-neutral-800 ms:no-underline ms:gap-1",
        self.class.for(:toolbar_button)
      )
    when :footer_markdown_link
      class_names(
        "ms:flex ms:items-center ms:text-neutral-800 ms:no-underline ms:gap-1",
        self.class.for(:toolbar_button)
      )
    when :footer_upload_button
      class_names(
        "ms:bg-none ms:border-none ms:bg-transparent ms:text-neutral-600 ms:items-center ms:flex ms:gap-1",
        self.class.for(:toolbar_button)
      )
    when :loading_spinner
      "ms:button-spinner"
    when :preview_pane
      "ms:hidden ms:markdown-preview ms:size-full ms:flex-1 ms:flex ms:size-full ms:p-2 ms:overflow-auto ms:bg-white ms:dark:bg-neutral-800 ms:rounded-b-md"
    when :rendered_body
      "ms:block ms:w-full ms:prose ms:max-w-none ms:prose-neutral ms:dark:prose-invert"
    when :tab_button
      class_names(
        # marksmith_button_classes,
        "marksmith-toggle-button ms:text-sm ms:hover:bg-neutral-300 ms:text-sm ms:font-medium ms:cursor-pointer ms:text-neutral-500 ms:px-3",
        # borders
        "ms:bg-transparent ms:hover:bg-transparent",
        "ms:-my-px ms:-ml-px ms:border ms:border-transparent",
        "ms:h-[calc(100%+3px)] ms:border-b-none",
        # "ms:border-b-neutral-00",
        # active classes
        "ms:[.active]:bg-neutral-50 ms:[.active]:text-neutral-900 ms:dark:[.active]:text-neutral-300 ms:[.active]:dark:bg-neutral-800 ms:[.active]:dark:border-neutral-500 ms:[.active]:rounded-t-md ms:[.active]:border-neutral-500",
      )
    when :tabs_container
      "ms:flex-1 ms:flex ms:items-center"
    when :textarea
      class_names(
        "ms:flex ms:flex-1 ms:border-none ms:resize-none ms:focus:outline-none ms:font-mono ms:focus:ring-0 ms:leading-normal ms:p-2 ms:text-sm ms:field-sizing-content ms:min-h-60",
        "ms:dark:bg-neutral-800 ms:dark:text-neutral-200"
      )
    when :toolbar
      class_names(
        "ms:flex-1 ms:flex-col-reverse ms:@md:flex-row ms:grow ms:flex ms:justify-bewteen ms:bg-neutral-50 ms:rounded-t-md ms:gap-y-1",
        "ms:dark:bg-neutral-700 ms:dark:text-neutral-200"
      )
    when :toolbar_button
      "ms:cursor-pointer ms:hover:bg-neutral-200 ms:px-1 ms:py-px ms:rounded ms:text-sm ms:dark:text-neutral-300 ms:dark:hover:bg-neutral-600"
    else
      ""
    end
  end
end
