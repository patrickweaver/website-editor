import { ElementTag, EventType, InsertPosition } from "../../types";
import {
  NON_DESTRUCTIVE_BUTTON_CLASS,
  EDIT_UI_SUB_PANEL_CLASS,
} from "../../util/constants";
import { BUTTON_CLOSE_SUBPANEL } from "../../util/strings";
import { createElement } from "../util/createElement";
import { insertElementWithinElement } from "../util/insertElementWithinElement";

export function getSubpanel(id: string) {
  const subpanel = createElement({
    tag: ElementTag.DIV,
    id,
    classList: [EDIT_UI_SUB_PANEL_CLASS],
  });

  const closeButton = createElement({
    tag: ElementTag.BUTTON,
    innerHTML: BUTTON_CLOSE_SUBPANEL,
    classList: [NON_DESTRUCTIVE_BUTTON_CLASS],
  });

  insertElementWithinElement(subpanel, closeButton, InsertPosition.AFTER_BEGIN);

  closeButton.addEventListener(EventType.CLICK, (_event: Event) => {
    subpanel.remove();
  });

  return subpanel;
}
