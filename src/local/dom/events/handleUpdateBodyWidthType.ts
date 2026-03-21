import { GLOBALS } from "../../../globals";
import {
  UPDATE_BODY_ALIGN_ID,
  WIDTH_SLIDER_CONTAINER_ID,
  BODY_WIDTH_RANGE_INPUT_ID,
  BODY_WIDTH_NUMBER_INPUT_ID,
  BODY_WIDTH_OPTIONS,
} from "../../util/constants";
import { handleUpdateBodyAlignment } from "./handleUpdateBodyAlignment";

export function handleUpdateBodyWidthType(event: Event) {
  if (!(event.target instanceof HTMLInputElement)) return;
  const fullWidth = event.target.value === BODY_WIDTH_OPTIONS.FULL;
  const widthSlider = document.getElementById(BODY_WIDTH_RANGE_INPUT_ID);
  if (!(widthSlider instanceof HTMLInputElement)) return;
  widthSlider.disabled = fullWidth;
  const alignmentFieldset = document.getElementById(UPDATE_BODY_ALIGN_ID);
  if (!(alignmentFieldset instanceof HTMLFieldSetElement)) return;
  alignmentFieldset.disabled = fullWidth;
  const widthSliderContainer = document.getElementById(
    WIDTH_SLIDER_CONTAINER_ID,
  );
  if (!widthSliderContainer) return;
  widthSliderContainer.style.setProperty(
    "display",
    fullWidth ? "none" : "block",
  );
  const widthSliderValueDisplay = document.getElementById(
    BODY_WIDTH_NUMBER_INPUT_ID,
  );
  if (!(widthSliderValueDisplay instanceof HTMLInputElement)) return;
  // TODO don't hide UI on full width
  if (fullWidth) {
    widthSliderValueDisplay.disabled = true;
    document.body.style.setProperty("width", "calc(100% - 4rem)");
    document.body.style.setProperty("margin", "2rem");
  } else {
    widthSliderValueDisplay.disabled = false;
    const widthPx = `${widthSlider.value}px`;
    document.body.style.setProperty("width", widthPx);
    widthSliderValueDisplay.value = widthSlider.value;
    handleUpdateBodyAlignment(event);
  }

  GLOBALS.EDITING_STATE_DIRTY = true;
}
