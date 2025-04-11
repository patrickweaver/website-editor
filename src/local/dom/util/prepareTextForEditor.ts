import { getAlignValueFromFieldset } from "./getAlignValueFromFieldset";
import { EventType, InsertPosition } from "../../types";
import { _ElementTag, createElement, HeaderTag } from "./createElement";
import { insertElementToDOM } from "./insertElementToDOM";
import { scrollToElement } from "./scrollToElement";
import { getEditorContainerId } from "../../util/strings";
import { makeElementEventListener } from "../events/makeElementEventListener";
import { EDITOR_TYPES } from "../../constants";

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
  newElement.addEventListener(
    EventType.CLICK,
    makeElementEventListener(EDITOR_TYPES.TEXT),
  );
  return newElement;
}
