import { InsertPosition } from "../../types";

export function insertElementToDOM(
  neighborId: string,
  element: HTMLElement,
  position: InsertPosition = InsertPosition.AFTER_BEGIN,
) {
  document.getElementById(neighborId)?.insertAdjacentElement(position, element);
}
