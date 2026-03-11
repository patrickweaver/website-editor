import { GLOBALS } from "../../../globals";
import {
  UPDATE_BODY_ALIGN_ID,
  WIDTH_SLIDER_CONTAINER_ID,
  BODY_WIDTH_RANGE_INPUT_ID,
  BODY_WIDTH_NUMBER_INPUT_ID,
} from "../../util/constants";
import { handleUpdateBodyAlignment } from "./handleUpdateBodyAlignment";

export function handleUpdateFullWidth(event: Event) {
  if (!(event.target instanceof HTMLInputElement)) return;
  const fullWidth = event.target.checked;
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
  let bodyWidth;
  let bodyMargin;
  const widthSliderValueDisplay = document.getElementById(
    BODY_WIDTH_NUMBER_INPUT_ID,
  );
  if (!(widthSliderValueDisplay instanceof HTMLInputElement)) return;
  if (!widthSliderValueDisplay) return;
  // TODO don't hide UI on full width
  if (fullWidth) {
    bodyWidth = "calc(100% - 4rem)";
    bodyMargin = "2rem";
    widthSliderValueDisplay.disabled = true;
  } else {
    bodyWidth = widthSlider.value;
    handleUpdateBodyAlignment(event);
    bodyMargin = "none";
    widthSliderValueDisplay.value = bodyWidth;
    widthSliderValueDisplay.disabled = false;
  }

  document.body.style.setProperty("width", bodyWidth);
  document.body.style.setProperty("margin", bodyMargin);
  GLOBALS.EDITING_STATE_DIRTY = true;
}
