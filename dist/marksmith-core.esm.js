/*!
Marksmith 0.4.7
*/
import '@github/markdown-toolbar-element';
import { Controller } from '@hotwired/stimulus';
import { DirectUpload } from '@rails/activestorage';
import { post } from '@rails/request.js';
import { subscribe } from '@github/paste-markdown';

class Leaf {
    constructor(trie) {
        this.children = [];
        this.parent = trie;
    }
    delete(value) {
        const index = this.children.indexOf(value);
        if (index === -1)
            return false;
        this.children = this.children.slice(0, index).concat(this.children.slice(index + 1));
        if (this.children.length === 0) {
            this.parent.delete(this);
        }
        return true;
    }
    add(value) {
        this.children.push(value);
        return this;
    }
}
class RadixTrie {
    constructor(trie) {
        this.parent = null;
        this.children = {};
        this.parent = trie || null;
    }
    get(edge) {
        return this.children[edge];
    }
    insert(edges) {
        let currentNode = this;
        for (let i = 0; i < edges.length; i += 1) {
            const edge = edges[i];
            let nextNode = currentNode.get(edge);
            if (i === edges.length - 1) {
                if (nextNode instanceof RadixTrie) {
                    currentNode.delete(nextNode);
                    nextNode = null;
                }
                if (!nextNode) {
                    nextNode = new Leaf(currentNode);
                    currentNode.children[edge] = nextNode;
                }
                return nextNode;
            }
            else {
                if (nextNode instanceof Leaf)
                    nextNode = null;
                if (!nextNode) {
                    nextNode = new RadixTrie(currentNode);
                    currentNode.children[edge] = nextNode;
                }
            }
            currentNode = nextNode;
        }
        return currentNode;
    }
    delete(node) {
        for (const edge in this.children) {
            const currentNode = this.children[edge];
            if (currentNode === node) {
                const success = delete this.children[edge];
                if (Object.keys(this.children).length === 0 && this.parent) {
                    this.parent.delete(this);
                }
                return success;
            }
        }
        return false;
    }
}

const macosSymbolLayerKeys = {
    ['¡']: '1',
    ['™']: '2',
    ['£']: '3',
    ['¢']: '4',
    ['∞']: '5',
    ['§']: '6',
    ['¶']: '7',
    ['•']: '8',
    ['ª']: '9',
    ['º']: '0',
    ['–']: '-',
    ['≠']: '=',
    ['⁄']: '!',
    ['€']: '@',
    ['‹']: '#',
    ['›']: '$',
    ['ﬁ']: '%',
    ['ﬂ']: '^',
    ['‡']: '&',
    ['°']: '*',
    ['·']: '(',
    ['‚']: ')',
    ['—']: '_',
    ['±']: '+',
    ['œ']: 'q',
    ['∑']: 'w',
    ['®']: 'r',
    ['†']: 't',
    ['¥']: 'y',
    ['ø']: 'o',
    ['π']: 'p',
    ['“']: '[',
    ['‘']: ']',
    ['«']: '\\',
    ['Œ']: 'Q',
    ['„']: 'W',
    ['´']: 'E',
    ['‰']: 'R',
    ['ˇ']: 'T',
    ['Á']: 'Y',
    ['¨']: 'U',
    ['ˆ']: 'I',
    ['Ø']: 'O',
    ['∏']: 'P',
    ['”']: '{',
    ['’']: '}',
    ['»']: '|',
    ['å']: 'a',
    ['ß']: 's',
    ['∂']: 'd',
    ['ƒ']: 'f',
    ['©']: 'g',
    ['˙']: 'h',
    ['∆']: 'j',
    ['˚']: 'k',
    ['¬']: 'l',
    ['…']: ';',
    ['æ']: "'",
    ['Å']: 'A',
    ['Í']: 'S',
    ['Î']: 'D',
    ['Ï']: 'F',
    ['˝']: 'G',
    ['Ó']: 'H',
    ['Ô']: 'J',
    ['']: 'K',
    ['Ò']: 'L',
    ['Ú']: ':',
    ['Æ']: '"',
    ['Ω']: 'z',
    ['≈']: 'x',
    ['ç']: 'c',
    ['√']: 'v',
    ['∫']: 'b',
    ['µ']: 'm',
    ['≤']: ',',
    ['≥']: '.',
    ['÷']: '/',
    ['¸']: 'Z',
    ['˛']: 'X',
    ['Ç']: 'C',
    ['◊']: 'V',
    ['ı']: 'B',
    ['˜']: 'N',
    ['Â']: 'M',
    ['¯']: '<',
    ['˘']: '>',
    ['¿']: '?'
};

const macosUppercaseLayerKeys = {
    ['`']: '~',
    ['1']: '!',
    ['2']: '@',
    ['3']: '#',
    ['4']: '$',
    ['5']: '%',
    ['6']: '^',
    ['7']: '&',
    ['8']: '*',
    ['9']: '(',
    ['0']: ')',
    ['-']: '_',
    ['=']: '+',
    ['[']: '{',
    [']']: '}',
    ['\\']: '|',
    [';']: ':',
    ["'"]: '"',
    [',']: '<',
    ['.']: '>',
    ['/']: '?',
    ['q']: 'Q',
    ['w']: 'W',
    ['e']: 'E',
    ['r']: 'R',
    ['t']: 'T',
    ['y']: 'Y',
    ['u']: 'U',
    ['i']: 'I',
    ['o']: 'O',
    ['p']: 'P',
    ['a']: 'A',
    ['s']: 'S',
    ['d']: 'D',
    ['f']: 'F',
    ['g']: 'G',
    ['h']: 'H',
    ['j']: 'J',
    ['k']: 'K',
    ['l']: 'L',
    ['z']: 'Z',
    ['x']: 'X',
    ['c']: 'C',
    ['v']: 'V',
    ['b']: 'B',
    ['n']: 'N',
    ['m']: 'M'
};

const syntheticKeyNames = {
    ' ': 'Space',
    '+': 'Plus'
};
function eventToHotkeyString(event, platform = navigator.platform) {
    var _a, _b, _c;
    const { ctrlKey, altKey, metaKey, shiftKey, key } = event;
    const hotkeyString = [];
    const modifiers = [ctrlKey, altKey, metaKey, shiftKey];
    for (const [i, mod] of modifiers.entries()) {
        if (mod)
            hotkeyString.push(modifierKeyNames[i]);
    }
    if (!modifierKeyNames.includes(key)) {
        const altNormalizedKey = hotkeyString.includes('Alt') && matchApplePlatform.test(platform) ? (_a = macosSymbolLayerKeys[key]) !== null && _a !== undefined ? _a : key : key;
        const shiftNormalizedKey = hotkeyString.includes('Shift') && matchApplePlatform.test(platform)
            ? (_b = macosUppercaseLayerKeys[altNormalizedKey]) !== null && _b !== undefined ? _b : altNormalizedKey
            : altNormalizedKey;
        const syntheticKey = (_c = syntheticKeyNames[shiftNormalizedKey]) !== null && _c !== undefined ? _c : shiftNormalizedKey;
        hotkeyString.push(syntheticKey);
    }
    return hotkeyString.join('+');
}
const modifierKeyNames = ['Control', 'Alt', 'Meta', 'Shift'];
function normalizeHotkey(hotkey, platform) {
    let result;
    result = localizeMod(hotkey);
    result = sortModifiers(result);
    return result;
}
const matchApplePlatform = /Mac|iPod|iPhone|iPad/i;
function localizeMod(hotkey, platform) {
    var _a;
    const ssrSafeWindow = typeof window === 'undefined' ? undefined : window;
    const safePlatform = (_a = ssrSafeWindow === null || ssrSafeWindow === undefined ? undefined : ssrSafeWindow.navigator.platform) !== null && _a !== undefined ? _a : '';
    const localModifier = matchApplePlatform.test(safePlatform) ? 'Meta' : 'Control';
    return hotkey.replace('Mod', localModifier);
}
function sortModifiers(hotkey) {
    const key = hotkey.split('+').pop();
    const modifiers = [];
    for (const modifier of ['Control', 'Alt', 'Meta', 'Shift']) {
        if (hotkey.includes(modifier)) {
            modifiers.push(modifier);
        }
    }
    if (key)
        modifiers.push(key);
    return modifiers.join('+');
}

const SEQUENCE_DELIMITER = ' ';
class SequenceTracker {
    constructor({ onReset } = {}) {
        this._path = [];
        this.timer = null;
        this.onReset = onReset;
    }
    get path() {
        return this._path;
    }
    get sequence() {
        return this._path.join(SEQUENCE_DELIMITER);
    }
    registerKeypress(event) {
        this._path = [...this._path, eventToHotkeyString(event)];
        this.startTimer();
    }
    reset() {
        var _a;
        this.killTimer();
        this._path = [];
        (_a = this.onReset) === null || _a === undefined ? undefined : _a.call(this);
    }
    killTimer() {
        if (this.timer != null) {
            window.clearTimeout(this.timer);
        }
        this.timer = null;
    }
    startTimer() {
        this.killTimer();
        this.timer = window.setTimeout(() => this.reset(), SequenceTracker.CHORD_TIMEOUT);
    }
}
SequenceTracker.CHORD_TIMEOUT = 1500;

function isFormField(element) {
    if (!(element instanceof HTMLElement)) {
        return false;
    }
    const name = element.nodeName.toLowerCase();
    const type = (element.getAttribute('type') || '').toLowerCase();
    return (name === 'select' ||
        name === 'textarea' ||
        (name === 'input' &&
            type !== 'submit' &&
            type !== 'reset' &&
            type !== 'checkbox' &&
            type !== 'radio' &&
            type !== 'file') ||
        element.isContentEditable);
}
function fireDeterminedAction(el, path) {
    const delegateEvent = new CustomEvent('hotkey-fire', { cancelable: true, detail: { path } });
    const cancelled = !el.dispatchEvent(delegateEvent);
    if (cancelled)
        return;
    if (isFormField(el)) {
        el.focus();
    }
    else {
        el.click();
    }
}
function expandHotkeyToEdges(hotkey) {
    const output = [];
    let acc = [''];
    let commaIsSeparator = false;
    for (let i = 0; i < hotkey.length; i++) {
        if (commaIsSeparator && hotkey[i] === ',') {
            output.push(acc);
            acc = [''];
            commaIsSeparator = false;
            continue;
        }
        if (hotkey[i] === SEQUENCE_DELIMITER) {
            acc.push('');
            commaIsSeparator = false;
            continue;
        }
        else if (hotkey[i] === '+') {
            commaIsSeparator = false;
        }
        else {
            commaIsSeparator = true;
        }
        acc[acc.length - 1] += hotkey[i];
    }
    output.push(acc);
    return output.map(h => h.map(k => normalizeHotkey(k)).filter(k => k !== '')).filter(h => h.length > 0);
}

const hotkeyRadixTrie = new RadixTrie();
const elementsLeaves = new WeakMap();
let currentTriePosition = hotkeyRadixTrie;
const sequenceTracker = new SequenceTracker({
    onReset() {
        currentTriePosition = hotkeyRadixTrie;
    }
});
function keyDownHandler(event) {
    if (event.defaultPrevented)
        return;
    if (!(event.target instanceof Node))
        return;
    if (isFormField(event.target)) {
        const target = event.target;
        if (!target.id)
            return;
        if (!target.ownerDocument.querySelector(`[data-hotkey-scope="${target.id}"]`))
            return;
    }
    const newTriePosition = currentTriePosition.get(eventToHotkeyString(event));
    if (!newTriePosition) {
        sequenceTracker.reset();
        return;
    }
    sequenceTracker.registerKeypress(event);
    currentTriePosition = newTriePosition;
    if (newTriePosition instanceof Leaf) {
        const target = event.target;
        let shouldFire = false;
        let elementToFire;
        const formField = isFormField(target);
        for (let i = newTriePosition.children.length - 1; i >= 0; i -= 1) {
            elementToFire = newTriePosition.children[i];
            const scope = elementToFire.getAttribute('data-hotkey-scope');
            if ((!formField && !scope) || (formField && target.id === scope)) {
                shouldFire = true;
                break;
            }
        }
        if (elementToFire && shouldFire) {
            fireDeterminedAction(elementToFire, sequenceTracker.path);
            event.preventDefault();
        }
        sequenceTracker.reset();
    }
}
function install(element, hotkey) {
    if (Object.keys(hotkeyRadixTrie.children).length === 0) {
        document.addEventListener('keydown', keyDownHandler);
    }
    const hotkeys = expandHotkeyToEdges(element.getAttribute('data-hotkey') || '');
    const leaves = hotkeys.map(h => hotkeyRadixTrie.insert(h).add(element));
    elementsLeaves.set(element, leaves);
}
function uninstall(element) {
    const leaves = elementsLeaves.get(element);
    if (leaves && leaves.length) {
        for (const leaf of leaves) {
            leaf && leaf.delete(element);
        }
    }
    if (Object.keys(hotkeyRadixTrie.children).length === 0) {
        document.removeEventListener('keydown', keyDownHandler);
    }
}

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

  static targets = ['fieldContainer', 'fieldElement', 'previewPane', 'writeTabButton', 'previewTabButton', 'toolbar']

  activeTabClass = "active"

  get #fileUploadsDisabled() {
    return !this.fileUploadsEnabledValue
  }

  connect() {
    subscribe(this.fieldElementTarget);

    // Install all the hotkeys on the page
    for (const el of document.querySelectorAll('[data-hotkey]')) {
      install(el);
    }
  }

  disconnect() {
    // Uninstall all the hotkeys on the page
    for (const el of document.querySelectorAll('[data-hotkey]')) {
      uninstall(el);
    }
  }

  switchToWrite(event) {
    event.preventDefault();

    // toggle buttons
    this.writeTabButtonTarget.classList.add(this.activeTabClass);
    this.previewTabButtonTarget.classList.remove(this.activeTabClass);

    // toggle write/preview buttons
    this.fieldContainerTarget.classList.remove('ms:hidden');
    this.previewPaneTarget.classList.add('ms:hidden');

    // toggle the toolbar back
    this.toolbarTarget.classList.remove('ms:opacity-0', 'ms:pointer-events-none');
  }

  switchToPreview(event) {
    event.preventDefault();

    // unfocus the active element to hide the outline around the editor
    this.element.focus();
    this.element.blur();
    document.activeElement.blur();

    post(this.previewUrlValue, {
      body: {
        body: this.fieldElementTarget.value,
        element_id: this.previewPaneTarget.id,
        extra_params: this.extraPreviewParamsValue,
      },
      responseKind: 'turbo-stream',
    });

    // set the min height to the field element height
    this.previewPaneTarget.style.minHeight = `${this.fieldElementTarget.offsetHeight}px`;

    // toggle buttons
    this.writeTabButtonTarget.classList.remove(this.activeTabClass);
    this.previewTabButtonTarget.classList.add(this.activeTabClass);

    // toggle elements
    this.fieldContainerTarget.classList.add('ms:hidden');
    this.previewPaneTarget.classList.remove('ms:hidden');

    // toggle the toolbar
    this.toolbarTarget.classList.add('ms:opacity-0', 'ms:pointer-events-none');
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

  indent(event) {
    event.preventDefault();
    // add a tab before the current cursor position
    const start = this.fieldElementTarget.selectionStart;
    const end = this.fieldElementTarget.selectionEnd;
    const text = this.fieldElementTarget.value;
    const newText = text.slice(0, start) + '\t' + text.slice(start, end) + text.slice(end);
    this.fieldElementTarget.value = newText;
    this.fieldElementTarget.selectionStart = start + 1;
    this.fieldElementTarget.selectionEnd = end + 1;
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
    return `/rails/active_storage/blobs/redirect/${blob.signed_id}/${encodeURIComponent(blob.filename)}`
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
