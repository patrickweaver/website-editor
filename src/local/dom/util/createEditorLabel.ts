import { EDIT_CLASS } from "../../constants";
import { EditorTypes } from "../../types";
import { createElement } from "./createElement";
import { ElementTag } from "../../types";
import { EDITOR_LABELS } from "../../util/strings";

export function createEditorLabel(
  editorId: string,
  type: EditorTypes,
  text: string = "",
) {
  return createElement({
    tag: ElementTag.LABEL,
    innerHTML: EDITOR_LABELS?.[type] ?? text,
    htmlFor: editorId,
    classList: [EDIT_CLASS],
  });
}
