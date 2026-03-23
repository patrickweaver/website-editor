import {
  FlexAlignCssValues,
  TextAlignCssValues,
  AlignOptions,
} from "../../types";
import { setUnsavedChanges } from "../util/setUnsavedChanges";

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
  setUnsavedChanges();
}
