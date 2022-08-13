import { GLOBALS } from "../globals";
import { createElement, insertAdj } from "./dom";
import { getLocalControls } from "./dom/editors/controls";
import { addListenerById } from "./dom/events/listeners";
import { onClickNewContentButton } from "./dom/events/handlers";
import {
  ADD_ITEM_ID,
  END_OF_DOC_ID,
  LOCAL_CONTROLS_CONTAINER_ID,
} from "./constants";

export function enableLocalControls() {
  const localControlsContainer = createElement({
    id: LOCAL_CONTROLS_CONTAINER_ID,
  });

  const localControls = getLocalControls();
  insertAdj(END_OF_DOC_ID, localControlsContainer, "afterend");
  insertAdj(LOCAL_CONTROLS_CONTAINER_ID, localControls);
  addListenerById(ADD_ITEM_ID, onClickNewContentButton, "click");

  window.addEventListener("beforeunload", function (event) {
    if (!GLOBALS.DEV_MODE && GLOBALS.EDITING_STATE_DIRTY) {
      event.preventDefault();
      event.returnValue = "";
    }
  });
}
