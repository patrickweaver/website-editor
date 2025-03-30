import { GLOBALS } from "../../globals";
import { getDataURLFromFile } from "../util/files";
import { getUniqueId } from "../util/random";
import { rgb2hex } from "../util/color.ts";
import { getAlignValueFromFieldset } from "./align";
import { imageEventListener, textEventListener } from "./events/listeners";
import { onUpdateImgElementAlign } from "./events/handlers";
import { getEditorContainerId } from "../util/strings";
import { isImageFile } from "../util/files";
import {
  CURRENT_FAVICON_PREVIEW_ID,
  CURRENT_SOCIAL_IMAGE_ID,
  EDITOR_TYPES,
  END_OF_DOC_ID,
  FAVICON_QUERY_SELECTOR,
  HEADING_ELEMENTS,
  IMG_ELEMENT,
  PARAGRAPH_ELEMENT,
  STRINGS,
} from "../constants";

export function addAtEndOfDocument(element) {
  document
    .getElementById(END_OF_DOC_ID)
    .insertAdjacentElement("beforebegin", element);
}

export async function addImage({
  filePickerId,
  altText,
  alignSelectElement,
  originalElement,
}) {
  const imageAlign = getAlignValueFromFieldset(alignSelectElement);
  const style = onUpdateImgElementAlign(imageAlign);
  const file = document.getElementById(filePickerId).files[0];
  if (file && !isImageFile(file)) {
    // This won't happen because button is disabled
    // unless file is an image
    alert(STRINGS.ERROR_IMAGE_ONLY);
    return null;
  }
  const newElement = createElement({ tag: "img", style, altText });
  insertAdj(getEditorContainerId(filePickerId), newElement, "afterend");
  scrollToNewElement(newElement);

  if (file) {
    newElement.src = await getDataURLFromFile(file);
  } else if (originalElement.src) {
    newElement.src = originalElement.src;
  } else {
    alert(STRINGS.ERROR_NO_IMAGE);
    return null;
  }

  newElement.addEventListener("click", imageEventListener);
  return newElement;
}

export function addNewTextElementEditor(type = EDITOR_TYPES.PARAGRAPH) {
  const tag =
    type === EDITOR_TYPES.HEADING
      ? HEADING_ELEMENTS[1] // h2
      : PARAGRAPH_ELEMENT;
  const innerHTML = STRINGS.PLACEHOLDER_TEXT;
  const newElement = createElement({ tag, innerHTML });
  addNewEditorCleanup(newElement, textEventListener);
}

export function addNewHeadingEditor() {
  return addNewTextElementEditor(EDITOR_TYPES.HEADING);
}

export function addNewParagraphEditor() {
  return addNewTextElementEditor();
}

export function addNewImageEditor() {
  const tag = IMG_ELEMENT;
  const newElement = createElement({ tag });
  addNewEditorCleanup(newElement, imageEventListener);
}

function addNewEditorCleanup(newElement, editCallback) {
  addAtEndOfDocument(newElement);
  scrollToNewElement(newElement);
  const fakeEvent = { currentTarget: newElement };
  editCallback(fakeEvent, false);
}

export function addText({ editorId, tagName, alignSelectElement, text }) {
  const textAlign = getAlignValueFromFieldset(alignSelectElement);
  const style = textAlign === "default" ? {} : { textAlign };
  const newElement = createElement({
    tag: tagName,
    innerHTML: text,
    style,
  });
  insertAdj(getEditorContainerId(editorId), newElement, "afterend");
  scrollToNewElement(newElement);
  newElement.addEventListener("click", textEventListener);
  return newElement;
}

export function addLinkAroundSelection(selectableInput) {
  const { selectionStart: start, selectionEnd: end, value } = selectableInput;
  if (start === end) {
    alert(STRINGS.ERROR_NO_SELECTION);
    return value;
  }
  const selection = value.substring(start, end);
  const url = window.prompt(STRINGS.PROMPT_LINK_URL);
  return `${value.slice(
    0,
    start
  )}<a href="${url}" target="_blank">${selection}</a>${value.slice(
    end,
    value.length
  )}`;
}

export function createElement({
  tag = "div",
  id = null,
  uniqueId = false,
  classList = [],
  style = {},
  innerHTML = null,
  value = null,
  type = null,
  name = null,
  htmlFor = null,
  imageSrc = null,
  altText = null,
} = {}) {
  const element = document.createElement(tag);
  if (id) {
    element.id = `${id}${uniqueId ? `-${getUniqueId()}` : ""}`;
  }
  classList.forEach((htmlClass) => element.classList.add(htmlClass));
  Object.keys(style).forEach((key) => (element.style[key] = style[key]));
  const properties = {
    innerHTML,
    value,
    type,
    name,
    htmlFor,
    src: imageSrc,
    alt: altText,
  };
  Object.keys(properties).forEach((p) => {
    if (properties[p] !== null) element[p] = properties[p];
  });
  return element;
}

export function getCurrentStyle(property) {
  const currentStyle = document.body?.style?.[property];
  if (property.toLowerCase().indexOf("color") >= 0)
    return rgb2hex(currentStyle || "rgb(255, 255, 255)");
  return property;
}

export function getCurrentFaviconURL() {
  return document.querySelector(FAVICON_QUERY_SELECTOR).href;
}

export function getCurrentSocialImage() {
  const { href: url, alt } = document.getElementById(CURRENT_SOCIAL_IMAGE_ID);
  return { url, alt };
}

export function insertAdj(id, element, pos = "afterbegin") {
  document.getElementById(id).insertAdjacentElement(pos, element);
}

export async function insertFavicon(file) {
  const oldElement = document.querySelector(FAVICON_QUERY_SELECTOR);
  oldElement.remove();
  const newElement = createElement({ tag: "link" });
  const dataURL = await getDataURLFromFile(file);
  newElement.rel = "icon";
  newElement.href = dataURL;
  const faviconPreviewElement = document.getElementById(
    CURRENT_FAVICON_PREVIEW_ID
  );
  faviconPreviewElement.src = dataURL;
  document.getElementsByTagName("head")[0].appendChild(newElement);
  GLOBALS.EDITING_STATE_DIRTY = true;
}

export function scrollToNewElement(element) {
  const elementTop = element.getBoundingClientRect().top;
  if (elementTop < 0) {
    const { scrollTop } = document.documentElement;
    const scrollTo = elementTop + scrollTop - 20;
    window.scrollTo(0, scrollTo < 0 ? 0 : scrollTo);
  }
}
