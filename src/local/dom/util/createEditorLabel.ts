import { EDIT_CLASS, STRINGS } from "../../constants";
import { EditorTypes } from "../../types";
import { _ElementTag, createElement } from "./createElement";

export function createEditorLabel(
  editorId: string,
  type: EditorTypes,
  text: string = "",
) {
  return createElement({
    tag: _ElementTag.LABEL,
    innerHTML: STRINGS.EDITOR_LABELS?.[type] ?? text,
    htmlFor: editorId,
    classList: [EDIT_CLASS],
  });
}
