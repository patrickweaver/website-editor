import { GLOBALS } from "../../../globals";
import { ImgElementProperty } from "../../types";

export function imgElementUpdateCleanup(
  updatedElement: HTMLImageElement,
  originalElement: HTMLImageElement,
  propertyArray: ImgElementProperty[],
) {
  if (!updatedElement) return false;
  const _editingStateDirty = propertyArray.some((p) => {
    const updatedValue = updatedElement?.[p];
    const originalValue = originalElement?.[p];
    // 🚸 TODO only check relevant sub properties for style
    // https://github.com/patrickweaver/website-editor/issues/87
    return updatedValue !== originalValue;
  });
  // TODO need to remove the original anchor tag also.
  originalElement.remove();
  GLOBALS.EDITING_STATE_DIRTY =
    GLOBALS.EDITING_STATE_DIRTY || _editingStateDirty;
  return true;
}
