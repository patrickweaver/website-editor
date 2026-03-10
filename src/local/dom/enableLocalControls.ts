import {
  ADD_ITEM_ID,
  END_OF_DOC_ID,
  LOCAL_CONTROLS_CONTAINER_ID,
  LOCAL_CONTROLS_ID,
} from "../util/constants";
import { EventType, InsertPosition } from "../types";
import { showAlert } from "./util/alert";
import { addListenerById } from "./events/addListenerById";
import { onClickNewContentButton } from "./events/onClickNewContentButton";
import { getLocalControls } from "./getLocalControls";
import { createElement } from "./util/createElement";
import { insertElementToDOM } from "./util/insertElementToDOM";
import { GLOBALS } from "../../globals";

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
  insertElementToDOM(LOCAL_CONTROLS_CONTAINER_ID, localControls);
  addListenerById(ADD_ITEM_ID, onClickNewContentButton, EventType.CLICK);

  showAlert("Test alert");

  const stateElement = createElement({ innerHTML: "Editor state:" });
  insertElementToDOM(
    LOCAL_CONTROLS_ID,
    stateElement,
    InsertPosition.AFTER_BEGIN,
  );

  stateElement.style.position = "fixed";
  stateElement.style.top = "10px";
  stateElement.style.right = "10px";
  stateElement.style.width = "100px";
  stateElement.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
  stateElement.style.padding = "10px";
  stateElement.style.borderRadius = "5px";
  stateElement.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)";
  stateElement.style.zIndex = "10000";

  setInterval(() => {
    const now = new Date();
    stateElement.innerHTML = `Editor state: ${GLOBALS.EDITING_STATE_DIRTY ? "🗑️ Dirty" : "🧼 Clean"} (Last updated: ${now.toLocaleTimeString()})`;
  });
}
