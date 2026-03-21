import { ElementTag, EventType, InsertPosition } from "../../types";
import { CURRENTLY_EDITING_ID } from "../../util/constants";
import { getAnchorEventListener } from "../events/getEventListener";
import { createElement } from "./createElement";
import { insertElementToDOM } from "./insertElementToDOM";
import { insertElementWithinElement } from "./insertElementWithinElement";
import { promptForHref } from "./promptForHref";

export function addLinkAroundElement(element: HTMLElement) {
  let href = promptForHref();
  if (!href) return;

  if (element.parentElement instanceof HTMLAnchorElement) {
    element.parentElement.href = href;
    return;
  }
  const anchor = createElement({
    tag: ElementTag.A,
    href,
  });
  anchor.target = "_blank";
  const listener = getAnchorEventListener();
  anchor.addEventListener(EventType.CLICK, listener, { capture: true });

  insertElementToDOM(CURRENTLY_EDITING_ID, anchor, InsertPosition.BEFORE_BEGIN);
  insertElementWithinElement(anchor, element);
}
