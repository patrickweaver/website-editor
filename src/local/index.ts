import { activateElementListeners } from "./dom/activateElementListeners";
import { activatePageListeners } from "./dom/activatePageListeners";
import { enableLocalControls } from "./dom/enableLocalControls";

/* JavaScript enabling editing only runs locally */
export function localEditingMode() {
  console.log("Local editing mode enabled");

  activateElementListeners();
  enableLocalControls();
  activatePageListeners();
}
