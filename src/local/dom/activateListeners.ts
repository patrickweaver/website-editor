import { ElementTag, EventType } from "../types";
import {
  getAnchorEventListener,
  getElementEventListener,
} from "./events/getEventListener";

const textElementTags = [
  ElementTag.H1,
  ElementTag.H2,
  ElementTag.H3,
  ElementTag.H4,
  ElementTag.H5,
  ElementTag.H6,
  ElementTag.P,
];

const textElementsSelector = textElementTags.join(", ");

export function activateElementListeners() {
  const textElements = document.querySelectorAll(textElementsSelector);
  const imageElements = document.querySelectorAll(ElementTag.IMG);

  [...textElements, ...imageElements].forEach((element) => {
    element.addEventListener(EventType.CLICK, getElementEventListener());
  });
}

export function activateAnchorListeners(
  parent: HTMLElement | Document = document,
) {
  const anchorElements = parent.querySelectorAll(ElementTag.A);
  anchorElements.forEach((element) => {
    element.addEventListener(EventType.CLICK, getAnchorEventListener(), {
      capture: true,
    });
  });
}
