import { ElementTag, InsertPosition } from "../../types";
import { getLinkHandler } from "../ui/linkHandler";
import { showAlert } from "../util/alert";
import { insertElementNextToElement } from "../util/insertElementNextToElement";
import { activateEditor } from "./activateEditor";

export function getElementEventListener() {
  return function (event: Event) {
    const element = event.currentTarget;
    if (!(element instanceof HTMLElement)) return;
    activateEditor(element);
  };
}

export function getAnchorEventListener() {
  return function (event: Event) {
    event.preventDefault();
    event.stopPropagation();
    const anchor = event.currentTarget;
    if (!anchor || !(anchor instanceof HTMLAnchorElement)) return;
    const relatedElement:
      | HTMLHeadingElement
      | HTMLParagraphElement
      | HTMLImageElement
      | null =
      anchor.closest(ElementTag.H1) ??
      anchor.closest(ElementTag.H2) ??
      anchor.closest(ElementTag.H3) ??
      anchor.closest(ElementTag.H4) ??
      anchor.closest(ElementTag.H5) ??
      anchor.closest(ElementTag.H6) ??
      anchor.closest(ElementTag.P) ??
      anchor.querySelector(ElementTag.IMG);
    if (!relatedElement) return;
    const element = event.currentTarget;
    if (!(element instanceof HTMLAnchorElement)) return;

    const linkToolbar = getLinkHandler(anchor, relatedElement);
    if (!linkToolbar) {
      showAlert("Error: Invalid link.");
      return;
    }

    insertElementNextToElement(element, linkToolbar, InsertPosition.AFTER_END);
  };
}
