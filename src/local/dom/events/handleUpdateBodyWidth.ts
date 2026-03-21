import { GLOBALS } from "../../../globals";
import {
  BODY_WIDTH_NUMBER_INPUT_ID,
  BODY_WIDTH_RANGE_INPUT_ID,
  SETTINGS,
} from "../../util/constants";

export function handleUpdateBodyWidth(event: Event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;
  let value = parseInt(target.value);

  const numberInput = document.getElementById(BODY_WIDTH_NUMBER_INPUT_ID);
  const rangeInput = document.getElementById(BODY_WIDTH_RANGE_INPUT_ID);
  if (!numberInput || !rangeInput) return;
  if (!(numberInput instanceof HTMLInputElement)) return;
  if (!(rangeInput instanceof HTMLInputElement)) return;

  if (value < parseInt(SETTINGS.BODY_WIDTHS[0])) {
    value = parseInt(SETTINGS.BODY_WIDTHS[0]);
  } else if (
    value > parseInt(SETTINGS.BODY_WIDTHS[SETTINGS.BODY_WIDTHS.length - 1])
  ) {
    value = parseInt(SETTINGS.BODY_WIDTHS[SETTINGS.BODY_WIDTHS.length - 1]);
  }
  const valueString = `${value}px`;
  document.body.style.setProperty("width", valueString);
  numberInput.value = String(value);
  rangeInput.value = String(value);
  GLOBALS.EDITING_STATE_DIRTY = true;
}
