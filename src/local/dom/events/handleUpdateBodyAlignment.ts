import { OPTIONS } from "../../constants";

export function handleUpdateBodyAlignment(_event: Event) {
  const selectedAlignmentElement = document.querySelector(
    "input[type='radio'][name='body-align']:checked",
  );
  if (!(selectedAlignmentElement instanceof HTMLInputElement)) return;
  const { value } = selectedAlignmentElement;
  OPTIONS.LC_BODY_ALIGNMENT_OPTIONS.forEach((option) => {
    if (value === option.value) {
      Object.entries(option.style).forEach(([k, v]) => {
        document;
        document.body.style.setProperty(k, v);
      });
    }
  });
  // if (value === OPTIONS.LC_BODY_ALIGNMENT_OPTIONS[0].value) {
  //   document.body.style.margin = "2rem";
  // } else if (value === OPTIONS.LC_BODY_ALIGNMENT_OPTIONS[1].value) {
  //   document.body.style.margin = "2rem auto";
  // }
}
