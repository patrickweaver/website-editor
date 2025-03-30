import { createElement } from "..";
import { EDIT_CLASS, STRINGS } from "../../constants";

export function createEditorLabel(editorId, type, text = null) {
  return createElement({
    tag: "label",
    innerHTML: STRINGS?.EDITOR_LABELS?.[type] ?? text,
    htmlFor: editorId,
    classList: [EDIT_CLASS],
  });
}
