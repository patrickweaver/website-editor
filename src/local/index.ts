import { activateElementListeners } from "./dom/activateElementListeners";
import { activatePageListeners } from "./dom/activatePageListeners";
import { enableLocalControls } from "./dom/enableLocalControls";

/* JavaScript enabling editing only runs locally */
export function localEditingMode() {
  console.log("Local editing mode enabled");

  boilerplateSetup();
  activateElementListeners();
  enableLocalControls();
  activatePageListeners();
}

function boilerplateSetup() {
  // https://stackoverflow.com/questions/18552336/prevent-contenteditable-adding-div-on-enter-chrome
  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      range.deleteContents();

      const br = document.createElement("br");
      range.insertNode(br);

      // Move cursor after the <br>
      range.setStartAfter(br);
      range.setEndAfter(br);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  });
}
