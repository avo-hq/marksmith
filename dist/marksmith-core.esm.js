/*!
Marksmith 0.1.3
*/
import '@github/markdown-toolbar-element';
import { Controller } from '@hotwired/stimulus';
import { DirectUpload } from '@rails/activestorage';
import { post } from '@rails/request.js';
import { subscribe } from '@github/paste-markdown';

/* eslint-disable camelcase */

// upload code from Jeremy Smith's blog post
// https://hybrd.co/posts/github-issue-style-file-uploader-using-stimulus-and-active-storage

// Connects to data-controller="marksmith"
class marksmith_controller extends Controller {
  static values = {
    attachUrl: String,
    previewUrl: String,
    extraPreviewParams: { type: Object, default: {} },
    fieldId: String,
    galleryEnabled: { type: Boolean, default: false },
    galleryOpenPath: String,
    fileUploadsEnabled: { type: Boolean, default: true },
  }

  static targets = ['fieldContainer', 'fieldElement', 'previewElement', 'writeTabButton', 'previewTabButton', 'toolbar']

  get #fileUploadsDisabled() {
    return !this.fileUploadsEnabledValue
  }

  connect() {
    subscribe(this.fieldContainerTarget, { defaultPlainTextPaste: { urlLinks: true } });
  }

  switchToWrite(event) {
    event.preventDefault();

    // toggle buttons
    this.writeTabButtonTarget.classList.add('ms:hidden');
    this.previewTabButtonTarget.classList.remove('ms:hidden');

    // toggle write/preview buttons
    this.fieldContainerTarget.classList.remove('ms:hidden');
    this.previewElementTarget.classList.add('ms:hidden');

    // toggle the toolbar back
    this.toolbarTarget.classList.remove('ms:hidden');
  }

  switchToPreview(event) {
    event.preventDefault();

    post(this.previewUrlValue, {
      body: {
        body: this.fieldElementTarget.value,
        element_id: this.previewElementTarget.id,
        extra_params: this.extraPreviewParamsValue,
      },
      responseKind: 'turbo-stream',
    });

    // set the min height to the field element height
    this.previewElementTarget.style.minHeight = `${this.fieldElementTarget.offsetHeight}px`;

    // toggle buttons
    this.writeTabButtonTarget.classList.remove('ms:hidden');
    this.previewTabButtonTarget.classList.add('ms:hidden');

    // toggle elements
    this.fieldContainerTarget.classList.add('ms:hidden');
    this.previewElementTarget.classList.remove('ms:hidden');

    // toggle the toolbar
    this.toolbarTarget.classList.add('ms:hidden');
  }

  dropUpload(event) {
    if (this.#fileUploadsDisabled) return

    event.preventDefault();
    this.#uploadFiles(event.dataTransfer.files);
  }

  pasteUpload(event) {
    if (this.#fileUploadsDisabled) return

    if (!event.clipboardData.files.length) return

    event.preventDefault();
    this.#uploadFiles(event.clipboardData.files);
  }

  buttonUpload(event) {
    event.preventDefault();
    // Create a hidden file input and trigger it
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.accept = 'image/*,.pdf,.doc,.docx,.txt';

    fileInput.addEventListener('change', (e) => {
      this.#uploadFiles(e.target.files);
    });

    fileInput.click();
  }

  // Invoked by the other controllers (media-library)
  insertAttachments(attachments, event) {
    const editorAttachments = attachments.map((attachment) => {
      const { blob, path, url } = attachment;
      const link = this.#markdownLinkFromUrl(blob.filename, path, blob.content_type);

      this.#injectLink(link);
    });

    this.editor?.chain().focus().setAttachment(editorAttachments).run();
  }

  #uploadFiles(files) {
    Array.from(files).forEach((file) => this.#uploadFile(file));
  }

  #uploadFile(file) {
    const upload = new DirectUpload(file, this.attachUrlValue);

    upload.create((error, blob) => {
      if (error) {
        console.log('Error', error);
      } else {
        const link = this.#markdownLinkFromUrl(blob.filename, this.#pathFromBlob(blob), blob.content_type);
        this.#injectLink(link);
      }
    });
  }

  #injectLink(link) {
    const start = this.fieldElementTarget.selectionStart;
    const end = this.fieldElementTarget.selectionEnd;
    this.fieldElementTarget.setRangeText(link, start, end);
  }

  #pathFromBlob(blob) {
    return `/rails/active_storage/blobs/redirect/${blob.signed_id}/${blob.filename}`
  }

  #markdownLinkFromUrl(filename, url, contentType) {
    const prefix = (this.#isImage(contentType) ? '!' : '');

    return `${prefix}[${filename}](${url})\n`
  }

  #isImage(contentType) {
    return ['image/jpeg', 'image/gif', 'image/png'].includes(contentType)
  }
}

class list_continuation_controller extends Controller {
  connect() {
    this.isInsertLineBreak = false;
    this.isProcessing = false;  // Guard flag to prevent recursion

    this.SPACE_PATTERN = /^(\s*)?/;
    this.LIST_PATTERN = /^(\s*)([*-]|(\d+)\.)\s(\[[\sx]\]\s)?/;
  }

  handleBeforeInput(event) {
    if (this.isProcessing) return
    this.isInsertLineBreak = event.inputType === 'insertLineBreak';
  }

  handleInput(event) {
    if (this.isProcessing) return
    if (this.isInsertLineBreak || event.inputType === 'insertLineBreak') {
      this.handleListContinuation(event.target);
      this.isInsertLineBreak = false;
    }
  }

  handleListContinuation(textarea) {
    if (this.isProcessing) return

    const result = this.analyzeCurrentLine(
      textarea.value,
      [textarea.selectionStart, textarea.selectionEnd],
    );

    if (result !== undefined) {
      this.isProcessing = true;
      try {
        this.applyTextChange(textarea, result);
      } finally {
        // Ensure we always reset the processing flag
        setTimeout(() => {
          this.isProcessing = false;
        }, 0);
      }
    }
  }

  analyzeCurrentLine(text, [cursorPosition]) {
    if (!cursorPosition || !text) return

    // Get all lines up to cursor
    const lines = text.substring(0, cursorPosition).split('\n');
    const previousLine = lines[lines.length - 2];

    // If no previous line or doesn't match list pattern, do nothing
    const match = previousLine?.match(this.LIST_PATTERN);
    if (!match) return

    const [fullMatch, indentation, listMarker, number, checkbox] = match;

    // Check if previous line was empty (just list marker)
    const previousContent = previousLine.replace(fullMatch, '').trim();
    if (previousContent.length === 0) {
      // Terminate the list by removing the marker
      const start = cursorPosition - `\n${fullMatch}`.length;

      return {
        text: text.substring(0, start) + text.substring(cursorPosition),
        selection: [start, start],
        operation: 'delete',
      }
    }

    // For numbered lists, increment the number
    const newMarker = number ? `${parseInt(number, 10) + 1}.` : listMarker;

    // Maintain checkbox if it was present
    const prefix = `${indentation}${newMarker} ${checkbox ? '[ ] ' : ''}`;

    // Continue the list with the same indentation and style
    return {
      text: text.substring(0, cursorPosition) + prefix + text.substring(cursorPosition),
      selection: [cursorPosition + prefix.length, cursorPosition + prefix.length],
      operation: 'insert',
    }
  }

  applyTextChange(textarea, { text, selection }) {
    // Set new value directly
    textarea.value = text;
    // Set the cursor position
    const [start, end] = selection;
    textarea.selectionStart = start;
    textarea.selectionEnd = end;
  }
}

export { list_continuation_controller as ListContinuationController, marksmith_controller as MarksmithController };
