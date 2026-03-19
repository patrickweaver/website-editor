import { ElementTag, InsertPosition } from "../../types";
import { CURRENTLY_EDITING_ID } from "../../util/constants";
import { ERROR_NO_URL, PROMPT_LINK_URL } from "../../util/strings";
import { createElement } from "./createElement";
import { insertElementToDOM } from "./insertElementToDOM";
import { insertElementWithinElement } from "./insertElementWithinElement";

export function addLinkAroundElement(element: HTMLElement) {
  let href = window.prompt(PROMPT_LINK_URL);
  if (href?.slice(0, 5) !== "http") {
    href = `http://${href}`;
  }
  if (!href) {
    alert(ERROR_NO_URL);
    return;
  }

  if (element.parentElement instanceof HTMLAnchorElement) {
    element.parentElement.href = href;
    return;
  }
  const anchor = createElement({
    tag: ElementTag.A,
    href,
  });

  insertElementToDOM(CURRENTLY_EDITING_ID, anchor, InsertPosition.BEFORE_BEGIN);
  insertElementWithinElement(anchor, element);
}
