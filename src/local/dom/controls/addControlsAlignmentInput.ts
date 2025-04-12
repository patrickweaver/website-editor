import { INPUT_TYPES } from "../../constants";
import { ElementTag } from "../../types";
import { createElement } from "../util/createElement";
import { insertElementWithinElement } from "../util/insertElementWithinElement";
import { addControlsInput } from "./addControlsInput";

export function addControlsAlignmentInput(
  fieldsetId: string,
  legendText: string,
  options: {
    id: string;
    name: string;
    value: string;
    checked: boolean;
    labelText: string;
  }[],
): [HTMLFieldSetElement] {
  const fieldset = createElement({ tag: ElementTag.FIELDSET, id: fieldsetId });
  const legend = createElement({
    tag: ElementTag.LEGEND,
    innerHTML: legendText,
  });
  const optionElements = options.map((option) => {
    const { id, name, value, checked, labelText } = option;
    const container = createElement();
    const [label, input] = addControlsInput(
      id,
      INPUT_TYPES.RADIO,
      labelText,
      value,
    );
    input.name = name;
    if (input instanceof HTMLInputElement) {
      input.checked = checked;
    }
    insertElementWithinElement(container, input);
    insertElementWithinElement(container, label);
    return container;
  });
  insertElementWithinElement(fieldset, legend);
  optionElements.forEach((optionElement) =>
    insertElementWithinElement(fieldset, optionElement),
  );

  return [fieldset];
}
