import { GLOBALS } from "../globals";
import { createElement, insertAdj } from "./util/dom";
import { localControls } from "./util/dom/editors/controls";
import { addListenerById } from "./util/dom/events/listeners";
import { onClickNewContentButton } from "./util/dom/events/handlers";
import {
  ADD_ITEM_ID,
  END_OF_DOC_ID,
  LOCAL_CONTROLS_CONTAINER_ID,
} from "./constants";

let localControlsContainer = createElement({
  id: LOCAL_CONTROLS_CONTAINER_ID,
});

export function enableLocalControls() {
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
