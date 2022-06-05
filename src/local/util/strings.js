import { EDIT_CLASS, STRINGS } from "../constants";
import { createElement } from "./dom";

export function createEditorLabel(editorId, type, text = null) {
  return createElement({
    tag: "label",
    innerHTML: STRINGS?.EDITOR_LABELS?.[type] ?? text,
    htmlFor: editorId,
    classList: [EDIT_CLASS],
  });
}

export function getButtonId(label, editorId) {
  return `${slugify(label)}-${editorId}`;
}

export function getEditorContainerId(editorId) {
  return `container-${editorId}`;
}

export function slugify(string) {
  return string.split(" ").join("-").toLowerCase();
}
