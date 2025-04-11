import {
  UPDATE_BODY_ALIGN_ID,
  WIDTH_SLIDER_CONTAINER_ID,
  WIDTH_SLIDER_ID,
  WIDTH_SLIDER_VALUE_ID,
} from "../../constants";
import { handleUpdateBodyAlignment } from "./handleUpdateBodyAlignment";

export function handleUpdateFullWidth(event: Event) {
  if (!(event.target instanceof HTMLInputElement)) return;
  const fullWidth = event.target.checked;
  const widthSlider = document.getElementById(WIDTH_SLIDER_ID);
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
    WIDTH_SLIDER_VALUE_ID,
  );
  if (!widthSliderValueDisplay) return;
  if (fullWidth) {
    bodyWidth = "calc(100% - 4rem)";
    bodyMargin = "2rem";
    widthSliderValueDisplay.innerHTML = "Disabled";
  } else {
    bodyWidth = `${widthSlider.value}px`;
    handleUpdateBodyAlignment(event);
    bodyMargin = "none";
    widthSliderValueDisplay.innerHTML = bodyWidth;
  }

  document.body.style.setProperty("width", bodyWidth);
  document.body.style.setProperty("margin", bodyMargin);
}
