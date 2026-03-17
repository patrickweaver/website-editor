import { GLOBALS } from "../../../globals";
import { TextElementProperty } from "../../types";

export function elementUpdateCleanup(
  updatedElement: HTMLElement,
  originalElement: HTMLElement,
  propertyArray: TextElementProperty[],
) {
  if (!updatedElement) return false;
  const _editingStateDirty = propertyArray.some((p) => {
    const updatedValue = updatedElement?.[p];
    const originalValue = originalElement?.[p];
    // 🚸 TODO only check relevant sub properties for style
    // https://github.com/patrickweaver/website-editor/issues/87
    return updatedValue !== originalValue;
  });
  originalElement.remove();
  GLOBALS.EDITING_STATE_DIRTY =
    GLOBALS.EDITING_STATE_DIRTY || _editingStateDirty;
  return true;
}
