import { WIDTH_SLIDER_VALUE_ID } from "../../constants";

export function handleUpdateWidth(event: Event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;
  const value = `${target.value}px`;
  document.body.style.setProperty("width", value);
  const widthSliderValueDisplay = document.getElementById(
    WIDTH_SLIDER_VALUE_ID,
  );
  if (!widthSliderValueDisplay) return;
  widthSliderValueDisplay.innerHTML = value;
}
