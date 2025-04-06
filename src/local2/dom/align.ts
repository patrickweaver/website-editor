import { GLOBALS } from "../../globals";
import { showAlert } from "../util/alert";

export function getAlignValueFromFieldset(
  alignSelectElement: HTMLFieldSetElement,
) {
  const selectedAlign = Array.from(alignSelectElement.children)
    .map((container) => Array.from(container.children)[0])
    .filter((element) => {
      return (element as HTMLInputElement)?.checked;
    })[0];
  return (selectedAlign as HTMLInputElement)?.value;
}

export function onUpdateBodyAlign(_changeEvent: Event) {
  const { value } = document.querySelector(
    "input[type='radio'][name='body-align']:checked",
  ) as HTMLInputElement;
  if (value === "left") {
    document.body.style.margin = "2rem";
  } else if (value === "center") {
    document.body.style.margin = "2rem auto";
  }
}

export function onUpdateBodyTextAlign(changeEvent: Event) {
  const { value } = changeEvent.target as HTMLInputElement;
  const flexClasses = {
    left: "flex-start",
    center: "center",
    right: "flex-end",
  };
  if (!Object.keys(flexClasses).includes(value)) {
    showAlert(`Invalid alignment: ${value}`);
  }
  const _value = value as "left" | "center" | "right";
  document.body.style.textAlign = _value;
  document.body.style.alignItems = flexClasses[_value];
  GLOBALS.EDITING_STATE_DIRTY = true;
}

export function onUpdateBodyTextSize(changeEvent: Event) {
  const { value } = changeEvent.target as HTMLInputElement;
  document.body.style.fontSize = `${value}%`;
  document.body.style.lineHeight = `${value}%`;
}
