import { getAlignValueFromFieldset } from "./getAlignValueFromFieldset";
import { EDITOR_TYPES } from "../../util/constants";
import {
  AlignOptions,
  EventType,
  InsertPosition,
  ElementTag,
} from "../../types";
import { getDataURLFromFile, isImageFile } from "../../util/files";
import { handleUpdateImageAlign } from "../events/handleUpdateImageAlign";
import { createElement } from "./createElement";
import { insertElementToDOM } from "./insertElementToDOM";
import { scrollToElement } from "./scrollToElement";
import { getEditorContainerId } from "../../util/stringUtils";
import { makeElementEventListener } from "../events/makeElementEventListener";
import { ERROR_IMAGE_ONLY, ERROR_NO_IMAGE } from "../../util/strings";
import { insertElementWithinElement } from "./insertElementWithinElement";

export async function prepareImageForEditor({
  filePickerId,
  altText,
  href,
  alignSelectElement,
  originalElement,
}: {
  filePickerId: string;
  altText: string;
  href: string;
  alignSelectElement: HTMLFieldSetElement;
  originalElement: HTMLImageElement;
}) {
  // TODO is this function misnamed?
  const value = getAlignValueFromFieldset(alignSelectElement);
  if (
    value !== AlignOptions.DEFAULT &&
    value !== AlignOptions.LEFT &&
    value !== AlignOptions.CENTER &&
    value !== AlignOptions.RIGHT
  )
    return null;
  const style = handleUpdateImageAlign(value);
  const filePicker = document?.getElementById(filePickerId);
  if (!(filePicker instanceof HTMLInputElement)) return null;
  const file = filePicker?.files?.[0];
  if (file && !isImageFile(file)) {
    // This won't happen because button is disabled
    // unless file is an image
    alert(ERROR_IMAGE_ONLY);
    return null;
  }

  let parentElement: HTMLAnchorElement | HTMLImageElement;
  const newImageElement = createElement({
    tag: ElementTag.IMG,
    style,
    altText,
  });
  parentElement = newImageElement;

  const hasValidHref = href && href.trim() !== "";
  if (hasValidHref) {
    const anchorElement = createElement({
      tag: ElementTag.A,
      href,
    });
    parentElement = anchorElement;
    insertElementWithinElement(
      parentElement,
      newImageElement,
      InsertPosition.AFTER_BEGIN,
    );
  }

  const containerId = getEditorContainerId(filePickerId);
  insertElementToDOM(containerId, parentElement, InsertPosition.AFTER_END);
  scrollToElement(parentElement.id);

  if (file) {
    newImageElement.src = await getDataURLFromFile(file);
  } else if (originalElement.src) {
    newImageElement.src = originalElement.src;
  } else {
    alert(ERROR_NO_IMAGE);
    return null;
  }

  // TODO with link this is now uneditable
  newImageElement.addEventListener(
    EventType.CLICK,
    makeElementEventListener(EDITOR_TYPES.IMAGE),
  );
  return newImageElement;
}
