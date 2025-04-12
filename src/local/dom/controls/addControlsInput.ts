import { INPUT_TYPE_TEXT_CLASS, INPUT_TYPES } from "../../constants";
import { ElementTag } from "../../types";
import { createElement } from "../util/createElement";

export function addControlsInput(
  id: string,
  _type: INPUT_TYPES | undefined,
  labelText: string,
  value: string = "",
  _classList: string[] = [],
): [HTMLLabelElement, HTMLInputElement | HTMLTextAreaElement] {
  const label = createElement({
    tag: ElementTag.LABEL,
    innerHTML: labelText,
    htmlFor: id,
  });
  let classList = _classList;
  if (_type === INPUT_TYPES.TEXT) classList.push(INPUT_TYPE_TEXT_CLASS);
  let tag = ElementTag.INPUT;
  let type = _type;
  if (_type === INPUT_TYPES.TEXTAREA) {
    tag = ElementTag.TEXTAREA;
    type = undefined;
  }
  const input = createElement({ id, tag, type, value, classList });
  return [label, input];
}
