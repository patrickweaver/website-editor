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
import { InsertPosition } from "../../types";
import { showAlert } from "../util/alert";
import { getToolbar } from "../ui/toolbar";
import { getEditableType } from "../ui/util";
import { validateElementForEditing } from "../util/validateElementForEditing";
import { insertElementNextToElement } from "../util/insertElementNextToElement";

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
