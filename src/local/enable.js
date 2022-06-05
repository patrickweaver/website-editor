import { GLOBALS } from "../globals";
import { createElement, insertAdj } from "../util/dom";
import { addListenerById } from "../util/dom/events/listeners";
import { LOCAL_CONTROLS_HTML, NEW_CONTENT_MODAL_HTML } from "../templates";
import {
  ADD_ITEM_HEADING_ID,
  ADD_ITEM_ID,
  ADD_ITEM_IMAGE_ID,
  ADD_ITEM_PARAGRAPH_ID,
  ADD_ITEM_ID_PREFIX,
  END_OF_DOC_ID,
  LOCAL_CONTROLS_CONTAINER_ID,
  LOCAL_CONTROLS_ID,
  NEW_CONTENT_MODAL_WRAPPER,
} from "../constants";

let localControls = createElement({
  id: LOCAL_CONTROLS_ID,
  innerHTML: LOCAL_CONTROLS_HTML,
});
let localControlsContainer = createElement({
  id: LOCAL_CONTROLS_CONTAINER_ID,
});

export function enableLocalControls() {
  insertAdj(END_OF_DOC_ID, localControlsContainer, "afterend");
  insertAdj(LOCAL_CONTROLS_CONTAINER_ID, localControls);
  addListenerById(ADD_ITEM_ID, showNewContentModal, "click");

  window.addEventListener("beforeunload", function (event) {
    if (!GLOBALS.DEV_MODE && GLOBALS.EDITING_STATE_DIRTY) {
      event.preventDefault();
      event.returnValue = "";
    }
  });
}

function showNewContentModal() {
  let newContentModal = createElement({
    id: NEW_CONTENT_MODAL_WRAPPER,
    innerHTML: NEW_CONTENT_MODAL_HTML,
  });
  insertAdj(LOCAL_CONTROLS_ID, newContentModal, "beforeend");

  function clearAddItemModal() {
    document.getElementById(NEW_CONTENT_MODAL_WRAPPER).remove();
  }

  // Heading, Paragraph, and Image buttons
  const addTextItemButtonIds = [
    ADD_ITEM_HEADING_ID,
    ADD_ITEM_PARAGRAPH_ID,
    ADD_ITEM_IMAGE_ID,
  ];
  addTextItemButtonIds.forEach((buttonId) => {
    const callback = (event) => {
      addNewElement(
        event.currentTarget.id.slice(
          ADD_ITEM_ID_PREFIX.length,
          event.currentTarget.id.length
        )
      );
      clearAddItemModal();
    };
    addListenerById(buttonId, callback, "click");
  });

  // cancel Button
  addListenerById(ADD_ITEM_CANCEL_ID, clearAddItemModal, "click");
}
