import { GLOBALS } from "../../globals";

export function getAlignValueFromFieldset(alignSelectElement) {
  const selectedAlign = Array.from(alignSelectElement.children)
    .map((container) => Array.from(container.children)[0])
    .filter((element) => {
      return element?.checked;
    })[0];
  return selectedAlign?.value;
}

export function onUpdateBodyAlign(_changeEvent) {
  const { value } = document.querySelector(
    "input[type='radio'][name='body-align']:checked"
  );
  if (value === "left") {
    document.body.style.margin = "2rem";
  } else if (value === "center") {
    document.body.style.margin = "2rem auto";
  }
}

export function onUpdateBodyTextAlign(changeEvent) {
  const { value } = changeEvent.target;
  const flexClasses = {
    left: "flex-start",
    center: "center",
    right: "flex-end",
  };
  document.body.style.textAlign = value;
  document.body.style.alignItems = flexClasses[value];
  GLOBALS.EDITING_STATE_DIRTY = true;
}
