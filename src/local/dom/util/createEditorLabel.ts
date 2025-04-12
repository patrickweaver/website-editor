import { EDIT_CLASS, STRINGS } from "../../constants";
import { EditorTypes } from "../../types";
import { createElement } from "./createElement";
import { ElementTag } from "../../types";

export function createEditorLabel(
  editorId: string,
  type: EditorTypes,
  text: string = "",
) {
  return createElement({
    tag: ElementTag.LABEL,
    innerHTML: STRINGS.EDITOR_LABELS?.[type] ?? text,
    htmlFor: editorId,
    classList: [EDIT_CLASS],
  });
}
