import { getAlignValueFromFieldset } from "../../../local2/dom/align";
import { STRINGS } from "../../constants";
import { AlignOptions, EventType, InsertPosition } from "../../types";
import { getDataURLFromFile, isImageFile } from "../../util/files";
import { handleUpdateImageAlign } from "../events/handleUpdateImageAlign";
import { imageEventListener } from "../events/imageEventListener";
import { _ElementTag, createElement } from "./createElement";
import { insertElementToDOM } from "./insertElementToDOM";
import { scrollToElement } from "./scrollToElement";
import { getEditorContainerId } from "../../util/strings";

export async function prepareImageForEditor({
  filePickerId,
  altText,
  alignSelectElement,
  originalElement,
}: {
  filePickerId: string;
  altText: string;
  alignSelectElement: HTMLFieldSetElement;
  originalElement: HTMLImageElement;
}) {
  // TODO is this function misnamed?
  const value = getAlignValueFromFieldset(alignSelectElement);
  if (
    value !== AlignOptions.LEFT &&
    value !== AlignOptions.CENTER &&
    value !== AlignOptions.RIGHT
  )
    return;
  const style = handleUpdateImageAlign(value);
  const filePicker = document?.getElementById(filePickerId);
  if (!(filePicker instanceof HTMLInputElement)) return;
  const file = filePicker?.files?.[0];
  if (file && !isImageFile(file)) {
    // This won't happen because button is disabled
    // unless file is an image
    alert(STRINGS.ERROR_IMAGE_ONLY);
    return null;
  }
  const newElement = createElement({ tag: _ElementTag.IMG, style, altText });
  const containerId = getEditorContainerId(filePickerId);
  insertElementToDOM(containerId, newElement, InsertPosition.AFTER_END);
  scrollToElement(newElement.id);

  if (file) {
    newElement.src = await getDataURLFromFile(file);
  } else if (originalElement.src) {
    newElement.src = originalElement.src;
  } else {
    alert(STRINGS.ERROR_NO_IMAGE);
    return null;
  }

  newElement.addEventListener(EventType.CLICK, imageEventListener);
  return newElement;
}
