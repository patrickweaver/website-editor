import { InsertPosition } from "../../types";

export function insertElementNextToElement(
  neighbor: HTMLElement,
  element: HTMLElement,
  position:
    | InsertPosition.BEFORE_BEGIN
    | InsertPosition.AFTER_END = InsertPosition.BEFORE_BEGIN,
) {
  neighbor.insertAdjacentElement(position, element);
}
