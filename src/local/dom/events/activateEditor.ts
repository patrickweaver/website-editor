import {
  CURRENTLY_EDITING_ID,
  DATA_ORIGINAL_ALT,
  DATA_ORIGINAL_CSS,
  DATA_ORIGINAL_HTML,
  DATA_ORIGINAL_SRC,
  DATA_ORIGINAL_TAG_NAME,
  EDITABLE_STYLE_PROPERTIES,
  EditableType,
} from "../../util/constants";
import {
  EditableElementWithAbortController,
  ElementTag,
  EventType,
  InsertPosition,
} from "../../types";
import { showAlert } from "../util/alert";
import { getToolbar } from "../ui/toolbar";
import { getEditableType } from "../ui/util";
import { validateElementForEditing } from "../util/validateElementForEditing";
import { insertElementNextToElement } from "../util/insertElementNextToElement";

const ALLOWED_PASTE_TAGS = new Set<ElementTag>([ElementTag.A]);
const LINE_BREAK_TAGS = new Set<ElementTag>([ElementTag.BR]);
const BLOCK_TAGS_TO_LINE_BREAK = new Set<ElementTag>([
  ElementTag.DIV,
  ElementTag.P,
  ElementTag.LI,
  ElementTag.H1,
  ElementTag.H2,
  ElementTag.H3,
  ElementTag.H4,
  ElementTag.H5,
  ElementTag.H6,
]);

export function activateEditor(element: HTMLElement) {
  const valid = validateElementForEditing(element);
  if (!valid) return;
  element.id = CURRENTLY_EDITING_ID;

  const editableType = getEditableType();

  const originalTagName = element.tagName.toLowerCase();
  element.setAttribute(DATA_ORIGINAL_TAG_NAME, originalTagName);

  if (editableType === EditableType.TEXT) {
    element.contentEditable = "true";
    saveInnerHtml(element);
    const editableElement = element as EditableElementWithAbortController;
    editableElement.pasteAbortController?.abort();
    const controller = new AbortController();
    editableElement.pasteAbortController = controller;
    editableElement.addEventListener(EventType.PASTE, handlePaste, {
      signal: controller.signal,
    });
  }

  if (
    editableType === EditableType.IMAGE &&
    element instanceof HTMLImageElement
  ) {
    saveImageAttributes(element);
  }

  saveCss(element);

  const toolbar = getToolbar();

  if (!toolbar) {
    showAlert("Error: Invalid element. 1");
    return;
  }

  let domReference = element;
  const isAnchorContent = element.parentElement instanceof HTMLAnchorElement;
  if (isAnchorContent) {
    domReference = element.parentElement;
  }

  insertElementNextToElement(domReference, toolbar, InsertPosition.AFTER_END);

  // element.addEventListener(EventType.INPUT, (_event: Event) => {
  //   element.innerHTML = element.innerText;
  // });

  element.focus();
}

function saveInnerHtml(element: HTMLElement) {
  const originalHtml = element.innerHTML;
  const originalHtmlEscaped = encodeURIComponent(originalHtml);
  element.setAttribute(DATA_ORIGINAL_HTML, originalHtmlEscaped);
}

function saveImageAttributes(element: HTMLImageElement) {
  const originalSrc = element.src;
  element.setAttribute(DATA_ORIGINAL_SRC, originalSrc);
  const originalAlt = element.alt;
  element.setAttribute(DATA_ORIGINAL_ALT, originalAlt);
}

function saveCss(element: HTMLElement) {
  const editableProperties = Object.values(EDITABLE_STYLE_PROPERTIES);
  const originalCss = editableProperties.reduce<
    Record<string, string | undefined>
  >((acc, property) => {
    const v = element.style.getPropertyValue(property);
    acc[property] = v ?? undefined;
    return acc;
  }, {});
  const originalCssEscaped = encodeURIComponent(JSON.stringify(originalCss));
  element.setAttribute(DATA_ORIGINAL_CSS, originalCssEscaped);
  if (element?.parentElement instanceof HTMLAnchorElement) {
    saveCss(element.parentElement);
  }
}

function handlePaste(event: Event) {
  if (!(event instanceof ClipboardEvent)) return;
  event.preventDefault();

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const html = event.clipboardData?.getData("text/html") ?? "";
  const text = event.clipboardData?.getData("text/plain") ?? "";
  const nodeToInsert = html
    ? sanitizeHtmlToFragment(html)
    : document.createTextNode(text);

  const range = selection.getRangeAt(0);
  range.deleteContents();

  if (nodeToInsert instanceof DocumentFragment) {
    const lastNode = nodeToInsert.lastChild;
    range.insertNode(nodeToInsert);
    if (lastNode) {
      range.setStartAfter(lastNode);
    }
  } else {
    range.insertNode(nodeToInsert);
    range.setStartAfter(nodeToInsert);
  }

  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
}

function sanitizeHtmlToFragment(html: string): DocumentFragment {
  const parsedHtml = new DOMParser().parseFromString(html, "text/html");
  const cleanFragment = document.createDocumentFragment();

  for (const child of Array.from(parsedHtml.body.childNodes)) {
    const sanitizedNode = sanitizeNode(child);
    if (sanitizedNode) {
      cleanFragment.appendChild(sanitizedNode);
    }
  }

  return cleanFragment;
}

function sanitizeNode(node: Node): Node | null {
  if (node.nodeType === Node.TEXT_NODE) {
    return document.createTextNode(node.textContent ?? "");
  }

  if (!(node instanceof HTMLElement)) return null;

  const tagName = node.tagName.toLowerCase() as ElementTag;
  if (LINE_BREAK_TAGS.has(tagName)) {
    return document.createElement(ElementTag.BR);
  }

  if (!ALLOWED_PASTE_TAGS.has(tagName)) {
    const nestedFragment = document.createDocumentFragment();
    for (const child of Array.from(node.childNodes)) {
      const sanitizedChild = sanitizeNode(child);
      if (sanitizedChild) {
        nestedFragment.appendChild(sanitizedChild);
      }
    }
    if (BLOCK_TAGS_TO_LINE_BREAK.has(tagName)) {
      appendLineBreakIfNeeded(nestedFragment);
    }
    return nestedFragment;
  }

  if (tagName === ElementTag.A) {
    return sanitizeAnchor(node);
  }

  const unsupportedAllowedTag = document.createDocumentFragment();
  for (const child of Array.from(node.childNodes)) {
    const sanitizedChild = sanitizeNode(child);
    if (sanitizedChild) {
      unsupportedAllowedTag.appendChild(sanitizedChild);
    }
  }
  return unsupportedAllowedTag;
}

function sanitizeAnchor(node: HTMLElement): HTMLAnchorElement {
  const anchor = document.createElement(ElementTag.A);
  const href = node.getAttribute("href")?.trim() ?? "";
  if (/^(https?:|mailto:|tel:|\/|#)/i.test(href)) {
    anchor.setAttribute("href", href);
  }

  const target = node.getAttribute("target");
  if (target === "_blank") {
    anchor.setAttribute("target", "_blank");
    anchor.setAttribute("rel", "noopener noreferrer");
  }

  for (const child of Array.from(node.childNodes)) {
    const sanitizedChild = sanitizeNode(child);
    if (sanitizedChild) {
      anchor.appendChild(sanitizedChild);
    }
  }
  return anchor;
}

function appendLineBreakIfNeeded(fragment: DocumentFragment) {
  const lastNode = fragment.lastChild;
  if (
    lastNode instanceof HTMLElement &&
    lastNode.tagName.toLowerCase() === ElementTag.BR
  ) {
    return;
  }
  fragment.appendChild(document.createElement(ElementTag.BR));
}
