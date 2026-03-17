import { EditableType } from "../util/constants";
import { ElementTag, EventType } from "../types";
import { makeElementEventListener } from "./events/makeElementEventListener";

const textElements = [
  ElementTag.H1,
  ElementTag.H2,
  ElementTag.H3,
  ElementTag.H4,
  ElementTag.H5,
  ElementTag.H6,
  ElementTag.P,
];

const textElementsSelector = textElements.join(", ");

export function activateElementListeners() {
  document
    .querySelectorAll(textElementsSelector)
    .forEach((element) =>
      element.addEventListener(
        EventType.CLICK,
        makeElementEventListener(EditableType.TEXT),
      ),
    );

  document
    .querySelectorAll(ElementTag.IMG)
    .forEach((element) =>
      element.addEventListener(
        EventType.CLICK,
        makeElementEventListener(EditableType.IMAGE),
      ),
    );
}
