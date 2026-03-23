import {
  ALERT_CLASS,
  ALERT_LIST,
  ALERT_REMOVED_CLASS,
  ALERT_ANIMATION_DELAY,
} from "../../util/constants.ts";
import { ElementTag } from "../../types.ts";
import { createElement } from "./createElement.ts";
import { insertElementToDOM } from "./insertElementToDOM.ts";
import { insertElementWithinElement } from "./insertElementWithinElement.ts";
import { InsertPosition } from "../../types.ts";

export function showAlert(message: string) {
  // This timeout is needed to make sure that the local controls element exists when the alert is created
  setTimeout(() => {
    const alert = createElement({
      tag: ElementTag.DIV,
      id: "alert",
      giveUniqueId: true,
    });
    const now = new Date();
    const alertHeader = createElement({
      tag: ElementTag.H3,
      innerHTML: `Alert (${now.toLocaleTimeString()})`,
    });
    const alertMessage = createElement({
      tag: ElementTag.P,
      innerHTML: `${message}`,
    });
    const alertCloseButton = createElement({
      tag: ElementTag.BUTTON,
      innerHTML: "Close",
    });
    insertElementWithinElement(alert, alertHeader, InsertPosition.AFTER_BEGIN);
    insertElementWithinElement(alert, alertMessage);
    insertElementWithinElement(alert, alertCloseButton);
    alertCloseButton.addEventListener("click", closeAlertListener);
    alert.classList.add(ALERT_CLASS);
    insertElementToDOM(ALERT_LIST, alert);
  }, 100);
}

function closeAlertListener(event: MouseEvent) {
  (event.target as HTMLElement)?.parentElement?.classList.add(
    ALERT_REMOVED_CLASS,
  );
  setTimeout(() => {
    // This makes sense once we animate it out
    (event.target as HTMLElement)?.parentElement?.remove();
  }, ALERT_ANIMATION_DELAY);
}
