import {
  ADD_ITEM_ID,
  END_OF_DOC_ID,
  LOCAL_CONTROLS_CONTAINER_ID,
} from "../util/constants";
import { EventType, InsertPosition } from "../types";
import { showAlert } from "./util/alert";
import { addListenerById } from "./events/addListenerById";
import { onClickNewContentButton } from "./events/onClickNewContentButton";
import { getLocalControls } from "./ui/getLocalControls";
import { createElement } from "./util/createElement";
import { insertElementToDOM } from "./util/insertElementToDOM";

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

  document.body.classList.add("local-controls-enabled");

  showAlert("Test alert");
}
