import { GLOBALS } from "../../../globals";
import {
  AlignItemsCssValues,
  TextAlignCssValues,
  TextAlignOptions,
} from "../../types";

export function handleUpdateBodyTextAlign(event: Event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;
  const { value } = target;
  if (
    value !== TextAlignOptions.LEFT &&
    value !== TextAlignOptions.CENTER &&
    value !== TextAlignOptions.RIGHT
  )
    return;
  document.body.style.setProperty("text-align", TextAlignCssValues[value]);
  document.body.style.setProperty("align-items", AlignItemsCssValues[value]);
  GLOBALS.EDITING_STATE_DIRTY = true;
}
