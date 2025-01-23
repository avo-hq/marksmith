/* eslint-disable camelcase */
import '@github/markdown-toolbar-element'
import { Controller } from '@hotwired/stimulus'
import { DirectUpload } from '@rails/activestorage'
import { post } from '@rails/request.js'
import { subscribe } from '@github/paste-markdown'

// upload code from Jeremy Smith's blog post
// https://hybrd.co/posts/github-issue-style-file-uploader-using-stimulus-and-active-storage

// Connects to data-controller="marksmith"
export default class extends Controller {
  static values = {
    attachUrl: String,
    previewUrl: String,
    extraPreviewParams: { type: Object, default: {} },
    fieldId: String,
  }

  static targets = ['fieldContainer', 'fieldElement', 'previewElement', 'writeTabButton', 'previewTabButton', 'toolbar']

  connect() {
    subscribe(this.fieldContainerTarget, { defaultPlainTextPaste: { urlLinks: true } })
  }

  switchToWrite(event) {
    event.preventDefault()

    // toggle buttons
    this.writeTabButtonTarget.classList.add('ms:hidden')
    this.previewTabButtonTarget.classList.remove('ms:hidden')

    // toggle write/preview buttons
    this.fieldContainerTarget.classList.remove('ms:hidden')
    this.previewElementTarget.classList.add('ms:hidden')

    // toggle the toolbar back
    this.toolbarTarget.classList.remove('ms:hidden')
  }

  switchToPreview(event) {
    event.preventDefault()

    post(this.previewUrlValue, {
      body: {
        body: this.fieldElementTarget.value,
        element_id: this.previewElementTarget.id,
        extra_params: this.extraPreviewParamsValue,
      },
      responseKind: 'turbo-stream',
    })

    // set the min height to the field element height
    this.previewElementTarget.style.minHeight = `${this.fieldElementTarget.offsetHeight}px`

    // toggle buttons
    this.writeTabButtonTarget.classList.remove('ms:hidden')
    this.previewTabButtonTarget.classList.add('ms:hidden')

    // toggle elements
    this.fieldContainerTarget.classList.add('ms:hidden')
    this.previewElementTarget.classList.remove('ms:hidden')

    // toggle the toolbar
    this.toolbarTarget.classList.add('ms:hidden')
  }

  dropUpload(event) {
    event.preventDefault()
    this.uploadFiles(event.dataTransfer.files)
  }

  pasteUpload(event) {
    if (!event.clipboardData.files.length) return

    event.preventDefault()
    this.uploadFiles(event.clipboardData.files)
  }

  buttonUpload(event) {
    event.preventDefault()
    // Create a hidden file input and trigger it
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.multiple = true
    fileInput.accept = 'image/*,.pdf,.doc,.docx,.txt'

    fileInput.addEventListener('change', (e) => {
      this.uploadFiles(e.target.files)
    })

    fileInput.click()
  }

  uploadFiles(files) {
    Array.from(files).forEach((file) => this.uploadFile(file))
  }

  uploadFile(file) {
    const upload = new DirectUpload(file, this.attachUrlValue)

    upload.create((error, blob) => {
      if (error) {
        console.log('Error', error)
      } else {
        const text = this.markdownLink(blob)
        const start = this.fieldElementTarget.selectionStart
        const end = this.fieldElementTarget.selectionEnd
        this.fieldElementTarget.setRangeText(text, start, end)
      }
    })
  }

  markdownLink(blob) {
    const { filename } = blob
    const url = `/rails/active_storage/blobs/${blob.signed_id}/${filename}`
    const prefix = (this.isImage(blob.content_type) ? '!' : '')

    return `${prefix}[${filename}](${url})\n`
  }

  isImage(contentType) {
    return ['image/jpeg', 'image/gif', 'image/png'].includes(contentType)
  }
}
