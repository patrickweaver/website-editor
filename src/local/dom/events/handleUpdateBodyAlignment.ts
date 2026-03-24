import { OPTIONS } from "../../util/constants";
import { setUnsavedChanges } from "../util/setUnsavedChanges";

export function handleUpdateBodyAlignment(_event: Event) {
  const selectedAlignmentElement = document.querySelector(
    "input[type='radio'][name='body-align']:checked",
  );
  if (!(selectedAlignmentElement instanceof HTMLInputElement)) return;
  const { value } = selectedAlignmentElement;
  OPTIONS.LC_BODY_ALIGNMENT_OPTIONS.forEach((option) => {
    if (value === option.value) {
      Object.entries(option.style).forEach(([k, v]) => {
        document.body.style.setProperty(k, v);
      });
    }
  });

  setUnsavedChanges();
}
