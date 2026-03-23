import { ElementTag, EventType, InsertPosition } from "../../types";
import { EDITOR_SUB_CONTAINER_CLASS } from "../../util/constants";
import { BUTTON_CLOSE_SUBPANEL } from "../../util/strings";
import { createElement } from "../util/createElement";
import { insertElementWithinElement } from "../util/insertElementWithinElement";

export function getSubpanel(id: string) {
  const subpanel = createElement({
    tag: ElementTag.DIV,
    id,
    classList: [EDITOR_SUB_CONTAINER_CLASS],
  });

  const closeButton = createElement({
    tag: ElementTag.BUTTON,
    innerHTML: BUTTON_CLOSE_SUBPANEL,
  });

  insertElementWithinElement(subpanel, closeButton, InsertPosition.AFTER_BEGIN);

  closeButton.addEventListener(EventType.CLICK, (_event: Event) => {
    subpanel.remove();
  });

  return subpanel;
}
