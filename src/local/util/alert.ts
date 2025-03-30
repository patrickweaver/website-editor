import {
  ALERT_CLASS,
  ALERT_LIST,
  ALERT_REMOVED,
  ALERT_ANIMATION_DELAY,
} from "../constants.ts";
import { getUniqueId } from "./random";

export function showAlert(message: string) {
  // This timeout is needed to make sure that the local controls element exists when the alert is created
  setTimeout(() => {
    const alert = document.createElement("div");
    const alertHeader = document.createElement("h3");
    const alertMessage = document.createElement("p");
    const alertCloseButton = document.createElement("button");
    alert.id = getUniqueId("alert");
    alertHeader.innerHTML = `Alert: ${alert.id}`;
    alertMessage.innerHTML = message;
    alertCloseButton.innerHTML = "Close";
    alert.insertAdjacentElement("afterbegin", alertHeader);
    alert.insertAdjacentElement("beforeend", alertMessage);
    alert.insertAdjacentElement("beforeend", alertCloseButton);
    alertCloseButton.addEventListener("click", closeAlertListener);
    alert.classList.add(ALERT_CLASS);
    const localControls = document.getElementById(ALERT_LIST);
    if (localControls) {
      localControls.insertAdjacentElement("afterbegin", alert);
    } else {
      window.alert("Local controls not found");
    }
  }, 100);
}

function closeAlertListener(event: MouseEvent) {
  (event.target as HTMLElement)?.parentElement?.classList.add(ALERT_REMOVED);
  setTimeout(() => {
    // This makes sense once we animate it out
    (event.target as HTMLElement)?.parentElement?.remove();
  }, ALERT_ANIMATION_DELAY);
}
