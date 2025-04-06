import { GLOBALS } from "../../../globals";
import {
  FlexAlignCssValues,
  TextAlignCssValues,
  AlignOptions,
} from "../../types";

export function handleUpdateBodyTextAlign(event: Event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;
  const { value } = target;
  if (
    value !== AlignOptions.LEFT &&
    value !== AlignOptions.CENTER &&
    value !== AlignOptions.RIGHT
  )
    return;
  document.body.style.setProperty("text-align", TextAlignCssValues[value]);
  document.body.style.setProperty("align-items", FlexAlignCssValues[value]);
  GLOBALS.EDITING_STATE_DIRTY = true;
}
