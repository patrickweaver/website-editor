import { InsertPosition } from "../../types";

export function insertElementToDOM(
  neighborId: string,
  element: HTMLElement,
  position: InsertPosition = InsertPosition.AFTER_BEGIN,
) {
  const neighbor = document.getElementById(neighborId);
  if (!neighbor) {
    alert("Error: Invalid insertion point");
  }
  neighbor?.insertAdjacentElement(position, element);
}
