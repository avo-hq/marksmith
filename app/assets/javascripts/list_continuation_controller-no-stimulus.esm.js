/*!
Marksmith 0.1.3
*/
var ListContinuationController = (function (stimulus) {
  'use strict';

  class list_continuation_controller extends stimulus.Controller {
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

  return list_continuation_controller;

})(FakeStimulus);
