import {
  AlignOptions,
  ElementTag,
  EventType,
  FlexAlignCssValues,
  InsertPosition,
  TextAlignCssValues,
} from "../../types";
import {
  CURRENTLY_EDITING_ALT_TEXT_ID,
  CURRENTLY_EDITING_FORMATTING_ID,
  CURRENTLY_EDITING_NEW_ANCHOR_ID,
  CURRENTLY_EDITING_UPLOAD_ID,
  DATA_ORIGINAL_ALT,
  DATA_ORIGINAL_CSS,
  DATA_ORIGINAL_HTML,
  DATA_ORIGINAL_SRC,
  DATA_ORIGINAL_TAG_NAME,
  EditableType,
} from "../../util/constants";
import { getDataURLFromFile, isImageFile } from "../../util/files";
import { CONFIRM_DELETE } from "../../util/strings";
import { activateAnchorListeners } from "../activateListeners";
import {
  openAltTextPanel,
  openFormattingPanel,
  openUploadPanel,
} from "../ui/toolbar";
import {
  getCurrentlyEditingElement,
  getCurrentlyEditingLinkHandler,
  getCurrentlyEditingToolbar,
  getEditableType,
} from "../ui/util";
import { addLinkAroundElement } from "../util/addLinkAroundElement";
import { addLinkAroundSelection } from "../util/addLinkAroundSelection";
import { showAlert } from "../util/alert";
import { createElement } from "../util/createElement";
import { insertElementNextToElement } from "../util/insertElementNextToElement";
import { setUnsavedChanges } from "../util/setUnsavedChanges";
import {
  getAnchorEventListener,
  getElementEventListener,
} from "./getEventListener";

export async function actionDeleteElement(_event: Event) {
  const result = window.confirm(CONFIRM_DELETE);
  if (!result) return;
  const currentlyEditing = getCurrentlyEditingElement();
  if (!currentlyEditing) return;
  const toolbar = getCurrentlyEditingToolbar();
  toolbar?.remove();
  currentlyEditing.remove();
}

function exitEditMode(element: HTMLElement | null) {
  const linkHandler = getCurrentlyEditingLinkHandler();
  linkHandler?.remove();
  const toolbar = getCurrentlyEditingToolbar();
  toolbar?.remove();
  if (!element) return;
  const editableType = getEditableType();
  const isImage =
    editableType === EditableType.IMAGE && element instanceof HTMLImageElement;
  const trimmedInnerHtml = element?.innerHTML
    .replace(/<br\s*\/?>/gi, "")
    .trim();

  if ((isImage && !element.src) || (!isImage && !trimmedInnerHtml)) {
    element.remove();
    return;
  }
  element.removeAttribute("id");
  element.removeAttribute("contentEditable");
  element.removeAttribute(DATA_ORIGINAL_HTML);
  element.removeAttribute(DATA_ORIGINAL_CSS);
  element.removeAttribute(DATA_ORIGINAL_SRC);
  element.removeAttribute(DATA_ORIGINAL_ALT);
}

export function cancelEdit() {
  const currentlyEditingLinkHandler = getCurrentlyEditingLinkHandler();
  const currentlyEditing = getCurrentlyEditingElement();
  if (!currentlyEditing) {
    if (!currentlyEditingLinkHandler) return false;
    exitEditMode(null);
    return;
  }

  const editableType = getEditableType();
  if (editableType === EditableType.TEXT) {
    restoreInnerHtml(currentlyEditing);
  }
  const isImage =
    editableType === EditableType.IMAGE &&
    currentlyEditing instanceof HTMLImageElement;
  if (isImage) {
    restoreImageAttributes(currentlyEditing);
  }
  restoreCss(currentlyEditing);

  // Must be last, replace variable because tag is possibly updated
  const currentlyEditingReplaced = restoreTagName(currentlyEditing);

  exitEditMode(currentlyEditingReplaced);
  return true;
}

function restoreTagName(element: HTMLElement): HTMLElement {
  const originalTagName = element.getAttribute(DATA_ORIGINAL_TAG_NAME);
  if (element.tagName.toLowerCase() === originalTagName) return element;
  if (
    originalTagName !== ElementTag.H1 &&
    originalTagName !== ElementTag.H2 &&
    originalTagName !== ElementTag.H3 &&
    originalTagName !== ElementTag.H4 &&
    originalTagName !== ElementTag.H5 &&
    originalTagName !== ElementTag.H6
  )
    return element;
  return updateTagName(element, originalTagName);
}

function restoreInnerHtml(element: HTMLElement) {
  const originalHtmlEscaped = element.getAttribute(DATA_ORIGINAL_HTML);
  if (originalHtmlEscaped) {
    const originalHtmlUnescaped = decodeURIComponent(originalHtmlEscaped);
    element.innerHTML = originalHtmlUnescaped;
    activateAnchorListeners(element);
  }
}

function restoreImageAttributes(element: HTMLImageElement) {
  const originalSrc = element.getAttribute(DATA_ORIGINAL_SRC);
  if (originalSrc) {
    element.src = originalSrc;
  }
  const originalAlt = element?.getAttribute(DATA_ORIGINAL_ALT);
  if (originalAlt) {
    element.alt = originalAlt;
  } else {
    element.removeAttribute("alt");
  }
}

function restoreCss(element: HTMLElement) {
  const originalCssEscaped = element.getAttribute(DATA_ORIGINAL_CSS);
  if (originalCssEscaped) {
    const originalCssUnescaped = decodeURIComponent(originalCssEscaped);
    const originalCssParsed = JSON.parse(originalCssUnescaped);
    const keys = Object.keys(originalCssParsed);
    for (const prop of keys) {
      const value = originalCssParsed[prop];
      if (value === "") {
        element.style.removeProperty(prop);
        continue;
      }
      element.style.setProperty(prop, value);
    }
  } else {
    showAlert(`Error restoring CSS for ${element.tagName} element.`);
  }
  if (element?.parentElement instanceof HTMLAnchorElement) {
    restoreCss(element.parentElement);
  }
}

export async function actionCancelEdit(_event: Event) {
  cancelEdit();
}

export async function actionSaveChanges(_event: Event) {
  const element = getCurrentlyEditingElement();
  if (!element) return;
  exitEditMode(element);
  setUnsavedChanges();
}

export async function actionCreateLink(_event: Event) {
  const element = getCurrentlyEditingElement();
  const isImage = element instanceof HTMLImageElement;
  if (!(element instanceof HTMLElement)) return;
  if (isImage) {
    addLinkAroundElement(element);
  } else {
    element.innerHTML = addLinkAroundSelection(element);
    const anchor = document.getElementById(CURRENTLY_EDITING_NEW_ANCHOR_ID);
    if (!anchor) return;
    const listener = getAnchorEventListener();
    anchor.addEventListener(EventType.CLICK, listener, { capture: true });
  }
}

function closePanels(current: string) {
  const panelIds = [
    CURRENTLY_EDITING_ALT_TEXT_ID,
    CURRENTLY_EDITING_FORMATTING_ID,
    CURRENTLY_EDITING_UPLOAD_ID,
  ];
  panelIds.forEach((id) => {
    if (id !== current) {
      const panel = document.getElementById(id);
      panel?.remove();
    }
  });
}

export async function actionOpenFormatPanel(_event: Event) {
  closePanels(CURRENTLY_EDITING_FORMATTING_ID);
  openFormattingPanel();
}

export async function actionOpenUploadPanel(_event: Event) {
  closePanels(CURRENTLY_EDITING_UPLOAD_ID);
  openUploadPanel();
}

export async function actionOpenAltTextPanel(_evnet: Event) {
  closePanels(CURRENTLY_EDITING_ALT_TEXT_ID);
  openAltTextPanel();
}

export async function actionHandleImageUpload(event: Event) {
  const target = event.currentTarget;

  const element = getCurrentlyEditingElement();
  if (!element) {
    showAlert("Error: Invalid element");
    return;
  }

  if (!(element instanceof HTMLImageElement)) {
    showAlert("Error: Element not image.");
    return;
  }
  const isInput = target instanceof HTMLInputElement;
  if (!isInput) {
    showAlert("Error: Invalid element.");
    return;
  }
  const { files } = target;
  if (!files?.[0]) {
    showAlert("Error: Invalid file.");
    return;
  }
  const validFile = isImageFile(files[0]);
  if (!validFile) {
    showAlert("Error: Invalid file.");
    return;
  }
  const url = await getDataURLFromFile(files[0]);

  element.setAttribute("src", url);
  const uploadPanel = document.getElementById(CURRENTLY_EDITING_UPLOAD_ID);
  uploadPanel?.remove();
}

export function actionHandleAltTextUpdate(event: Event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return null;
  const value = target?.value ?? "";

  const element = getCurrentlyEditingElement();
  if (!element || !(element instanceof HTMLImageElement)) {
    showAlert("Invalid element.");
    return;
  }
  element.alt = value;
}

function handleAlignUpdate(event: Event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return null;
  const value = target?.value?.toUpperCase();
  if (
    value !== AlignOptions.LEFT &&
    value !== AlignOptions.CENTER &&
    value !== AlignOptions.RIGHT
  )
    return null;
  return value;
}

function handleHeadingLevelUpdate(event: Event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return null;
  const value = target?.value?.toLowerCase();
  if (
    value !== ElementTag.H1 &&
    value !== ElementTag.H2 &&
    value !== ElementTag.H3 &&
    value !== ElementTag.H4 &&
    value !== ElementTag.H5 &&
    value !== ElementTag.H6
  )
    return null;
  return value;
}

export function actionUpdateTextAlign(event: Event): void {
  const value = handleAlignUpdate(event);
  if (!value) return;
  const element = getCurrentlyEditingElement();
  if (!element) {
    showAlert("Error: Invlaid element");
    return;
  }
  element.style.setProperty("text-align", TextAlignCssValues[value]);
}

export function actionUpdateImageAlign(event: Event): void {
  const value = handleAlignUpdate(event);
  if (!value) return;
  const element = getCurrentlyEditingElement();
  if (!element) {
    showAlert("Error: Invalid element");
    return;
  }
  let wrapperElement = element;
  if (element.parentElement instanceof HTMLAnchorElement) {
    wrapperElement = element.parentElement;
  }
  wrapperElement.style.setProperty("align-self", FlexAlignCssValues[value]);
}

export function actionUpdateHeadingLevel(event: Event): void {
  const value = handleHeadingLevelUpdate(event);
  if (!value) return;
  const element = getCurrentlyEditingElement();
  if (!element) {
    showAlert("Error: Invalid element.");
    return;
  }
  updateTagName(element, value);
}

export function getActionOpenLink(
  anchor: HTMLAnchorElement,
  _relatedElement: HTMLHeadingElement | HTMLParagraphElement | HTMLImageElement,
  _relatedElementCallback: (element: HTMLElement) => void,
  linkToolbar: HTMLDivElement,
): (event: Event) => void {
  return (event: Event) => {
    event.stopPropagation();
    window.open(anchor.href, anchor.target || "_self");
    linkToolbar.remove();
  };
}

export function getActionOpenEditor(
  _anchor: HTMLAnchorElement,
  relatedElement: HTMLHeadingElement | HTMLParagraphElement | HTMLImageElement,
  relatedElementCallback: (element: HTMLElement) => void,
  linkToolbar: HTMLDivElement,
): (event: Event) => void {
  return (event: Event) => {
    event.stopPropagation();
    relatedElementCallback(relatedElement);
    linkToolbar.remove();
  };
}

function updateTagName(
  element: HTMLElement,
  newTagName: ElementTag,
): HTMLElement {
  const replacement = createElement({
    tag: newTagName,
  });
  for (const attribute of element.attributes) {
    replacement.setAttribute(attribute.name, attribute.value);
  }

  while (element.firstChild) {
    replacement.appendChild(element.firstChild);
  }
  insertElementNextToElement(element, replacement, InsertPosition.AFTER_END);
  element.remove();
  replacement.addEventListener(EventType.CLICK, getElementEventListener());
  return replacement;
}
