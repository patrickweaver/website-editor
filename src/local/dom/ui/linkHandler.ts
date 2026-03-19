import { ElementTag } from "../../types";
import {
  CURRENTLY_EDITING_LINK_HANDLER_ID,
  EDIT_UI_CONTAINER_CLASS,
} from "../../util/constants";
import { activateEditor } from "../events/activateEditor";
import { createElement } from "../util/createElement";
import { insertElementWithinElement } from "../util/insertElementWithinElement";
import { getLinkButtons } from "./buttons";

export function getLinkHandler(
  anchor: HTMLAnchorElement,
  relatedElement: HTMLHeadingElement | HTMLParagraphElement | HTMLImageElement,
) {
  const linkToolbar = createElement({
    tag: ElementTag.DIV,
    classList: [EDIT_UI_CONTAINER_CLASS],
    id: CURRENTLY_EDITING_LINK_HANDLER_ID,
  });
  const buttonsContainerElement = getLinkButtons(
    anchor,
    relatedElement,
    activateEditor,
    linkToolbar,
  );
  insertElementWithinElement(linkToolbar, buttonsContainerElement);

  return linkToolbar;
}
