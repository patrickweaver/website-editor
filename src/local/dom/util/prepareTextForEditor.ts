import { getAlignValueFromFieldset } from "../../../local2/dom/align";
import { InsertPosition } from "../../types";
import { textEventListener } from "../events/textEventListener";
import { _ElementTag, createElement, HeaderTag } from "./createElement";
import { insertElementToDOM } from "./insertElementToDOM";
import { scrollToElement } from "./scrollToElement";
import { getEditorContainerId } from "../../util/strings";

export function prepareTextForEditor({
  editorId,
  tagName,
  alignSelectElement,
  text,
}: {
  editorId: string;
  tagName: _ElementTag | HeaderTag;
  alignSelectElement: HTMLFieldSetElement;
  text: string;
}) {
  const textAlign = getAlignValueFromFieldset(alignSelectElement);
  const style = textAlign === "default" ? {} : { textAlign };
  const newElement = createElement({ tag: tagName, innerHTML: text, style });
  const containerId = getEditorContainerId(editorId);
  insertElementToDOM(containerId, newElement, InsertPosition.AFTER_END);
  scrollToElement(newElement.id);
  newElement.addEventListener("click", textEventListener);
  return newElement;
}
