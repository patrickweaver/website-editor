import {
  CURRENTLY_EDITING_ID,
  CURRENTLY_EDITING_LINK_HANDLER_ID,
  CURRENTLY_EDITING_TOOLBAR_ID,
  EditableType,
} from "../../util/constants";

export function getCurrentlyEditingElement() {
  return document.getElementById(CURRENTLY_EDITING_ID);
}

export function getCurrentlyEditingToolbar() {
  return document.getElementById(CURRENTLY_EDITING_TOOLBAR_ID);
}

export function getCurrentlyEditingLinkHandler() {
  return document.getElementById(CURRENTLY_EDITING_LINK_HANDLER_ID);
}

export function getEditableType() {
  const element = getCurrentlyEditingElement();
  let editableType: EditableType | null = null;
  if (
    element instanceof HTMLParagraphElement ||
    element instanceof HTMLHeadingElement
  ) {
    editableType = EditableType.TEXT;
  } else if (element instanceof HTMLImageElement) {
    editableType = EditableType.IMAGE;
  }

  return editableType;
}
