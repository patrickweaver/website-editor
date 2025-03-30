enum InsertPosition {
  BEFORE_BEGIN = "beforebegin",
  BEFORE_END = "beforeend",
  AFTER_BEGIN = "afterbegin",
  AFTER_END = "afterend",
}

export function insertElement(
  id: string,
  element: HTMLElement,
  pos: InsertPosition = InsertPosition.AFTER_BEGIN,
) {
  document.getElementById(id)?.insertAdjacentElement(pos, element);
}
