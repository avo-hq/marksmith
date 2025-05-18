/* eslint-disable camelcase */
import '@github/markdown-toolbar-element'
import { Controller } from '@hotwired/stimulus'
import { DirectUpload } from '@rails/activestorage'
import { post } from '@rails/request.js'
import { subscribe } from '@github/paste-markdown'
import {install, uninstall} from '@github/hotkey'

// upload code from Jeremy Smith's blog post
// https://hybrd.co/posts/github-issue-style-file-uploader-using-stimulus-and-active-storage

// Connects to data-controller="marksmith"
export default class extends Controller {
  static values = {
    attachUrl: String,
    previewUrl: String,
    extraPreviewParams: { type: Object, default: {} },
    fieldId: String,
    galleryEnabled: { type: Boolean, default: false },
    galleryOpenPath: String,
    fileUploadsEnabled: { type: Boolean, default: true },
  }

  static targets = ['fieldContainer', 'fieldElement', 'previewPane', 'writeTabButton', 'previewTabButton', 'toolbar']

  activeTabClass = "active"

  get #fileUploadsDisabled() {
    return !this.fileUploadsEnabledValue
  }

  connect() {
    subscribe(this.fieldElementTarget)

    // Install all the hotkeys on the page
    for (const el of document.querySelectorAll('[data-hotkey]')) {
      install(el)
    }
  }

  disconnect() {
    // Uninstall all the hotkeys on the page
    for (const el of document.querySelectorAll('[data-hotkey]')) {
      uninstall(el)
    }
  }

  switchToWrite(event) {
    event.preventDefault()

    // toggle buttons
    this.writeTabButtonTarget.classList.add(this.activeTabClass)
    this.previewTabButtonTarget.classList.remove(this.activeTabClass)

    // toggle write/preview buttons
    this.fieldContainerTarget.classList.remove('ms:hidden')
    this.previewPaneTarget.classList.add('ms:hidden')

    // toggle the toolbar back
    this.toolbarTarget.classList.remove('ms:opacity-0', 'ms:pointer-events-none')
  }

  switchToPreview(event) {
    event.preventDefault()

    // unfocus the active element to hide the outline around the editor
    this.element.focus()
    this.element.blur()
    document.activeElement.blur()

    post(this.previewUrlValue, {
      body: {
        body: this.fieldElementTarget.value,
        element_id: this.previewPaneTarget.id,
        extra_params: this.extraPreviewParamsValue,
      },
      responseKind: 'turbo-stream',
    })

    // set the min height to the field element height
    this.previewPaneTarget.style.minHeight = `${this.fieldElementTarget.offsetHeight}px`

    // toggle buttons
    this.writeTabButtonTarget.classList.remove(this.activeTabClass)
    this.previewTabButtonTarget.classList.add(this.activeTabClass)

    // toggle elements
    this.fieldContainerTarget.classList.add('ms:hidden')
    this.previewPaneTarget.classList.remove('ms:hidden')

    // toggle the toolbar
    this.toolbarTarget.classList.add('ms:opacity-0', 'ms:pointer-events-none')
  }

  dropUpload(event) {
    if (this.#fileUploadsDisabled) return

    event.preventDefault()
    this.#uploadFiles(event.dataTransfer.files)
  }

  pasteUpload(event) {
    if (this.#fileUploadsDisabled) return

    if (!event.clipboardData.files.length) return

    event.preventDefault()
    this.#uploadFiles(event.clipboardData.files)
  }

  buttonUpload(event) {
    event.preventDefault()
    // Create a hidden file input and trigger it
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.multiple = true
    fileInput.accept = 'image/*,.pdf,.doc,.docx,.txt'

    fileInput.addEventListener('change', (e) => {
      this.#uploadFiles(e.target.files)
    })

    fileInput.click()
  }

  // Invoked by the other controllers (media-library)
  insertAttachments(attachments, event) {
    const editorAttachments = attachments.map((attachment) => {
      const { blob, path, url } = attachment
      const link = this.#markdownLinkFromUrl(blob.filename, path, blob.content_type)

      this.#injectLink(link)
    })

    this.editor?.chain().focus().setAttachment(editorAttachments).run();
  }

  indent(event) {
    event.preventDefault()
    // add a tab before the current cursor position
    const start = this.fieldElementTarget.selectionStart
    const end = this.fieldElementTarget.selectionEnd
    const text = this.fieldElementTarget.value
    const newText = text.slice(0, start) + '\t' + text.slice(start, end) + text.slice(end)
    this.fieldElementTarget.value = newText
    this.fieldElementTarget.selectionStart = start + 1
    this.fieldElementTarget.selectionEnd = end + 1
  }

  #uploadFiles(files) {
    Array.from(files).forEach((file) => this.#uploadFile(file))
  }

  #uploadFile(file) {
    const upload = new DirectUpload(file, this.attachUrlValue)

    upload.create((error, blob) => {
      if (error) {
        console.log('Error', error)
      } else {
        const link = this.#markdownLinkFromUrl(blob.filename, this.#pathFromBlob(blob), blob.content_type)
        this.#injectLink(link)
      }
    })
  }

  #injectLink(link) {
    const start = this.fieldElementTarget.selectionStart
    const end = this.fieldElementTarget.selectionEnd
    this.fieldElementTarget.setRangeText(link, start, end)
  }

  #pathFromBlob(blob) {
    return `/rails/active_storage/blobs/redirect/${blob.signed_id}/${encodeURIComponent(blob.filename)}`
  }

  #markdownLinkFromUrl(filename, url, contentType) {
    const prefix = (this.#isImage(contentType) ? '!' : '')

    return `${prefix}[${filename}](${url})\n`
  }

  #isImage(contentType) {
    return ['image/jpeg', 'image/gif', 'image/png'].includes(contentType)
  }
}
