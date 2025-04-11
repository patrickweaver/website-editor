import { InsertPosition } from "../../types";

export function insertElementWithinElement(
  parent: HTMLElement,
  element: HTMLElement,
  position:
    | InsertPosition.AFTER_BEGIN
    | InsertPosition.BEFORE_END = InsertPosition.BEFORE_END,
) {
  parent.insertAdjacentElement(position, element);
}
