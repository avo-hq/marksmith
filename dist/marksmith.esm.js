/*!
Marksmith 0.4.7
*/
var __classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _MarkdownHeaderButtonElement_instances, _MarkdownHeaderButtonElement_setLevelStyle;
const buttonSelectors = [
    '[data-md-button]',
    'md-header',
    'md-bold',
    'md-italic',
    'md-quote',
    'md-code',
    'md-link',
    'md-image',
    'md-unordered-list',
    'md-ordered-list',
    'md-task-list',
    'md-mention',
    'md-ref',
    'md-strikethrough'
];
function getButtons(toolbar) {
    const els = [];
    for (const button of toolbar.querySelectorAll(buttonSelectors.join(', '))) {
        if (button.hidden || (button.offsetWidth <= 0 && button.offsetHeight <= 0))
            continue;
        if (button.closest('markdown-toolbar') === toolbar)
            els.push(button);
    }
    return els;
}
function keydown(fn) {
    return function (event) {
        if (event.key === ' ' || event.key === 'Enter') {
            fn(event);
        }
    };
}
const styles = new WeakMap();
const manualStyles = {
    'header-1': { prefix: '# ' },
    'header-2': { prefix: '## ' },
    'header-3': { prefix: '### ' },
    'header-4': { prefix: '#### ' },
    'header-5': { prefix: '##### ' },
    'header-6': { prefix: '###### ' },
    bold: { prefix: '**', suffix: '**', trimFirst: true },
    italic: { prefix: '_', suffix: '_', trimFirst: true },
    quote: { prefix: '> ', multiline: true, surroundWithNewlines: true },
    code: {
        prefix: '`',
        suffix: '`',
        blockPrefix: '```',
        blockSuffix: '```'
    },
    link: { prefix: '[', suffix: '](url)', replaceNext: 'url', scanFor: 'https?://' },
    image: { prefix: '![', suffix: '](url)', replaceNext: 'url', scanFor: 'https?://' },
    'unordered-list': {
        prefix: '- ',
        multiline: true,
        unorderedList: true
    },
    'ordered-list': {
        prefix: '1. ',
        multiline: true,
        orderedList: true
    },
    'task-list': { prefix: '- [ ] ', multiline: true, surroundWithNewlines: true },
    mention: { prefix: '@', prefixSpace: true },
    ref: { prefix: '#', prefixSpace: true },
    strikethrough: { prefix: '~~', suffix: '~~', trimFirst: true }
};
class MarkdownButtonElement extends HTMLElement {
    constructor() {
        super();
        const apply = (event) => {
            const style = styles.get(this);
            if (!style)
                return;
            event.preventDefault();
            applyStyle(this, style);
        };
        this.addEventListener('keydown', keydown(apply));
        this.addEventListener('click', apply);
    }
    connectedCallback() {
        if (!this.hasAttribute('role')) {
            this.setAttribute('role', 'button');
        }
    }
    click() {
        const style = styles.get(this);
        if (!style)
            return;
        applyStyle(this, style);
    }
}
class MarkdownHeaderButtonElement extends MarkdownButtonElement {
    constructor() {
        super(...arguments);
        _MarkdownHeaderButtonElement_instances.add(this);
    }
    connectedCallback() {
        const level = parseInt(this.getAttribute('level') || '3', 10);
        __classPrivateFieldGet(this, _MarkdownHeaderButtonElement_instances, "m", _MarkdownHeaderButtonElement_setLevelStyle).call(this, level);
    }
    static get observedAttributes() {
        return ['level'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name !== 'level')
            return;
        const level = parseInt(newValue || '3', 10);
        __classPrivateFieldGet(this, _MarkdownHeaderButtonElement_instances, "m", _MarkdownHeaderButtonElement_setLevelStyle).call(this, level);
    }
}
_MarkdownHeaderButtonElement_instances = new WeakSet(), _MarkdownHeaderButtonElement_setLevelStyle = function _MarkdownHeaderButtonElement_setLevelStyle(level) {
    if (level < 1 || level > 6) {
        return;
    }
    const prefix = `${'#'.repeat(level)} `;
    styles.set(this, {
        prefix
    });
};
if (!window.customElements.get('md-header')) {
    window.MarkdownHeaderButtonElement = MarkdownHeaderButtonElement;
    window.customElements.define('md-header', MarkdownHeaderButtonElement);
}
class MarkdownBoldButtonElement extends MarkdownButtonElement {
    connectedCallback() {
        styles.set(this, { prefix: '**', suffix: '**', trimFirst: true });
    }
}
if (!window.customElements.get('md-bold')) {
    window.MarkdownBoldButtonElement = MarkdownBoldButtonElement;
    window.customElements.define('md-bold', MarkdownBoldButtonElement);
}
class MarkdownItalicButtonElement extends MarkdownButtonElement {
    connectedCallback() {
        styles.set(this, { prefix: '_', suffix: '_', trimFirst: true });
    }
}
if (!window.customElements.get('md-italic')) {
    window.MarkdownItalicButtonElement = MarkdownItalicButtonElement;
    window.customElements.define('md-italic', MarkdownItalicButtonElement);
}
class MarkdownQuoteButtonElement extends MarkdownButtonElement {
    connectedCallback() {
        styles.set(this, { prefix: '> ', multiline: true, surroundWithNewlines: true });
    }
}
if (!window.customElements.get('md-quote')) {
    window.MarkdownQuoteButtonElement = MarkdownQuoteButtonElement;
    window.customElements.define('md-quote', MarkdownQuoteButtonElement);
}
class MarkdownCodeButtonElement extends MarkdownButtonElement {
    connectedCallback() {
        styles.set(this, { prefix: '`', suffix: '`', blockPrefix: '```', blockSuffix: '```' });
    }
}
if (!window.customElements.get('md-code')) {
    window.MarkdownCodeButtonElement = MarkdownCodeButtonElement;
    window.customElements.define('md-code', MarkdownCodeButtonElement);
}
class MarkdownLinkButtonElement extends MarkdownButtonElement {
    connectedCallback() {
        styles.set(this, { prefix: '[', suffix: '](url)', replaceNext: 'url', scanFor: 'https?://' });
    }
}
if (!window.customElements.get('md-link')) {
    window.MarkdownLinkButtonElement = MarkdownLinkButtonElement;
    window.customElements.define('md-link', MarkdownLinkButtonElement);
}
class MarkdownImageButtonElement extends MarkdownButtonElement {
    connectedCallback() {
        styles.set(this, { prefix: '![', suffix: '](url)', replaceNext: 'url', scanFor: 'https?://' });
    }
}
if (!window.customElements.get('md-image')) {
    window.MarkdownImageButtonElement = MarkdownImageButtonElement;
    window.customElements.define('md-image', MarkdownImageButtonElement);
}
class MarkdownUnorderedListButtonElement extends MarkdownButtonElement {
    connectedCallback() {
        styles.set(this, { prefix: '- ', multiline: true, unorderedList: true });
    }
}
if (!window.customElements.get('md-unordered-list')) {
    window.MarkdownUnorderedListButtonElement = MarkdownUnorderedListButtonElement;
    window.customElements.define('md-unordered-list', MarkdownUnorderedListButtonElement);
}
class MarkdownOrderedListButtonElement extends MarkdownButtonElement {
    connectedCallback() {
        styles.set(this, { prefix: '1. ', multiline: true, orderedList: true });
    }
}
if (!window.customElements.get('md-ordered-list')) {
    window.MarkdownOrderedListButtonElement = MarkdownOrderedListButtonElement;
    window.customElements.define('md-ordered-list', MarkdownOrderedListButtonElement);
}
class MarkdownTaskListButtonElement extends MarkdownButtonElement {
    connectedCallback() {
        styles.set(this, { prefix: '- [ ] ', multiline: true, surroundWithNewlines: true });
    }
}
if (!window.customElements.get('md-task-list')) {
    window.MarkdownTaskListButtonElement = MarkdownTaskListButtonElement;
    window.customElements.define('md-task-list', MarkdownTaskListButtonElement);
}
class MarkdownMentionButtonElement extends MarkdownButtonElement {
    connectedCallback() {
        styles.set(this, { prefix: '@', prefixSpace: true });
    }
}
if (!window.customElements.get('md-mention')) {
    window.MarkdownMentionButtonElement = MarkdownMentionButtonElement;
    window.customElements.define('md-mention', MarkdownMentionButtonElement);
}
class MarkdownRefButtonElement extends MarkdownButtonElement {
    connectedCallback() {
        styles.set(this, { prefix: '#', prefixSpace: true });
    }
}
if (!window.customElements.get('md-ref')) {
    window.MarkdownRefButtonElement = MarkdownRefButtonElement;
    window.customElements.define('md-ref', MarkdownRefButtonElement);
}
class MarkdownStrikethroughButtonElement extends MarkdownButtonElement {
    connectedCallback() {
        styles.set(this, { prefix: '~~', suffix: '~~', trimFirst: true });
    }
}
if (!window.customElements.get('md-strikethrough')) {
    window.MarkdownStrikethroughButtonElement = MarkdownStrikethroughButtonElement;
    window.customElements.define('md-strikethrough', MarkdownStrikethroughButtonElement);
}
function applyFromToolbar(event) {
    const { target, currentTarget } = event;
    if (!(target instanceof Element))
        return;
    const mdButton = target.closest('[data-md-button]');
    if (!mdButton || mdButton.closest('markdown-toolbar') !== currentTarget)
        return;
    const mdButtonStyle = mdButton.getAttribute('data-md-button');
    const style = manualStyles[mdButtonStyle];
    if (!style)
        return;
    event.preventDefault();
    applyStyle(target, style);
}
function setFocusManagement(toolbar) {
    toolbar.addEventListener('keydown', focusKeydown);
    toolbar.setAttribute('tabindex', '0');
    toolbar.addEventListener('focus', onToolbarFocus, { once: true });
}
function unsetFocusManagement(toolbar) {
    toolbar.removeEventListener('keydown', focusKeydown);
    toolbar.removeAttribute('tabindex');
    toolbar.removeEventListener('focus', onToolbarFocus);
}
class MarkdownToolbarElement extends HTMLElement {
    connectedCallback() {
        if (!this.hasAttribute('role')) {
            this.setAttribute('role', 'toolbar');
        }
        if (!this.hasAttribute('data-no-focus')) {
            setFocusManagement(this);
        }
        this.addEventListener('keydown', keydown(applyFromToolbar));
        this.addEventListener('click', applyFromToolbar);
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name !== 'data-no-focus')
            return;
        if (newValue === null) {
            setFocusManagement(this);
        }
        else {
            unsetFocusManagement(this);
        }
    }
    disconnectedCallback() {
        unsetFocusManagement(this);
    }
    get field() {
        const id = this.getAttribute('for');
        if (!id)
            return null;
        const root = 'getRootNode' in this ? this.getRootNode() : document;
        let field;
        if (root instanceof Document || root instanceof ShadowRoot) {
            field = root.getElementById(id);
        }
        return field instanceof HTMLTextAreaElement ? field : null;
    }
}
MarkdownToolbarElement.observedAttributes = ['data-no-focus'];
function onToolbarFocus({ target }) {
    if (!(target instanceof Element))
        return;
    target.removeAttribute('tabindex');
    let tabindex = '0';
    for (const button of getButtons(target)) {
        button.setAttribute('tabindex', tabindex);
        if (tabindex === '0') {
            button.focus();
            tabindex = '-1';
        }
    }
}
function focusKeydown(event) {
    const key = event.key;
    if (key !== 'ArrowRight' && key !== 'ArrowLeft' && key !== 'Home' && key !== 'End')
        return;
    const toolbar = event.currentTarget;
    if (!(toolbar instanceof HTMLElement))
        return;
    const buttons = getButtons(toolbar);
    const index = buttons.indexOf(event.target);
    const length = buttons.length;
    if (index === -1)
        return;
    let n = 0;
    if (key === 'ArrowLeft')
        n = index - 1;
    if (key === 'ArrowRight')
        n = index + 1;
    if (key === 'End')
        n = length - 1;
    if (n < 0)
        n = length - 1;
    if (n > length - 1)
        n = 0;
    for (let i = 0; i < length; i += 1) {
        buttons[i].setAttribute('tabindex', i === n ? '0' : '-1');
    }
    event.preventDefault();
    buttons[n].focus();
}
if (!window.customElements.get('markdown-toolbar')) {
    window.MarkdownToolbarElement = MarkdownToolbarElement;
    window.customElements.define('markdown-toolbar', MarkdownToolbarElement);
}
function isMultipleLines(string) {
    return string.trim().split('\n').length > 1;
}
function repeat(string, n) {
    return Array(n + 1).join(string);
}
function wordSelectionStart(text, i) {
    let index = i;
    while (text[index] && text[index - 1] != null && !text[index - 1].match(/\s/)) {
        index--;
    }
    return index;
}
function wordSelectionEnd(text, i, multiline) {
    let index = i;
    const breakpoint = multiline ? /\n/ : /\s/;
    while (text[index] && !text[index].match(breakpoint)) {
        index++;
    }
    return index;
}
let canInsertText = null;
function insertText$1(textarea, { text, selectionStart, selectionEnd }) {
    const originalSelectionStart = textarea.selectionStart;
    const before = textarea.value.slice(0, originalSelectionStart);
    const after = textarea.value.slice(textarea.selectionEnd);
    if (canInsertText === null || canInsertText === true) {
        textarea.contentEditable = 'true';
        try {
            canInsertText = document.execCommand('insertText', false, text);
        }
        catch (error) {
            canInsertText = false;
        }
        textarea.contentEditable = 'false';
    }
    if (canInsertText && !textarea.value.slice(0, textarea.selectionStart).endsWith(text)) {
        canInsertText = false;
    }
    if (!canInsertText) {
        try {
            document.execCommand('ms-beginUndoUnit');
        }
        catch (e) {
        }
        textarea.value = before + text + after;
        try {
            document.execCommand('ms-endUndoUnit');
        }
        catch (e) {
        }
        textarea.dispatchEvent(new CustomEvent('input', { bubbles: true, cancelable: true }));
    }
    if (selectionStart != null && selectionEnd != null) {
        textarea.setSelectionRange(selectionStart, selectionEnd);
    }
    else {
        textarea.setSelectionRange(originalSelectionStart, textarea.selectionEnd);
    }
}
function styleSelectedText(textarea, styleArgs) {
    const text = textarea.value.slice(textarea.selectionStart, textarea.selectionEnd);
    let result;
    if (styleArgs.orderedList || styleArgs.unorderedList) {
        result = listStyle(textarea, styleArgs);
    }
    else if (styleArgs.multiline && isMultipleLines(text)) {
        result = multilineStyle(textarea, styleArgs);
    }
    else {
        result = blockStyle(textarea, styleArgs);
    }
    insertText$1(textarea, result);
}
function expandSelectionToLine(textarea) {
    const lines = textarea.value.split('\n');
    let counter = 0;
    for (let index = 0; index < lines.length; index++) {
        const lineLength = lines[index].length + 1;
        if (textarea.selectionStart >= counter && textarea.selectionStart < counter + lineLength) {
            textarea.selectionStart = counter;
        }
        if (textarea.selectionEnd >= counter && textarea.selectionEnd < counter + lineLength) {
            textarea.selectionEnd = counter + lineLength - 1;
        }
        counter += lineLength;
    }
}
function expandSelectedText(textarea, prefixToUse, suffixToUse, multiline = false) {
    if (textarea.selectionStart === textarea.selectionEnd) {
        textarea.selectionStart = wordSelectionStart(textarea.value, textarea.selectionStart);
        textarea.selectionEnd = wordSelectionEnd(textarea.value, textarea.selectionEnd, multiline);
    }
    else {
        const expandedSelectionStart = textarea.selectionStart - prefixToUse.length;
        const expandedSelectionEnd = textarea.selectionEnd + suffixToUse.length;
        const beginsWithPrefix = textarea.value.slice(expandedSelectionStart, textarea.selectionStart) === prefixToUse;
        const endsWithSuffix = textarea.value.slice(textarea.selectionEnd, expandedSelectionEnd) === suffixToUse;
        if (beginsWithPrefix && endsWithSuffix) {
            textarea.selectionStart = expandedSelectionStart;
            textarea.selectionEnd = expandedSelectionEnd;
        }
    }
    return textarea.value.slice(textarea.selectionStart, textarea.selectionEnd);
}
function newlinesToSurroundSelectedText(textarea) {
    const beforeSelection = textarea.value.slice(0, textarea.selectionStart);
    const afterSelection = textarea.value.slice(textarea.selectionEnd);
    const breaksBefore = beforeSelection.match(/\n*$/);
    const breaksAfter = afterSelection.match(/^\n*/);
    const newlinesBeforeSelection = breaksBefore ? breaksBefore[0].length : 0;
    const newlinesAfterSelection = breaksAfter ? breaksAfter[0].length : 0;
    let newlinesToAppend;
    let newlinesToPrepend;
    if (beforeSelection.match(/\S/) && newlinesBeforeSelection < 2) {
        newlinesToAppend = repeat('\n', 2 - newlinesBeforeSelection);
    }
    if (afterSelection.match(/\S/) && newlinesAfterSelection < 2) {
        newlinesToPrepend = repeat('\n', 2 - newlinesAfterSelection);
    }
    if (newlinesToAppend == null) {
        newlinesToAppend = '';
    }
    if (newlinesToPrepend == null) {
        newlinesToPrepend = '';
    }
    return { newlinesToAppend, newlinesToPrepend };
}
function blockStyle(textarea, arg) {
    let newlinesToAppend;
    let newlinesToPrepend;
    const { prefix, suffix, blockPrefix, blockSuffix, replaceNext, prefixSpace, scanFor, surroundWithNewlines } = arg;
    const originalSelectionStart = textarea.selectionStart;
    const originalSelectionEnd = textarea.selectionEnd;
    let selectedText = textarea.value.slice(textarea.selectionStart, textarea.selectionEnd);
    let prefixToUse = isMultipleLines(selectedText) && blockPrefix.length > 0 ? `${blockPrefix}\n` : prefix;
    let suffixToUse = isMultipleLines(selectedText) && blockSuffix.length > 0 ? `\n${blockSuffix}` : suffix;
    if (prefixSpace) {
        const beforeSelection = textarea.value[textarea.selectionStart - 1];
        if (textarea.selectionStart !== 0 && beforeSelection != null && !beforeSelection.match(/\s/)) {
            prefixToUse = ` ${prefixToUse}`;
        }
    }
    selectedText = expandSelectedText(textarea, prefixToUse, suffixToUse, arg.multiline);
    let selectionStart = textarea.selectionStart;
    let selectionEnd = textarea.selectionEnd;
    const hasReplaceNext = replaceNext.length > 0 && suffixToUse.indexOf(replaceNext) > -1 && selectedText.length > 0;
    if (surroundWithNewlines) {
        const ref = newlinesToSurroundSelectedText(textarea);
        newlinesToAppend = ref.newlinesToAppend;
        newlinesToPrepend = ref.newlinesToPrepend;
        prefixToUse = newlinesToAppend + prefix;
        suffixToUse += newlinesToPrepend;
    }
    if (selectedText.startsWith(prefixToUse) && selectedText.endsWith(suffixToUse)) {
        const replacementText = selectedText.slice(prefixToUse.length, selectedText.length - suffixToUse.length);
        if (originalSelectionStart === originalSelectionEnd) {
            let position = originalSelectionStart - prefixToUse.length;
            position = Math.max(position, selectionStart);
            position = Math.min(position, selectionStart + replacementText.length);
            selectionStart = selectionEnd = position;
        }
        else {
            selectionEnd = selectionStart + replacementText.length;
        }
        return { text: replacementText, selectionStart, selectionEnd };
    }
    else if (!hasReplaceNext) {
        let replacementText = prefixToUse + selectedText + suffixToUse;
        selectionStart = originalSelectionStart + prefixToUse.length;
        selectionEnd = originalSelectionEnd + prefixToUse.length;
        const whitespaceEdges = selectedText.match(/^\s*|\s*$/g);
        if (arg.trimFirst && whitespaceEdges) {
            const leadingWhitespace = whitespaceEdges[0] || '';
            const trailingWhitespace = whitespaceEdges[1] || '';
            replacementText = leadingWhitespace + prefixToUse + selectedText.trim() + suffixToUse + trailingWhitespace;
            selectionStart += leadingWhitespace.length;
            selectionEnd -= trailingWhitespace.length;
        }
        return { text: replacementText, selectionStart, selectionEnd };
    }
    else if (scanFor.length > 0 && selectedText.match(scanFor)) {
        suffixToUse = suffixToUse.replace(replaceNext, selectedText);
        const replacementText = prefixToUse + suffixToUse;
        selectionStart = selectionEnd = selectionStart + prefixToUse.length;
        return { text: replacementText, selectionStart, selectionEnd };
    }
    else {
        const replacementText = prefixToUse + selectedText + suffixToUse;
        selectionStart = selectionStart + prefixToUse.length + selectedText.length + suffixToUse.indexOf(replaceNext);
        selectionEnd = selectionStart + replaceNext.length;
        return { text: replacementText, selectionStart, selectionEnd };
    }
}
function multilineStyle(textarea, arg) {
    const { prefix, suffix, surroundWithNewlines } = arg;
    let text = textarea.value.slice(textarea.selectionStart, textarea.selectionEnd);
    let selectionStart = textarea.selectionStart;
    let selectionEnd = textarea.selectionEnd;
    const lines = text.split('\n');
    const undoStyle = lines.every(line => line.startsWith(prefix) && line.endsWith(suffix));
    if (undoStyle) {
        text = lines.map(line => line.slice(prefix.length, line.length - suffix.length)).join('\n');
        selectionEnd = selectionStart + text.length;
    }
    else {
        text = lines.map(line => prefix + line + suffix).join('\n');
        if (surroundWithNewlines) {
            const { newlinesToAppend, newlinesToPrepend } = newlinesToSurroundSelectedText(textarea);
            selectionStart += newlinesToAppend.length;
            selectionEnd = selectionStart + text.length;
            text = newlinesToAppend + text + newlinesToPrepend;
        }
    }
    return { text, selectionStart, selectionEnd };
}
function undoOrderedListStyle(text) {
    const lines = text.split('\n');
    const orderedListRegex = /^\d+\.\s+/;
    const shouldUndoOrderedList = lines.every(line => orderedListRegex.test(line));
    let result = lines;
    if (shouldUndoOrderedList) {
        result = lines.map(line => line.replace(orderedListRegex, ''));
    }
    return {
        text: result.join('\n'),
        processed: shouldUndoOrderedList
    };
}
function undoUnorderedListStyle(text) {
    const lines = text.split('\n');
    const unorderedListPrefix = '- ';
    const shouldUndoUnorderedList = lines.every(line => line.startsWith(unorderedListPrefix));
    let result = lines;
    if (shouldUndoUnorderedList) {
        result = lines.map(line => line.slice(unorderedListPrefix.length, line.length));
    }
    return {
        text: result.join('\n'),
        processed: shouldUndoUnorderedList
    };
}
function makePrefix(index, unorderedList) {
    if (unorderedList) {
        return '- ';
    }
    else {
        return `${index + 1}. `;
    }
}
function clearExistingListStyle(style, selectedText) {
    let undoResultOpositeList;
    let undoResult;
    let pristineText;
    if (style.orderedList) {
        undoResult = undoOrderedListStyle(selectedText);
        undoResultOpositeList = undoUnorderedListStyle(undoResult.text);
        pristineText = undoResultOpositeList.text;
    }
    else {
        undoResult = undoUnorderedListStyle(selectedText);
        undoResultOpositeList = undoOrderedListStyle(undoResult.text);
        pristineText = undoResultOpositeList.text;
    }
    return [undoResult, undoResultOpositeList, pristineText];
}
function listStyle(textarea, style) {
    const noInitialSelection = textarea.selectionStart === textarea.selectionEnd;
    let selectionStart = textarea.selectionStart;
    let selectionEnd = textarea.selectionEnd;
    expandSelectionToLine(textarea);
    const selectedText = textarea.value.slice(textarea.selectionStart, textarea.selectionEnd);
    const [undoResult, undoResultOpositeList, pristineText] = clearExistingListStyle(style, selectedText);
    const prefixedLines = pristineText.split('\n').map((value, index) => {
        return `${makePrefix(index, style.unorderedList)}${value}`;
    });
    const totalPrefixLength = prefixedLines.reduce((previousValue, _currentValue, currentIndex) => {
        return previousValue + makePrefix(currentIndex, style.unorderedList).length;
    }, 0);
    const totalPrefixLengthOpositeList = prefixedLines.reduce((previousValue, _currentValue, currentIndex) => {
        return previousValue + makePrefix(currentIndex, !style.unorderedList).length;
    }, 0);
    if (undoResult.processed) {
        if (noInitialSelection) {
            selectionStart = Math.max(selectionStart - makePrefix(0, style.unorderedList).length, 0);
            selectionEnd = selectionStart;
        }
        else {
            selectionStart = textarea.selectionStart;
            selectionEnd = textarea.selectionEnd - totalPrefixLength;
        }
        return { text: pristineText, selectionStart, selectionEnd };
    }
    const { newlinesToAppend, newlinesToPrepend } = newlinesToSurroundSelectedText(textarea);
    const text = newlinesToAppend + prefixedLines.join('\n') + newlinesToPrepend;
    if (noInitialSelection) {
        selectionStart = Math.max(selectionStart + makePrefix(0, style.unorderedList).length + newlinesToAppend.length, 0);
        selectionEnd = selectionStart;
    }
    else {
        if (undoResultOpositeList.processed) {
            selectionStart = Math.max(textarea.selectionStart + newlinesToAppend.length, 0);
            selectionEnd = textarea.selectionEnd + newlinesToAppend.length + totalPrefixLength - totalPrefixLengthOpositeList;
        }
        else {
            selectionStart = Math.max(textarea.selectionStart + newlinesToAppend.length, 0);
            selectionEnd = textarea.selectionEnd + newlinesToAppend.length + totalPrefixLength;
        }
    }
    return { text, selectionStart, selectionEnd };
}
function applyStyle(button, stylesToApply) {
    const toolbar = button.closest('markdown-toolbar');
    if (!(toolbar instanceof MarkdownToolbarElement))
        return;
    const defaults = {
        prefix: '',
        suffix: '',
        blockPrefix: '',
        blockSuffix: '',
        multiline: false,
        replaceNext: '',
        prefixSpace: false,
        scanFor: '',
        surroundWithNewlines: false,
        orderedList: false,
        unorderedList: false,
        trimFirst: false
    };
    const style = Object.assign(Object.assign({}, defaults), stylesToApply);
    const field = toolbar.field;
    if (field) {
        field.focus();
        styleSelectedText(field, style);
    }
}

/*
Stimulus 3.2.1
Copyright © 2023 Basecamp, LLC
 */

function camelize(value) {
    return value.replace(/(?:[_-])([a-z0-9])/g, (_, char) => char.toUpperCase());
}
function namespaceCamelize(value) {
    return camelize(value.replace(/--/g, "-").replace(/__/g, "_"));
}
function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}
function dasherize(value) {
    return value.replace(/([A-Z])/g, (_, char) => `-${char.toLowerCase()}`);
}

function isSomething(object) {
    return object !== null && object !== undefined;
}
function hasProperty(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
}

function readInheritableStaticArrayValues(constructor, propertyName) {
    const ancestors = getAncestorsForConstructor(constructor);
    return Array.from(ancestors.reduce((values, constructor) => {
        getOwnStaticArrayValues(constructor, propertyName).forEach((name) => values.add(name));
        return values;
    }, new Set()));
}
function readInheritableStaticObjectPairs(constructor, propertyName) {
    const ancestors = getAncestorsForConstructor(constructor);
    return ancestors.reduce((pairs, constructor) => {
        pairs.push(...getOwnStaticObjectPairs(constructor, propertyName));
        return pairs;
    }, []);
}
function getAncestorsForConstructor(constructor) {
    const ancestors = [];
    while (constructor) {
        ancestors.push(constructor);
        constructor = Object.getPrototypeOf(constructor);
    }
    return ancestors.reverse();
}
function getOwnStaticArrayValues(constructor, propertyName) {
    const definition = constructor[propertyName];
    return Array.isArray(definition) ? definition : [];
}
function getOwnStaticObjectPairs(constructor, propertyName) {
    const definition = constructor[propertyName];
    return definition ? Object.keys(definition).map((key) => [key, definition[key]]) : [];
}
(() => {
    function extendWithReflect(constructor) {
        function extended() {
            return Reflect.construct(constructor, arguments, new.target);
        }
        extended.prototype = Object.create(constructor.prototype, {
            constructor: { value: extended },
        });
        Reflect.setPrototypeOf(extended, constructor);
        return extended;
    }
    function testReflectExtension() {
        const a = function () {
            this.a.call(this);
        };
        const b = extendWithReflect(a);
        b.prototype.a = function () { };
        return new b();
    }
    try {
        testReflectExtension();
        return extendWithReflect;
    }
    catch (error) {
        return (constructor) => class extended extends constructor {
        };
    }
})();

({
    controllerAttribute: "data-controller",
    actionAttribute: "data-action",
    targetAttribute: "data-target",
    targetAttributeForScope: (identifier) => `data-${identifier}-target`,
    outletAttributeForScope: (identifier, outlet) => `data-${identifier}-${outlet}-outlet`,
    keyMappings: Object.assign(Object.assign({ enter: "Enter", tab: "Tab", esc: "Escape", space: " ", up: "ArrowUp", down: "ArrowDown", left: "ArrowLeft", right: "ArrowRight", home: "Home", end: "End", page_up: "PageUp", page_down: "PageDown" }, objectFromEntries("abcdefghijklmnopqrstuvwxyz".split("").map((c) => [c, c]))), objectFromEntries("0123456789".split("").map((n) => [n, n]))),
});
function objectFromEntries(array) {
    return array.reduce((memo, [k, v]) => (Object.assign(Object.assign({}, memo), { [k]: v })), {});
}

function ClassPropertiesBlessing(constructor) {
    const classes = readInheritableStaticArrayValues(constructor, "classes");
    return classes.reduce((properties, classDefinition) => {
        return Object.assign(properties, propertiesForClassDefinition(classDefinition));
    }, {});
}
function propertiesForClassDefinition(key) {
    return {
        [`${key}Class`]: {
            get() {
                const { classes } = this;
                if (classes.has(key)) {
                    return classes.get(key);
                }
                else {
                    const attribute = classes.getAttributeName(key);
                    throw new Error(`Missing attribute "${attribute}"`);
                }
            },
        },
        [`${key}Classes`]: {
            get() {
                return this.classes.getAll(key);
            },
        },
        [`has${capitalize(key)}Class`]: {
            get() {
                return this.classes.has(key);
            },
        },
    };
}

function OutletPropertiesBlessing(constructor) {
    const outlets = readInheritableStaticArrayValues(constructor, "outlets");
    return outlets.reduce((properties, outletDefinition) => {
        return Object.assign(properties, propertiesForOutletDefinition(outletDefinition));
    }, {});
}
function getOutletController(controller, element, identifier) {
    return controller.application.getControllerForElementAndIdentifier(element, identifier);
}
function getControllerAndEnsureConnectedScope(controller, element, outletName) {
    let outletController = getOutletController(controller, element, outletName);
    if (outletController)
        return outletController;
    controller.application.router.proposeToConnectScopeForElementAndIdentifier(element, outletName);
    outletController = getOutletController(controller, element, outletName);
    if (outletController)
        return outletController;
}
function propertiesForOutletDefinition(name) {
    const camelizedName = namespaceCamelize(name);
    return {
        [`${camelizedName}Outlet`]: {
            get() {
                const outletElement = this.outlets.find(name);
                const selector = this.outlets.getSelectorForOutletName(name);
                if (outletElement) {
                    const outletController = getControllerAndEnsureConnectedScope(this, outletElement, name);
                    if (outletController)
                        return outletController;
                    throw new Error(`The provided outlet element is missing an outlet controller "${name}" instance for host controller "${this.identifier}"`);
                }
                throw new Error(`Missing outlet element "${name}" for host controller "${this.identifier}". Stimulus couldn't find a matching outlet element using selector "${selector}".`);
            },
        },
        [`${camelizedName}Outlets`]: {
            get() {
                const outlets = this.outlets.findAll(name);
                if (outlets.length > 0) {
                    return outlets
                        .map((outletElement) => {
                        const outletController = getControllerAndEnsureConnectedScope(this, outletElement, name);
                        if (outletController)
                            return outletController;
                        console.warn(`The provided outlet element is missing an outlet controller "${name}" instance for host controller "${this.identifier}"`, outletElement);
                    })
                        .filter((controller) => controller);
                }
                return [];
            },
        },
        [`${camelizedName}OutletElement`]: {
            get() {
                const outletElement = this.outlets.find(name);
                const selector = this.outlets.getSelectorForOutletName(name);
                if (outletElement) {
                    return outletElement;
                }
                else {
                    throw new Error(`Missing outlet element "${name}" for host controller "${this.identifier}". Stimulus couldn't find a matching outlet element using selector "${selector}".`);
                }
            },
        },
        [`${camelizedName}OutletElements`]: {
            get() {
                return this.outlets.findAll(name);
            },
        },
        [`has${capitalize(camelizedName)}Outlet`]: {
            get() {
                return this.outlets.has(name);
            },
        },
    };
}

function TargetPropertiesBlessing(constructor) {
    const targets = readInheritableStaticArrayValues(constructor, "targets");
    return targets.reduce((properties, targetDefinition) => {
        return Object.assign(properties, propertiesForTargetDefinition(targetDefinition));
    }, {});
}
function propertiesForTargetDefinition(name) {
    return {
        [`${name}Target`]: {
            get() {
                const target = this.targets.find(name);
                if (target) {
                    return target;
                }
                else {
                    throw new Error(`Missing target element "${name}" for "${this.identifier}" controller`);
                }
            },
        },
        [`${name}Targets`]: {
            get() {
                return this.targets.findAll(name);
            },
        },
        [`has${capitalize(name)}Target`]: {
            get() {
                return this.targets.has(name);
            },
        },
    };
}

function ValuePropertiesBlessing(constructor) {
    const valueDefinitionPairs = readInheritableStaticObjectPairs(constructor, "values");
    const propertyDescriptorMap = {
        valueDescriptorMap: {
            get() {
                return valueDefinitionPairs.reduce((result, valueDefinitionPair) => {
                    const valueDescriptor = parseValueDefinitionPair(valueDefinitionPair, this.identifier);
                    const attributeName = this.data.getAttributeNameForKey(valueDescriptor.key);
                    return Object.assign(result, { [attributeName]: valueDescriptor });
                }, {});
            },
        },
    };
    return valueDefinitionPairs.reduce((properties, valueDefinitionPair) => {
        return Object.assign(properties, propertiesForValueDefinitionPair(valueDefinitionPair));
    }, propertyDescriptorMap);
}
function propertiesForValueDefinitionPair(valueDefinitionPair, controller) {
    const definition = parseValueDefinitionPair(valueDefinitionPair, controller);
    const { key, name, reader: read, writer: write } = definition;
    return {
        [name]: {
            get() {
                const value = this.data.get(key);
                if (value !== null) {
                    return read(value);
                }
                else {
                    return definition.defaultValue;
                }
            },
            set(value) {
                if (value === undefined) {
                    this.data.delete(key);
                }
                else {
                    this.data.set(key, write(value));
                }
            },
        },
        [`has${capitalize(name)}`]: {
            get() {
                return this.data.has(key) || definition.hasCustomDefaultValue;
            },
        },
    };
}
function parseValueDefinitionPair([token, typeDefinition], controller) {
    return valueDescriptorForTokenAndTypeDefinition({
        controller,
        token,
        typeDefinition,
    });
}
function parseValueTypeConstant(constant) {
    switch (constant) {
        case Array:
            return "array";
        case Boolean:
            return "boolean";
        case Number:
            return "number";
        case Object:
            return "object";
        case String:
            return "string";
    }
}
function parseValueTypeDefault(defaultValue) {
    switch (typeof defaultValue) {
        case "boolean":
            return "boolean";
        case "number":
            return "number";
        case "string":
            return "string";
    }
    if (Array.isArray(defaultValue))
        return "array";
    if (Object.prototype.toString.call(defaultValue) === "[object Object]")
        return "object";
}
function parseValueTypeObject(payload) {
    const { controller, token, typeObject } = payload;
    const hasType = isSomething(typeObject.type);
    const hasDefault = isSomething(typeObject.default);
    const fullObject = hasType && hasDefault;
    const onlyType = hasType && !hasDefault;
    const onlyDefault = !hasType && hasDefault;
    const typeFromObject = parseValueTypeConstant(typeObject.type);
    const typeFromDefaultValue = parseValueTypeDefault(payload.typeObject.default);
    if (onlyType)
        return typeFromObject;
    if (onlyDefault)
        return typeFromDefaultValue;
    if (typeFromObject !== typeFromDefaultValue) {
        const propertyPath = controller ? `${controller}.${token}` : token;
        throw new Error(`The specified default value for the Stimulus Value "${propertyPath}" must match the defined type "${typeFromObject}". The provided default value of "${typeObject.default}" is of type "${typeFromDefaultValue}".`);
    }
    if (fullObject)
        return typeFromObject;
}
function parseValueTypeDefinition(payload) {
    const { controller, token, typeDefinition } = payload;
    const typeObject = { controller, token, typeObject: typeDefinition };
    const typeFromObject = parseValueTypeObject(typeObject);
    const typeFromDefaultValue = parseValueTypeDefault(typeDefinition);
    const typeFromConstant = parseValueTypeConstant(typeDefinition);
    const type = typeFromObject || typeFromDefaultValue || typeFromConstant;
    if (type)
        return type;
    const propertyPath = controller ? `${controller}.${typeDefinition}` : token;
    throw new Error(`Unknown value type "${propertyPath}" for "${token}" value`);
}
function defaultValueForDefinition(typeDefinition) {
    const constant = parseValueTypeConstant(typeDefinition);
    if (constant)
        return defaultValuesByType[constant];
    const hasDefault = hasProperty(typeDefinition, "default");
    const hasType = hasProperty(typeDefinition, "type");
    const typeObject = typeDefinition;
    if (hasDefault)
        return typeObject.default;
    if (hasType) {
        const { type } = typeObject;
        const constantFromType = parseValueTypeConstant(type);
        if (constantFromType)
            return defaultValuesByType[constantFromType];
    }
    return typeDefinition;
}
function valueDescriptorForTokenAndTypeDefinition(payload) {
    const { token, typeDefinition } = payload;
    const key = `${dasherize(token)}-value`;
    const type = parseValueTypeDefinition(payload);
    return {
        type,
        key,
        name: camelize(key),
        get defaultValue() {
            return defaultValueForDefinition(typeDefinition);
        },
        get hasCustomDefaultValue() {
            return parseValueTypeDefault(typeDefinition) !== undefined;
        },
        reader: readers[type],
        writer: writers[type] || writers.default,
    };
}
const defaultValuesByType = {
    get array() {
        return [];
    },
    boolean: false,
    number: 0,
    get object() {
        return {};
    },
    string: "",
};
const readers = {
    array(value) {
        const array = JSON.parse(value);
        if (!Array.isArray(array)) {
            throw new TypeError(`expected value of type "array" but instead got value "${value}" of type "${parseValueTypeDefault(array)}"`);
        }
        return array;
    },
    boolean(value) {
        return !(value == "0" || String(value).toLowerCase() == "false");
    },
    number(value) {
        return Number(value.replace(/_/g, ""));
    },
    object(value) {
        const object = JSON.parse(value);
        if (object === null || typeof object != "object" || Array.isArray(object)) {
            throw new TypeError(`expected value of type "object" but instead got value "${value}" of type "${parseValueTypeDefault(object)}"`);
        }
        return object;
    },
    string(value) {
        return value;
    },
};
const writers = {
    default: writeString,
    array: writeJSON,
    object: writeJSON,
};
function writeJSON(value) {
    return JSON.stringify(value);
}
function writeString(value) {
    return `${value}`;
}

class Controller {
    constructor(context) {
        this.context = context;
    }
    static get shouldLoad() {
        return true;
    }
    static afterLoad(_identifier, _application) {
        return;
    }
    get application() {
        return this.context.application;
    }
    get scope() {
        return this.context.scope;
    }
    get element() {
        return this.scope.element;
    }
    get identifier() {
        return this.scope.identifier;
    }
    get targets() {
        return this.scope.targets;
    }
    get outlets() {
        return this.scope.outlets;
    }
    get classes() {
        return this.scope.classes;
    }
    get data() {
        return this.scope.data;
    }
    initialize() {
    }
    connect() {
    }
    disconnect() {
    }
    dispatch(eventName, { target = this.element, detail = {}, prefix = this.identifier, bubbles = true, cancelable = true, } = {}) {
        const type = prefix ? `${prefix}:${eventName}` : eventName;
        const event = new CustomEvent(type, { detail, bubbles, cancelable });
        target.dispatchEvent(event);
        return event;
    }
}
Controller.blessings = [
    ClassPropertiesBlessing,
    TargetPropertiesBlessing,
    ValuePropertiesBlessing,
    OutletPropertiesBlessing,
];
Controller.targets = [];
Controller.outlets = [];
Controller.values = {};

var sparkMd5 = {
  exports: {}
};

(function(module, exports) {
  (function(factory) {
    {
      module.exports = factory();
    }
  })((function(undefined$1) {
    var hex_chr = [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f" ];
    function md5cycle(x, k) {
      var a = x[0], b = x[1], c = x[2], d = x[3];
      a += (b & c | ~b & d) + k[0] - 680876936 | 0;
      a = (a << 7 | a >>> 25) + b | 0;
      d += (a & b | ~a & c) + k[1] - 389564586 | 0;
      d = (d << 12 | d >>> 20) + a | 0;
      c += (d & a | ~d & b) + k[2] + 606105819 | 0;
      c = (c << 17 | c >>> 15) + d | 0;
      b += (c & d | ~c & a) + k[3] - 1044525330 | 0;
      b = (b << 22 | b >>> 10) + c | 0;
      a += (b & c | ~b & d) + k[4] - 176418897 | 0;
      a = (a << 7 | a >>> 25) + b | 0;
      d += (a & b | ~a & c) + k[5] + 1200080426 | 0;
      d = (d << 12 | d >>> 20) + a | 0;
      c += (d & a | ~d & b) + k[6] - 1473231341 | 0;
      c = (c << 17 | c >>> 15) + d | 0;
      b += (c & d | ~c & a) + k[7] - 45705983 | 0;
      b = (b << 22 | b >>> 10) + c | 0;
      a += (b & c | ~b & d) + k[8] + 1770035416 | 0;
      a = (a << 7 | a >>> 25) + b | 0;
      d += (a & b | ~a & c) + k[9] - 1958414417 | 0;
      d = (d << 12 | d >>> 20) + a | 0;
      c += (d & a | ~d & b) + k[10] - 42063 | 0;
      c = (c << 17 | c >>> 15) + d | 0;
      b += (c & d | ~c & a) + k[11] - 1990404162 | 0;
      b = (b << 22 | b >>> 10) + c | 0;
      a += (b & c | ~b & d) + k[12] + 1804603682 | 0;
      a = (a << 7 | a >>> 25) + b | 0;
      d += (a & b | ~a & c) + k[13] - 40341101 | 0;
      d = (d << 12 | d >>> 20) + a | 0;
      c += (d & a | ~d & b) + k[14] - 1502002290 | 0;
      c = (c << 17 | c >>> 15) + d | 0;
      b += (c & d | ~c & a) + k[15] + 1236535329 | 0;
      b = (b << 22 | b >>> 10) + c | 0;
      a += (b & d | c & ~d) + k[1] - 165796510 | 0;
      a = (a << 5 | a >>> 27) + b | 0;
      d += (a & c | b & ~c) + k[6] - 1069501632 | 0;
      d = (d << 9 | d >>> 23) + a | 0;
      c += (d & b | a & ~b) + k[11] + 643717713 | 0;
      c = (c << 14 | c >>> 18) + d | 0;
      b += (c & a | d & ~a) + k[0] - 373897302 | 0;
      b = (b << 20 | b >>> 12) + c | 0;
      a += (b & d | c & ~d) + k[5] - 701558691 | 0;
      a = (a << 5 | a >>> 27) + b | 0;
      d += (a & c | b & ~c) + k[10] + 38016083 | 0;
      d = (d << 9 | d >>> 23) + a | 0;
      c += (d & b | a & ~b) + k[15] - 660478335 | 0;
      c = (c << 14 | c >>> 18) + d | 0;
      b += (c & a | d & ~a) + k[4] - 405537848 | 0;
      b = (b << 20 | b >>> 12) + c | 0;
      a += (b & d | c & ~d) + k[9] + 568446438 | 0;
      a = (a << 5 | a >>> 27) + b | 0;
      d += (a & c | b & ~c) + k[14] - 1019803690 | 0;
      d = (d << 9 | d >>> 23) + a | 0;
      c += (d & b | a & ~b) + k[3] - 187363961 | 0;
      c = (c << 14 | c >>> 18) + d | 0;
      b += (c & a | d & ~a) + k[8] + 1163531501 | 0;
      b = (b << 20 | b >>> 12) + c | 0;
      a += (b & d | c & ~d) + k[13] - 1444681467 | 0;
      a = (a << 5 | a >>> 27) + b | 0;
      d += (a & c | b & ~c) + k[2] - 51403784 | 0;
      d = (d << 9 | d >>> 23) + a | 0;
      c += (d & b | a & ~b) + k[7] + 1735328473 | 0;
      c = (c << 14 | c >>> 18) + d | 0;
      b += (c & a | d & ~a) + k[12] - 1926607734 | 0;
      b = (b << 20 | b >>> 12) + c | 0;
      a += (b ^ c ^ d) + k[5] - 378558 | 0;
      a = (a << 4 | a >>> 28) + b | 0;
      d += (a ^ b ^ c) + k[8] - 2022574463 | 0;
      d = (d << 11 | d >>> 21) + a | 0;
      c += (d ^ a ^ b) + k[11] + 1839030562 | 0;
      c = (c << 16 | c >>> 16) + d | 0;
      b += (c ^ d ^ a) + k[14] - 35309556 | 0;
      b = (b << 23 | b >>> 9) + c | 0;
      a += (b ^ c ^ d) + k[1] - 1530992060 | 0;
      a = (a << 4 | a >>> 28) + b | 0;
      d += (a ^ b ^ c) + k[4] + 1272893353 | 0;
      d = (d << 11 | d >>> 21) + a | 0;
      c += (d ^ a ^ b) + k[7] - 155497632 | 0;
      c = (c << 16 | c >>> 16) + d | 0;
      b += (c ^ d ^ a) + k[10] - 1094730640 | 0;
      b = (b << 23 | b >>> 9) + c | 0;
      a += (b ^ c ^ d) + k[13] + 681279174 | 0;
      a = (a << 4 | a >>> 28) + b | 0;
      d += (a ^ b ^ c) + k[0] - 358537222 | 0;
      d = (d << 11 | d >>> 21) + a | 0;
      c += (d ^ a ^ b) + k[3] - 722521979 | 0;
      c = (c << 16 | c >>> 16) + d | 0;
      b += (c ^ d ^ a) + k[6] + 76029189 | 0;
      b = (b << 23 | b >>> 9) + c | 0;
      a += (b ^ c ^ d) + k[9] - 640364487 | 0;
      a = (a << 4 | a >>> 28) + b | 0;
      d += (a ^ b ^ c) + k[12] - 421815835 | 0;
      d = (d << 11 | d >>> 21) + a | 0;
      c += (d ^ a ^ b) + k[15] + 530742520 | 0;
      c = (c << 16 | c >>> 16) + d | 0;
      b += (c ^ d ^ a) + k[2] - 995338651 | 0;
      b = (b << 23 | b >>> 9) + c | 0;
      a += (c ^ (b | ~d)) + k[0] - 198630844 | 0;
      a = (a << 6 | a >>> 26) + b | 0;
      d += (b ^ (a | ~c)) + k[7] + 1126891415 | 0;
      d = (d << 10 | d >>> 22) + a | 0;
      c += (a ^ (d | ~b)) + k[14] - 1416354905 | 0;
      c = (c << 15 | c >>> 17) + d | 0;
      b += (d ^ (c | ~a)) + k[5] - 57434055 | 0;
      b = (b << 21 | b >>> 11) + c | 0;
      a += (c ^ (b | ~d)) + k[12] + 1700485571 | 0;
      a = (a << 6 | a >>> 26) + b | 0;
      d += (b ^ (a | ~c)) + k[3] - 1894986606 | 0;
      d = (d << 10 | d >>> 22) + a | 0;
      c += (a ^ (d | ~b)) + k[10] - 1051523 | 0;
      c = (c << 15 | c >>> 17) + d | 0;
      b += (d ^ (c | ~a)) + k[1] - 2054922799 | 0;
      b = (b << 21 | b >>> 11) + c | 0;
      a += (c ^ (b | ~d)) + k[8] + 1873313359 | 0;
      a = (a << 6 | a >>> 26) + b | 0;
      d += (b ^ (a | ~c)) + k[15] - 30611744 | 0;
      d = (d << 10 | d >>> 22) + a | 0;
      c += (a ^ (d | ~b)) + k[6] - 1560198380 | 0;
      c = (c << 15 | c >>> 17) + d | 0;
      b += (d ^ (c | ~a)) + k[13] + 1309151649 | 0;
      b = (b << 21 | b >>> 11) + c | 0;
      a += (c ^ (b | ~d)) + k[4] - 145523070 | 0;
      a = (a << 6 | a >>> 26) + b | 0;
      d += (b ^ (a | ~c)) + k[11] - 1120210379 | 0;
      d = (d << 10 | d >>> 22) + a | 0;
      c += (a ^ (d | ~b)) + k[2] + 718787259 | 0;
      c = (c << 15 | c >>> 17) + d | 0;
      b += (d ^ (c | ~a)) + k[9] - 343485551 | 0;
      b = (b << 21 | b >>> 11) + c | 0;
      x[0] = a + x[0] | 0;
      x[1] = b + x[1] | 0;
      x[2] = c + x[2] | 0;
      x[3] = d + x[3] | 0;
    }
    function md5blk(s) {
      var md5blks = [], i;
      for (i = 0; i < 64; i += 4) {
        md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
      }
      return md5blks;
    }
    function md5blk_array(a) {
      var md5blks = [], i;
      for (i = 0; i < 64; i += 4) {
        md5blks[i >> 2] = a[i] + (a[i + 1] << 8) + (a[i + 2] << 16) + (a[i + 3] << 24);
      }
      return md5blks;
    }
    function md51(s) {
      var n = s.length, state = [ 1732584193, -271733879, -1732584194, 271733878 ], i, length, tail, tmp, lo, hi;
      for (i = 64; i <= n; i += 64) {
        md5cycle(state, md5blk(s.substring(i - 64, i)));
      }
      s = s.substring(i - 64);
      length = s.length;
      tail = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
      for (i = 0; i < length; i += 1) {
        tail[i >> 2] |= s.charCodeAt(i) << (i % 4 << 3);
      }
      tail[i >> 2] |= 128 << (i % 4 << 3);
      if (i > 55) {
        md5cycle(state, tail);
        for (i = 0; i < 16; i += 1) {
          tail[i] = 0;
        }
      }
      tmp = n * 8;
      tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
      lo = parseInt(tmp[2], 16);
      hi = parseInt(tmp[1], 16) || 0;
      tail[14] = lo;
      tail[15] = hi;
      md5cycle(state, tail);
      return state;
    }
    function md51_array(a) {
      var n = a.length, state = [ 1732584193, -271733879, -1732584194, 271733878 ], i, length, tail, tmp, lo, hi;
      for (i = 64; i <= n; i += 64) {
        md5cycle(state, md5blk_array(a.subarray(i - 64, i)));
      }
      a = i - 64 < n ? a.subarray(i - 64) : new Uint8Array(0);
      length = a.length;
      tail = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
      for (i = 0; i < length; i += 1) {
        tail[i >> 2] |= a[i] << (i % 4 << 3);
      }
      tail[i >> 2] |= 128 << (i % 4 << 3);
      if (i > 55) {
        md5cycle(state, tail);
        for (i = 0; i < 16; i += 1) {
          tail[i] = 0;
        }
      }
      tmp = n * 8;
      tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
      lo = parseInt(tmp[2], 16);
      hi = parseInt(tmp[1], 16) || 0;
      tail[14] = lo;
      tail[15] = hi;
      md5cycle(state, tail);
      return state;
    }
    function rhex(n) {
      var s = "", j;
      for (j = 0; j < 4; j += 1) {
        s += hex_chr[n >> j * 8 + 4 & 15] + hex_chr[n >> j * 8 & 15];
      }
      return s;
    }
    function hex(x) {
      var i;
      for (i = 0; i < x.length; i += 1) {
        x[i] = rhex(x[i]);
      }
      return x.join("");
    }
    if (hex(md51("hello")) !== "5d41402abc4b2a76b9719d911017c592") ;
    if (typeof ArrayBuffer !== "undefined" && !ArrayBuffer.prototype.slice) {
      (function() {
        function clamp(val, length) {
          val = val | 0 || 0;
          if (val < 0) {
            return Math.max(val + length, 0);
          }
          return Math.min(val, length);
        }
        ArrayBuffer.prototype.slice = function(from, to) {
          var length = this.byteLength, begin = clamp(from, length), end = length, num, target, targetArray, sourceArray;
          if (to !== undefined$1) {
            end = clamp(to, length);
          }
          if (begin > end) {
            return new ArrayBuffer(0);
          }
          num = end - begin;
          target = new ArrayBuffer(num);
          targetArray = new Uint8Array(target);
          sourceArray = new Uint8Array(this, begin, num);
          targetArray.set(sourceArray);
          return target;
        };
      })();
    }
    function toUtf8(str) {
      if (/[\u0080-\uFFFF]/.test(str)) {
        str = unescape(encodeURIComponent(str));
      }
      return str;
    }
    function utf8Str2ArrayBuffer(str, returnUInt8Array) {
      var length = str.length, buff = new ArrayBuffer(length), arr = new Uint8Array(buff), i;
      for (i = 0; i < length; i += 1) {
        arr[i] = str.charCodeAt(i);
      }
      return returnUInt8Array ? arr : buff;
    }
    function arrayBuffer2Utf8Str(buff) {
      return String.fromCharCode.apply(null, new Uint8Array(buff));
    }
    function concatenateArrayBuffers(first, second, returnUInt8Array) {
      var result = new Uint8Array(first.byteLength + second.byteLength);
      result.set(new Uint8Array(first));
      result.set(new Uint8Array(second), first.byteLength);
      return result ;
    }
    function hexToBinaryString(hex) {
      var bytes = [], length = hex.length, x;
      for (x = 0; x < length - 1; x += 2) {
        bytes.push(parseInt(hex.substr(x, 2), 16));
      }
      return String.fromCharCode.apply(String, bytes);
    }
    function SparkMD5() {
      this.reset();
    }
    SparkMD5.prototype.append = function(str) {
      this.appendBinary(toUtf8(str));
      return this;
    };
    SparkMD5.prototype.appendBinary = function(contents) {
      this._buff += contents;
      this._length += contents.length;
      var length = this._buff.length, i;
      for (i = 64; i <= length; i += 64) {
        md5cycle(this._hash, md5blk(this._buff.substring(i - 64, i)));
      }
      this._buff = this._buff.substring(i - 64);
      return this;
    };
    SparkMD5.prototype.end = function(raw) {
      var buff = this._buff, length = buff.length, i, tail = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], ret;
      for (i = 0; i < length; i += 1) {
        tail[i >> 2] |= buff.charCodeAt(i) << (i % 4 << 3);
      }
      this._finish(tail, length);
      ret = hex(this._hash);
      if (raw) {
        ret = hexToBinaryString(ret);
      }
      this.reset();
      return ret;
    };
    SparkMD5.prototype.reset = function() {
      this._buff = "";
      this._length = 0;
      this._hash = [ 1732584193, -271733879, -1732584194, 271733878 ];
      return this;
    };
    SparkMD5.prototype.getState = function() {
      return {
        buff: this._buff,
        length: this._length,
        hash: this._hash.slice()
      };
    };
    SparkMD5.prototype.setState = function(state) {
      this._buff = state.buff;
      this._length = state.length;
      this._hash = state.hash;
      return this;
    };
    SparkMD5.prototype.destroy = function() {
      delete this._hash;
      delete this._buff;
      delete this._length;
    };
    SparkMD5.prototype._finish = function(tail, length) {
      var i = length, tmp, lo, hi;
      tail[i >> 2] |= 128 << (i % 4 << 3);
      if (i > 55) {
        md5cycle(this._hash, tail);
        for (i = 0; i < 16; i += 1) {
          tail[i] = 0;
        }
      }
      tmp = this._length * 8;
      tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
      lo = parseInt(tmp[2], 16);
      hi = parseInt(tmp[1], 16) || 0;
      tail[14] = lo;
      tail[15] = hi;
      md5cycle(this._hash, tail);
    };
    SparkMD5.hash = function(str, raw) {
      return SparkMD5.hashBinary(toUtf8(str), raw);
    };
    SparkMD5.hashBinary = function(content, raw) {
      var hash = md51(content), ret = hex(hash);
      return raw ? hexToBinaryString(ret) : ret;
    };
    SparkMD5.ArrayBuffer = function() {
      this.reset();
    };
    SparkMD5.ArrayBuffer.prototype.append = function(arr) {
      var buff = concatenateArrayBuffers(this._buff.buffer, arr), length = buff.length, i;
      this._length += arr.byteLength;
      for (i = 64; i <= length; i += 64) {
        md5cycle(this._hash, md5blk_array(buff.subarray(i - 64, i)));
      }
      this._buff = i - 64 < length ? new Uint8Array(buff.buffer.slice(i - 64)) : new Uint8Array(0);
      return this;
    };
    SparkMD5.ArrayBuffer.prototype.end = function(raw) {
      var buff = this._buff, length = buff.length, tail = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], i, ret;
      for (i = 0; i < length; i += 1) {
        tail[i >> 2] |= buff[i] << (i % 4 << 3);
      }
      this._finish(tail, length);
      ret = hex(this._hash);
      if (raw) {
        ret = hexToBinaryString(ret);
      }
      this.reset();
      return ret;
    };
    SparkMD5.ArrayBuffer.prototype.reset = function() {
      this._buff = new Uint8Array(0);
      this._length = 0;
      this._hash = [ 1732584193, -271733879, -1732584194, 271733878 ];
      return this;
    };
    SparkMD5.ArrayBuffer.prototype.getState = function() {
      var state = SparkMD5.prototype.getState.call(this);
      state.buff = arrayBuffer2Utf8Str(state.buff);
      return state;
    };
    SparkMD5.ArrayBuffer.prototype.setState = function(state) {
      state.buff = utf8Str2ArrayBuffer(state.buff, true);
      return SparkMD5.prototype.setState.call(this, state);
    };
    SparkMD5.ArrayBuffer.prototype.destroy = SparkMD5.prototype.destroy;
    SparkMD5.ArrayBuffer.prototype._finish = SparkMD5.prototype._finish;
    SparkMD5.ArrayBuffer.hash = function(arr, raw) {
      var hash = md51_array(new Uint8Array(arr)), ret = hex(hash);
      return raw ? hexToBinaryString(ret) : ret;
    };
    return SparkMD5;
  }));
})(sparkMd5);

var SparkMD5 = sparkMd5.exports;

const fileSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;

class FileChecksum {
  static create(file, callback) {
    const instance = new FileChecksum(file);
    instance.create(callback);
  }
  constructor(file) {
    this.file = file;
    this.chunkSize = 2097152;
    this.chunkCount = Math.ceil(this.file.size / this.chunkSize);
    this.chunkIndex = 0;
  }
  create(callback) {
    this.callback = callback;
    this.md5Buffer = new SparkMD5.ArrayBuffer;
    this.fileReader = new FileReader;
    this.fileReader.addEventListener("load", (event => this.fileReaderDidLoad(event)));
    this.fileReader.addEventListener("error", (event => this.fileReaderDidError(event)));
    this.readNextChunk();
  }
  fileReaderDidLoad(event) {
    this.md5Buffer.append(event.target.result);
    if (!this.readNextChunk()) {
      const binaryDigest = this.md5Buffer.end(true);
      const base64digest = btoa(binaryDigest);
      this.callback(null, base64digest);
    }
  }
  fileReaderDidError(event) {
    this.callback(`Error reading ${this.file.name}`);
  }
  readNextChunk() {
    if (this.chunkIndex < this.chunkCount || this.chunkIndex == 0 && this.chunkCount == 0) {
      const start = this.chunkIndex * this.chunkSize;
      const end = Math.min(start + this.chunkSize, this.file.size);
      const bytes = fileSlice.call(this.file, start, end);
      this.fileReader.readAsArrayBuffer(bytes);
      this.chunkIndex++;
      return true;
    } else {
      return false;
    }
  }
}

function getMetaValue(name) {
  const element = findElement(document.head, `meta[name="${name}"]`);
  if (element) {
    return element.getAttribute("content");
  }
}

function findElements(root, selector) {
  if (typeof root == "string") {
    selector = root;
    root = document;
  }
  const elements = root.querySelectorAll(selector);
  return toArray(elements);
}

function findElement(root, selector) {
  if (typeof root == "string") {
    selector = root;
    root = document;
  }
  return root.querySelector(selector);
}

function dispatchEvent(element, type, eventInit = {}) {
  const {disabled: disabled} = element;
  const {bubbles: bubbles, cancelable: cancelable, detail: detail} = eventInit;
  const event = document.createEvent("Event");
  event.initEvent(type, bubbles || true, cancelable || true);
  event.detail = detail || {};
  try {
    element.disabled = false;
    element.dispatchEvent(event);
  } finally {
    element.disabled = disabled;
  }
  return event;
}

function toArray(value) {
  if (Array.isArray(value)) {
    return value;
  } else if (Array.from) {
    return Array.from(value);
  } else {
    return [].slice.call(value);
  }
}

class BlobRecord {
  constructor(file, checksum, url, customHeaders = {}) {
    this.file = file;
    this.attributes = {
      filename: file.name,
      content_type: file.type || "application/octet-stream",
      byte_size: file.size,
      checksum: checksum
    };
    this.xhr = new XMLHttpRequest;
    this.xhr.open("POST", url, true);
    this.xhr.responseType = "json";
    this.xhr.setRequestHeader("Content-Type", "application/json");
    this.xhr.setRequestHeader("Accept", "application/json");
    this.xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    Object.keys(customHeaders).forEach((headerKey => {
      this.xhr.setRequestHeader(headerKey, customHeaders[headerKey]);
    }));
    const csrfToken = getMetaValue("csrf-token");
    if (csrfToken != undefined) {
      this.xhr.setRequestHeader("X-CSRF-Token", csrfToken);
    }
    this.xhr.addEventListener("load", (event => this.requestDidLoad(event)));
    this.xhr.addEventListener("error", (event => this.requestDidError(event)));
  }
  get status() {
    return this.xhr.status;
  }
  get response() {
    const {responseType: responseType, response: response} = this.xhr;
    if (responseType == "json") {
      return response;
    } else {
      return JSON.parse(response);
    }
  }
  create(callback) {
    this.callback = callback;
    this.xhr.send(JSON.stringify({
      blob: this.attributes
    }));
  }
  requestDidLoad(event) {
    if (this.status >= 200 && this.status < 300) {
      const {response: response} = this;
      const {direct_upload: direct_upload} = response;
      delete response.direct_upload;
      this.attributes = response;
      this.directUploadData = direct_upload;
      this.callback(null, this.toJSON());
    } else {
      this.requestDidError(event);
    }
  }
  requestDidError(event) {
    this.callback(`Error creating Blob for "${this.file.name}". Status: ${this.status}`);
  }
  toJSON() {
    const result = {};
    for (const key in this.attributes) {
      result[key] = this.attributes[key];
    }
    return result;
  }
}

class BlobUpload {
  constructor(blob) {
    this.blob = blob;
    this.file = blob.file;
    const {url: url, headers: headers} = blob.directUploadData;
    this.xhr = new XMLHttpRequest;
    this.xhr.open("PUT", url, true);
    this.xhr.responseType = "text";
    for (const key in headers) {
      this.xhr.setRequestHeader(key, headers[key]);
    }
    this.xhr.addEventListener("load", (event => this.requestDidLoad(event)));
    this.xhr.addEventListener("error", (event => this.requestDidError(event)));
  }
  create(callback) {
    this.callback = callback;
    this.xhr.send(this.file.slice());
  }
  requestDidLoad(event) {
    const {status: status, response: response} = this.xhr;
    if (status >= 200 && status < 300) {
      this.callback(null, response);
    } else {
      this.requestDidError(event);
    }
  }
  requestDidError(event) {
    this.callback(`Error storing "${this.file.name}". Status: ${this.xhr.status}`);
  }
}

let id = 0;

class DirectUpload {
  constructor(file, url, delegate, customHeaders = {}) {
    this.id = ++id;
    this.file = file;
    this.url = url;
    this.delegate = delegate;
    this.customHeaders = customHeaders;
  }
  create(callback) {
    FileChecksum.create(this.file, ((error, checksum) => {
      if (error) {
        callback(error);
        return;
      }
      const blob = new BlobRecord(this.file, checksum, this.url, this.customHeaders);
      notify(this.delegate, "directUploadWillCreateBlobWithXHR", blob.xhr);
      blob.create((error => {
        if (error) {
          callback(error);
        } else {
          const upload = new BlobUpload(blob);
          notify(this.delegate, "directUploadWillStoreFileWithXHR", upload.xhr);
          upload.create((error => {
            if (error) {
              callback(error);
            } else {
              callback(null, blob.toJSON());
            }
          }));
        }
      }));
    }));
  }
}

function notify(object, methodName, ...messages) {
  if (object && typeof object[methodName] == "function") {
    return object[methodName](...messages);
  }
}

class DirectUploadController {
  constructor(input, file) {
    this.input = input;
    this.file = file;
    this.directUpload = new DirectUpload(this.file, this.url, this);
    this.dispatch("initialize");
  }
  start(callback) {
    const hiddenInput = document.createElement("input");
    hiddenInput.type = "hidden";
    hiddenInput.name = this.input.name;
    this.input.insertAdjacentElement("beforebegin", hiddenInput);
    this.dispatch("start");
    this.directUpload.create(((error, attributes) => {
      if (error) {
        hiddenInput.parentNode.removeChild(hiddenInput);
        this.dispatchError(error);
      } else {
        hiddenInput.value = attributes.signed_id;
      }
      this.dispatch("end");
      callback(error);
    }));
  }
  uploadRequestDidProgress(event) {
    const progress = event.loaded / event.total * 100;
    if (progress) {
      this.dispatch("progress", {
        progress: progress
      });
    }
  }
  get url() {
    return this.input.getAttribute("data-direct-upload-url");
  }
  dispatch(name, detail = {}) {
    detail.file = this.file;
    detail.id = this.directUpload.id;
    return dispatchEvent(this.input, `direct-upload:${name}`, {
      detail: detail
    });
  }
  dispatchError(error) {
    const event = this.dispatch("error", {
      error: error
    });
    if (!event.defaultPrevented) {
      alert(error);
    }
  }
  directUploadWillCreateBlobWithXHR(xhr) {
    this.dispatch("before-blob-request", {
      xhr: xhr
    });
  }
  directUploadWillStoreFileWithXHR(xhr) {
    this.dispatch("before-storage-request", {
      xhr: xhr
    });
    xhr.upload.addEventListener("progress", (event => this.uploadRequestDidProgress(event)));
  }
}

const inputSelector = "input[type=file][data-direct-upload-url]:not([disabled])";

class DirectUploadsController {
  constructor(form) {
    this.form = form;
    this.inputs = findElements(form, inputSelector).filter((input => input.files.length));
  }
  start(callback) {
    const controllers = this.createDirectUploadControllers();
    const startNextController = () => {
      const controller = controllers.shift();
      if (controller) {
        controller.start((error => {
          if (error) {
            callback(error);
            this.dispatch("end");
          } else {
            startNextController();
          }
        }));
      } else {
        callback();
        this.dispatch("end");
      }
    };
    this.dispatch("start");
    startNextController();
  }
  createDirectUploadControllers() {
    const controllers = [];
    this.inputs.forEach((input => {
      toArray(input.files).forEach((file => {
        const controller = new DirectUploadController(input, file);
        controllers.push(controller);
      }));
    }));
    return controllers;
  }
  dispatch(name, detail = {}) {
    return dispatchEvent(this.form, `direct-uploads:${name}`, {
      detail: detail
    });
  }
}

const processingAttribute = "data-direct-uploads-processing";

const submitButtonsByForm = new WeakMap;

let started = false;

function start() {
  if (!started) {
    started = true;
    document.addEventListener("click", didClick, true);
    document.addEventListener("submit", didSubmitForm, true);
    document.addEventListener("ajax:before", didSubmitRemoteElement);
  }
}

function didClick(event) {
  const button = event.target.closest("button, input");
  if (button && button.type === "submit" && button.form) {
    submitButtonsByForm.set(button.form, button);
  }
}

function didSubmitForm(event) {
  handleFormSubmissionEvent(event);
}

function didSubmitRemoteElement(event) {
  if (event.target.tagName == "FORM") {
    handleFormSubmissionEvent(event);
  }
}

function handleFormSubmissionEvent(event) {
  const form = event.target;
  if (form.hasAttribute(processingAttribute)) {
    event.preventDefault();
    return;
  }
  const controller = new DirectUploadsController(form);
  const {inputs: inputs} = controller;
  if (inputs.length) {
    event.preventDefault();
    form.setAttribute(processingAttribute, "");
    inputs.forEach(disable);
    controller.start((error => {
      form.removeAttribute(processingAttribute);
      if (error) {
        inputs.forEach(enable);
      } else {
        submitForm(form);
      }
    }));
  }
}

function submitForm(form) {
  let button = submitButtonsByForm.get(form) || findElement(form, "input[type=submit], button[type=submit]");
  if (button) {
    const {disabled: disabled} = button;
    button.disabled = false;
    button.focus();
    button.click();
    button.disabled = disabled;
  } else {
    button = document.createElement("input");
    button.type = "submit";
    button.style.display = "none";
    form.appendChild(button);
    button.click();
    form.removeChild(button);
  }
  submitButtonsByForm.delete(form);
}

function disable(input) {
  input.disabled = true;
}

function enable(input) {
  input.disabled = false;
}

function autostart() {
  if (window.ActiveStorage) {
    start();
  }
}

setTimeout(autostart, 1);

class FetchResponse {
  constructor (response) {
    this.response = response;
  }

  get statusCode () {
    return this.response.status
  }

  get redirected () {
    return this.response.redirected
  }

  get ok () {
    return this.response.ok
  }

  get unauthenticated () {
    return this.statusCode === 401
  }

  get unprocessableEntity () {
    return this.statusCode === 422
  }

  get authenticationURL () {
    return this.response.headers.get('WWW-Authenticate')
  }

  get contentType () {
    const contentType = this.response.headers.get('Content-Type') || '';

    return contentType.replace(/;.*$/, '')
  }

  get headers () {
    return this.response.headers
  }

  get html () {
    if (this.contentType.match(/^(application|text)\/(html|xhtml\+xml)$/)) {
      return this.text
    }

    return Promise.reject(new Error(`Expected an HTML response but got "${this.contentType}" instead`))
  }

  get json () {
    if (this.contentType.match(/^application\/.*json$/)) {
      return this.responseJson || (this.responseJson = this.response.json())
    }

    return Promise.reject(new Error(`Expected a JSON response but got "${this.contentType}" instead`))
  }

  get text () {
    return this.responseText || (this.responseText = this.response.text())
  }

  get isTurboStream () {
    return this.contentType.match(/^text\/vnd\.turbo-stream\.html/)
  }

  get isScript () {
    return this.contentType.match(/\b(?:java|ecma)script\b/)
  }

  async renderTurboStream () {
    if (this.isTurboStream) {
      if (window.Turbo) {
        await window.Turbo.renderStreamMessage(await this.text);
      } else {
        console.warn('You must set `window.Turbo = Turbo` to automatically process Turbo Stream events with request.js');
      }
    } else {
      return Promise.reject(new Error(`Expected a Turbo Stream response but got "${this.contentType}" instead`))
    }
  }

  async activeScript () {
    if (this.isScript) {
      const script = document.createElement('script');
      const metaTag = document.querySelector('meta[name=csp-nonce]');
      const nonce = metaTag && metaTag.content;
      if (nonce) { script.setAttribute('nonce', nonce); }
      script.innerHTML = await this.text;
      document.body.appendChild(script);
    } else {
      return Promise.reject(new Error(`Expected a Script response but got "${this.contentType}" instead`))
    }
  }
}

class RequestInterceptor {
  static register (interceptor) {
    this.interceptor = interceptor;
  }

  static get () {
    return this.interceptor
  }

  static reset () {
    this.interceptor = undefined;
  }
}

function getCookie (name) {
  const cookies = document.cookie ? document.cookie.split('; ') : [];
  const prefix = `${encodeURIComponent(name)}=`;
  const cookie = cookies.find(cookie => cookie.startsWith(prefix));

  if (cookie) {
    const value = cookie.split('=').slice(1).join('=');

    if (value) {
      return decodeURIComponent(value)
    }
  }
}

function compact (object) {
  const result = {};

  for (const key in object) {
    const value = object[key];
    if (value !== undefined) {
      result[key] = value;
    }
  }

  return result
}

function metaContent (name) {
  const element = document.head.querySelector(`meta[name="${name}"]`);
  return element && element.content
}

function stringEntriesFromFormData (formData) {
  return [...formData].reduce((entries, [name, value]) => {
    return entries.concat(typeof value === 'string' ? [[name, value]] : [])
  }, [])
}

function mergeEntries (searchParams, entries) {
  for (const [name, value] of entries) {
    if (value instanceof window.File) continue

    if (searchParams.has(name) && !name.includes('[]')) {
      searchParams.delete(name);
      searchParams.set(name, value);
    } else {
      searchParams.append(name, value);
    }
  }
}

class FetchRequest {
  constructor (method, url, options = {}) {
    this.method = method;
    this.options = options;
    this.originalUrl = url.toString();
  }

  async perform () {
    try {
      const requestInterceptor = RequestInterceptor.get();
      if (requestInterceptor) {
        await requestInterceptor(this);
      }
    } catch (error) {
      console.error(error);
    }

    const fetch = (this.responseKind === 'turbo-stream' && window.Turbo)
      ? window.Turbo.fetch
      : window.fetch;

    const response = new FetchResponse(await fetch(this.url, this.fetchOptions));

    if (response.unauthenticated && response.authenticationURL) {
      return Promise.reject(window.location.href = response.authenticationURL)
    }

    if (response.isScript) {
      await response.activeScript();
    }

    const responseStatusIsTurboStreamable = response.ok || response.unprocessableEntity;

    if (responseStatusIsTurboStreamable && response.isTurboStream) {
      await response.renderTurboStream();
    }

    return response
  }

  addHeader (key, value) {
    const headers = this.additionalHeaders;
    headers[key] = value;
    this.options.headers = headers;
  }

  sameHostname () {
    if (!this.originalUrl.startsWith('http:')) {
      return true
    }

    try {
      return new URL(this.originalUrl).hostname === window.location.hostname
    } catch (_) {
      return true
    }
  }

  get fetchOptions () {
    return {
      method: this.method.toUpperCase(),
      headers: this.headers,
      body: this.formattedBody,
      signal: this.signal,
      credentials: this.credentials,
      redirect: this.redirect
    }
  }

  get headers () {
    const baseHeaders = {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': this.contentType,
      Accept: this.accept
    };

    if (this.sameHostname()) {
      baseHeaders['X-CSRF-Token'] = this.csrfToken;
    }

    return compact(
      Object.assign(baseHeaders, this.additionalHeaders)
    )
  }

  get csrfToken () {
    return getCookie(metaContent('csrf-param')) || metaContent('csrf-token')
  }

  get contentType () {
    if (this.options.contentType) {
      return this.options.contentType
    } else if (this.body == null || this.body instanceof window.FormData) {
      return undefined
    } else if (this.body instanceof window.File) {
      return this.body.type
    }

    return 'application/json'
  }

  get accept () {
    switch (this.responseKind) {
      case 'html':
        return 'text/html, application/xhtml+xml'
      case 'turbo-stream':
        return 'text/vnd.turbo-stream.html, text/html, application/xhtml+xml'
      case 'json':
        return 'application/json, application/vnd.api+json'
      case 'script':
        return 'text/javascript, application/javascript'
      default:
        return '*/*'
    }
  }

  get body () {
    return this.options.body
  }

  get query () {
    const originalQuery = (this.originalUrl.split('?')[1] || '').split('#')[0];
    const params = new URLSearchParams(originalQuery);

    let requestQuery = this.options.query;
    if (requestQuery instanceof window.FormData) {
      requestQuery = stringEntriesFromFormData(requestQuery);
    } else if (requestQuery instanceof window.URLSearchParams) {
      requestQuery = requestQuery.entries();
    } else {
      requestQuery = Object.entries(requestQuery || {});
    }

    mergeEntries(params, requestQuery);

    const query = params.toString();
    return (query.length > 0 ? `?${query}` : '')
  }

  get url () {
    return (this.originalUrl.split('?')[0]).split('#')[0] + this.query
  }

  get responseKind () {
    return this.options.responseKind || 'html'
  }

  get signal () {
    return this.options.signal
  }

  get redirect () {
    return this.options.redirect || 'follow'
  }

  get credentials () {
    return this.options.credentials || 'same-origin'
  }

  get additionalHeaders () {
    return this.options.headers || {}
  }

  get formattedBody () {
    const bodyIsAString = Object.prototype.toString.call(this.body) === '[object String]';
    const contentTypeIsJson = this.headers['Content-Type'] === 'application/json';

    if (contentTypeIsJson && !bodyIsAString) {
      return JSON.stringify(this.body)
    }

    return this.body
  }
}

async function post (url, options) {
  const request = new FetchRequest('post', url, options);
  return request.perform()
}

function insertText(textarea, text) {
    var _a, _b, _c;
    const before = textarea.value.slice(0, (_a = textarea.selectionStart) !== null && _a !== undefined ? _a : undefined);
    const after = textarea.value.slice((_b = textarea.selectionEnd) !== null && _b !== undefined ? _b : undefined);
    let canInsertText = true;
    textarea.contentEditable = 'true';
    try {
        canInsertText = document.execCommand('insertText', false, text);
    }
    catch (error) {
        canInsertText = false;
    }
    textarea.contentEditable = 'false';
    if (canInsertText && !textarea.value.slice(0, (_c = textarea.selectionStart) !== null && _c !== undefined ? _c : undefined).endsWith(text)) {
        canInsertText = false;
    }
    if (!canInsertText) {
        try {
            document.execCommand('ms-beginUndoUnit');
        }
        catch (e) {
        }
        textarea.value = before + text + after;
        try {
            document.execCommand('ms-endUndoUnit');
        }
        catch (e) {
        }
        textarea.dispatchEvent(new CustomEvent('change', { bubbles: true, cancelable: true }));
    }
}

const skipFormattingMap = new WeakMap();
function setSkipFormattingFlag(event) {
    const { currentTarget: el } = event;
    const isSkipFormattingKeys = event.code === 'KeyV' && (event.ctrlKey || event.metaKey) && event.shiftKey;
    if (isSkipFormattingKeys || (isSkipFormattingKeys && event.altKey)) {
        skipFormattingMap.set(el, true);
    }
}
function unsetSkipFormattedFlag(event) {
    const { currentTarget: el } = event;
    skipFormattingMap.delete(el);
}
function shouldSkipFormatting(el) {
    var _a;
    const shouldSkipFormattingState = (_a = skipFormattingMap.get(el)) !== null && _a !== undefined ? _a : false;
    return shouldSkipFormattingState;
}
function installAround(el, installCallbacks, optionConfig) {
    el.addEventListener('keydown', setSkipFormattingFlag);
    for (const installCallback of installCallbacks) {
        installCallback(el, optionConfig);
    }
    el.addEventListener('paste', unsetSkipFormattedFlag);
}
function uninstall$6(el) {
    el.removeEventListener('keydown', setSkipFormattingFlag);
    el.removeEventListener('paste', unsetSkipFormattedFlag);
}

function install$5(el) {
    el.addEventListener('paste', onPaste$4);
}
function uninstall$5(el) {
    el.removeEventListener('paste', onPaste$4);
}
function onPaste$4(event) {
    const transfer = event.clipboardData;
    const { currentTarget: el } = event;
    if (shouldSkipFormatting(el))
        return;
    if (!transfer || !hasHTML(transfer))
        return;
    const field = event.currentTarget;
    if (!(field instanceof HTMLTextAreaElement))
        return;
    if (isWithinUserMention(field)) {
        return;
    }
    let plaintext = transfer.getData('text/plain');
    const textHTML = transfer.getData('text/html');
    const textHTMLClean = textHTML.replace(/\u00A0/g, ' ').replace(/\uC2A0/g, ' ');
    if (!textHTML)
        return;
    plaintext = plaintext.trim();
    if (!plaintext)
        return;
    const parser = new DOMParser();
    const doc = parser.parseFromString(textHTMLClean, 'text/html');
    const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_ALL, node => node.parentNode && isLink(node.parentNode) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT);
    const markdown = convertToMarkdown(plaintext, walker);
    if (markdown === plaintext)
        return;
    event.stopPropagation();
    event.preventDefault();
    insertText(field, markdown);
}
function convertToMarkdown(plaintext, walker) {
    let currentNode = walker.firstChild();
    let markdown = plaintext;
    let markdownIgnoreBeforeIndex = 0;
    let index = 0;
    const NODE_LIMIT = 10000;
    while (currentNode && index < NODE_LIMIT) {
        index++;
        const text = isLink(currentNode)
            ? (currentNode.textContent || '').replace(/[\t\n\r ]+/g, ' ')
            : (currentNode === null || currentNode === undefined ? undefined : currentNode.wholeText) || '';
        if (isEmptyString(text)) {
            currentNode = walker.nextNode();
            continue;
        }
        if (!isLink(currentNode)) {
            markdownIgnoreBeforeIndex += text.replace(/[\t\n\r ]+/g, ' ').trimStart().length;
            currentNode = walker.nextNode();
            continue;
        }
        const markdownFoundIndex = markdown.indexOf(text, markdownIgnoreBeforeIndex);
        if (markdownFoundIndex >= 0) {
            const markdownLink = linkify$2(currentNode, text);
            markdown = markdown.slice(0, markdownFoundIndex) + markdownLink + markdown.slice(markdownFoundIndex + text.length);
            markdownIgnoreBeforeIndex = markdownFoundIndex + markdownLink.length;
        }
        currentNode = walker.nextNode();
    }
    return index === NODE_LIMIT ? plaintext : markdown;
}
function isWithinUserMention(textarea) {
    const selectionStart = textarea.selectionStart || 0;
    if (selectionStart === 0) {
        return false;
    }
    const previousChar = textarea.value.substring(selectionStart - 1, selectionStart);
    return previousChar === '@';
}
function isEmptyString(text) {
    return !text || (text === null || text === undefined ? undefined : text.trim().length) === 0;
}
function isLink(node) {
    var _a;
    return ((_a = node.tagName) === null || _a === undefined ? undefined : _a.toLowerCase()) === 'a' && node.hasAttribute('href');
}
function hasHTML(transfer) {
    return transfer.types.includes('text/html');
}
function linkify$2(element, label) {
    const url = element.href || '';
    let markdown = '';
    if (isUserMention(element) || isTeamMention(element)) {
        markdown = label;
    }
    else if (isSpecialLink(element) || areEqualLinks(url, label)) {
        markdown = url;
    }
    else {
        markdown = `[${label}](${url})`;
    }
    return markdown;
}
function isSpecialLink(link) {
    return (link.className.indexOf('commit-link') >= 0 ||
        (!!link.getAttribute('data-hovercard-type') && link.getAttribute('data-hovercard-type') !== 'user'));
}
function areEqualLinks(link1, link2) {
    link1 = link1.slice(-1) === '/' ? link1.slice(0, -1) : link1;
    link2 = link2.slice(-1) === '/' ? link2.slice(0, -1) : link2;
    return link1.toLowerCase() === link2.toLowerCase();
}
function isUserMention(link) {
    var _a;
    return ((_a = link.textContent) === null || _a === undefined ? undefined : _a.slice(0, 1)) === '@' && link.getAttribute('data-hovercard-type') === 'user';
}
function isTeamMention(link) {
    var _a;
    return ((_a = link.textContent) === null || _a === undefined ? undefined : _a.slice(0, 1)) === '@' && link.getAttribute('data-hovercard-type') === 'team';
}

function install$4(el) {
    el.addEventListener('dragover', onDragover$1);
    el.addEventListener('drop', onDrop$1);
    el.addEventListener('paste', onPaste$3);
}
function uninstall$4(el) {
    el.removeEventListener('dragover', onDragover$1);
    el.removeEventListener('drop', onDrop$1);
    el.removeEventListener('paste', onPaste$3);
}
function onDrop$1(event) {
    const transfer = event.dataTransfer;
    if (!transfer)
        return;
    if (hasFile$1(transfer))
        return;
    if (!hasLink(transfer))
        return;
    const links = extractLinks(transfer);
    if (!links.some(isImageLink))
        return;
    event.stopPropagation();
    event.preventDefault();
    const field = event.currentTarget;
    if (!(field instanceof HTMLTextAreaElement))
        return;
    insertText(field, links.map(linkify$1).join(''));
}
function onDragover$1(event) {
    const transfer = event.dataTransfer;
    if (transfer)
        transfer.dropEffect = 'link';
}
function onPaste$3(event) {
    const { currentTarget: el } = event;
    if (shouldSkipFormatting(el))
        return;
    const transfer = event.clipboardData;
    if (!transfer || !hasLink(transfer))
        return;
    const links = extractLinks(transfer);
    if (!links.some(isImageLink))
        return;
    event.stopPropagation();
    event.preventDefault();
    const field = event.currentTarget;
    if (!(field instanceof HTMLTextAreaElement))
        return;
    insertText(field, links.map(linkify$1).join(''));
}
function linkify$1(link) {
    return isImageLink(link) ? `\n![](${link})\n` : link;
}
function hasFile$1(transfer) {
    return Array.from(transfer.types).indexOf('Files') >= 0;
}
function hasLink(transfer) {
    return Array.from(transfer.types).indexOf('text/uri-list') >= 0;
}
function extractLinks(transfer) {
    return (transfer.getData('text/uri-list') || '').split('\r\n');
}
const IMAGE_RE = /\.(gif|png|jpe?g)$/i;
function isImageLink(url) {
    return IMAGE_RE.test(url);
}

const pasteLinkAsPlainTextOverSelectedTextMap = new WeakMap();
function install$3(el, optionConfig) {
    var _a;
    pasteLinkAsPlainTextOverSelectedTextMap.set(el, ((_a = optionConfig === null || optionConfig === undefined ? undefined : optionConfig.defaultPlainTextPaste) === null || _a === undefined ? undefined : _a.urlLinks) === true);
    el.addEventListener('paste', onPaste$2);
}
function uninstall$3(el) {
    el.removeEventListener('paste', onPaste$2);
}
function onPaste$2(event) {
    var _a;
    const { currentTarget: el } = event;
    const element = el;
    const shouldPasteAsPlainText = (_a = pasteLinkAsPlainTextOverSelectedTextMap.get(element)) !== null && _a !== undefined ? _a : false;
    const shouldSkipDefaultBehavior = shouldSkipFormatting(element);
    if ((!shouldPasteAsPlainText && shouldSkipDefaultBehavior) ||
        (shouldPasteAsPlainText && !shouldSkipDefaultBehavior)) {
        return;
    }
    const transfer = event.clipboardData;
    if (!transfer || !hasPlainText(transfer))
        return;
    const field = event.currentTarget;
    if (!(field instanceof HTMLTextAreaElement))
        return;
    const text = transfer.getData('text/plain');
    if (!text)
        return;
    if (!isURL(text))
        return;
    if (isWithinLink(field))
        return;
    const selectedText = field.value.substring(field.selectionStart, field.selectionEnd);
    if (!selectedText.length)
        return;
    if (isURL(selectedText.trim()))
        return;
    event.stopPropagation();
    event.preventDefault();
    insertText(field, linkify(selectedText, text.trim()));
}
function hasPlainText(transfer) {
    return Array.from(transfer.types).includes('text/plain');
}
function isWithinLink(textarea) {
    const selectionStart = textarea.selectionStart || 0;
    if (selectionStart > 1) {
        const previousChars = textarea.value.substring(selectionStart - 2, selectionStart);
        return previousChars === '](';
    }
    else {
        return false;
    }
}
function linkify(selectedText, text) {
    return `[${selectedText}](${text})`;
}
function isURL(url) {
    try {
        const parsedURL = new URL(url);
        return removeTrailingSlash(parsedURL.href).trim() === removeTrailingSlash(url).trim();
    }
    catch (_a) {
        return false;
    }
}
function removeTrailingSlash(url) {
    return url.endsWith('/') ? url.slice(0, url.length - 1) : url;
}

function install$2(el) {
    el.addEventListener('dragover', onDragover);
    el.addEventListener('drop', onDrop);
    el.addEventListener('paste', onPaste$1);
}
function uninstall$2(el) {
    el.removeEventListener('dragover', onDragover);
    el.removeEventListener('drop', onDrop);
    el.removeEventListener('paste', onPaste$1);
}
function onDrop(event) {
    const transfer = event.dataTransfer;
    if (!transfer)
        return;
    if (hasFile(transfer))
        return;
    const textToPaste = generateText(transfer);
    if (!textToPaste)
        return;
    event.stopPropagation();
    event.preventDefault();
    const field = event.currentTarget;
    if (field instanceof HTMLTextAreaElement) {
        insertText(field, textToPaste);
    }
}
function onDragover(event) {
    const transfer = event.dataTransfer;
    if (transfer)
        transfer.dropEffect = 'copy';
}
function onPaste$1(event) {
    const { currentTarget: el } = event;
    if (shouldSkipFormatting(el))
        return;
    if (!event.clipboardData)
        return;
    const textToPaste = generateText(event.clipboardData);
    if (!textToPaste)
        return;
    event.stopPropagation();
    event.preventDefault();
    const field = event.currentTarget;
    if (field instanceof HTMLTextAreaElement) {
        insertText(field, textToPaste);
    }
}
function hasFile(transfer) {
    return Array.from(transfer.types).indexOf('Files') >= 0;
}
function columnText(column) {
    const noBreakSpace = '\u00A0';
    const text = (column.textContent || '').trim().replace(/\|/g, '\\|').replace(/\n/g, ' ');
    return text || noBreakSpace;
}
function tableHeaders(row) {
    return Array.from(row.querySelectorAll('td, th')).map(columnText);
}
function tableMarkdown(node) {
    const rows = Array.from(node.querySelectorAll('tr'));
    const firstRow = rows.shift();
    if (!firstRow)
        return '';
    const headers = tableHeaders(firstRow);
    const spacers = headers.map(() => '--');
    const header = `${headers.join(' | ')}\n${spacers.join(' | ')}\n`;
    const body = rows
        .map(row => {
        return Array.from(row.querySelectorAll('td')).map(columnText).join(' | ');
    })
        .join('\n');
    return `\n${header}${body}\n\n`;
}
function generateText(transfer) {
    if (Array.from(transfer.types).indexOf('text/html') === -1)
        return;
    const html = transfer.getData('text/html');
    if (!/<table/i.test(html))
        return;
    const start = html.substring(0, html.indexOf('<table'));
    const tableCloseIndex = html.lastIndexOf('</table>');
    if (!start || !tableCloseIndex)
        return;
    const end = html.substring(tableCloseIndex + 8);
    const parser = new DOMParser();
    const parsedDocument = parser.parseFromString(html, 'text/html');
    let table = parsedDocument.querySelector('table');
    table = !table || table.closest('[data-paste-markdown-skip]') ? null : table;
    if (!table)
        return;
    const formattedTable = tableMarkdown(table);
    if (!formattedTable)
        return;
    return [start, formattedTable, end].join('').replace(/<meta.*?>/, '');
}

function install$1(el) {
    el.addEventListener('paste', onPaste);
}
function uninstall$1(el) {
    el.removeEventListener('paste', onPaste);
}
function onPaste(event) {
    const { currentTarget: el } = event;
    if (shouldSkipFormatting(el))
        return;
    const transfer = event.clipboardData;
    if (!transfer || !hasMarkdown(transfer))
        return;
    const field = event.currentTarget;
    if (!(field instanceof HTMLTextAreaElement))
        return;
    const text = transfer.getData('text/x-gfm');
    if (!text)
        return;
    event.stopPropagation();
    event.preventDefault();
    insertText(field, text);
}
function hasMarkdown(transfer) {
    return Array.from(transfer.types).indexOf('text/x-gfm') >= 0;
}

function subscribe(el, optionConfig) {
    installAround(el, [install$2, install$4, install$3, install$1, install$5], optionConfig);
    return {
        unsubscribe: () => {
            uninstall$6(el);
            uninstall$2(el);
            uninstall$5(el);
            uninstall$4(el);
            uninstall$3(el);
            uninstall$1(el);
        },
    };
}

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
