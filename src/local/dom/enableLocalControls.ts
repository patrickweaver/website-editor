import {
  END_OF_DOC_ID,
  LOCAL_CONTROLS_BODY_CLASS,
  LOCAL_CONTROLS_CONTAINER_ID,
} from "../util/constants";
import { InsertPosition } from "../types";
import { showAlert } from "./util/alert";
import {
  getLocalControls,
  getMinimizedLocalControls,
} from "./ui/getLocalControls";
import { createElement } from "./util/createElement";
import { insertElementToDOM } from "./util/insertElementToDOM";
import { isDevEnv } from "../util/isDevEnv";
import { ALERT_PHONE_SCREEN_SIZE } from "../util/strings";

export function enableLocalControls() {
  const localControlsContainer = createElement({
    id: LOCAL_CONTROLS_CONTAINER_ID,
  });
  insertElementToDOM(
    END_OF_DOC_ID,
    localControlsContainer,
    InsertPosition.AFTER_END,
  );

  const localControls = getLocalControls();
  const localControlsMinimized = getMinimizedLocalControls();
  insertElementToDOM(LOCAL_CONTROLS_CONTAINER_ID, localControls);
  insertElementToDOM(LOCAL_CONTROLS_CONTAINER_ID, localControlsMinimized);

  document.body.classList.add(LOCAL_CONTROLS_BODY_CLASS);

  const devEnv = isDevEnv();

  if (devEnv) showAlert("Test alert");

  if (window.screen.width < 900) {
    showAlert(ALERT_PHONE_SCREEN_SIZE);
  }

  window.addEventListener("beforeunload", function (e) {
    if (!devEnv) {
      e.preventDefault();
    }
  });
}
