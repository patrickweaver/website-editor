import {
  ADD_ITEM_CANCEL_BUTTON_ID,
  ADD_ITEM_HEADING_ID,
  ADD_ITEM_IMAGE_ID,
  ADD_ITEM_PARAGRAPH_ID,
  END_OF_DOC_ID,
  LOCAL_CONTROLS_ID,
  NEW_CONTENT_MODAL_ID,
  NEW_CONTENT_MODAL_WRAPPER_ID,
  STRINGS,
} from "../../constants";
import { EditorTypes, EventType, InsertPosition } from "../../types";
import { _ElementTag, createElement, HeaderTag } from "../util/createElement";
import { insertElementToDOM } from "../util/insertElementToDOM";
import { insertElementWithinElement } from "../util/insertElementWithinElement";
import { scrollToElement } from "../util/scrollToElement";
import { addListenerById } from "./addListenerById";
import { imageEventListener } from "./imageEventListener";
import { textEventListener } from "./textEventListener";

export function onClickNewContentButton() {
  const newContentModal = getNewContentModal();
  insertElementToDOM(
    LOCAL_CONTROLS_ID,
    newContentModal,
    InsertPosition.BEFORE_END,
  );

  function clearAddItemModal() {
    newContentModal.remove();
  }

  const addElementEditorOpitons = [
    {
      id: ADD_ITEM_HEADING_ID,
      callback: () => addNewTextElementEditor(EditorTypes.HEADING),
    },
    {
      id: ADD_ITEM_PARAGRAPH_ID,
      callback: () => addNewTextElementEditor(EditorTypes.PARAGRAPH),
    },
    { id: ADD_ITEM_IMAGE_ID, callback: addNewImageEditor },
  ];

  addElementEditorOpitons.forEach((option) => {
    const callback = (_event: Event) => {
      option.callback();
      clearAddItemModal();
    };
    addListenerById(option.id, callback, EventType.CLICK);
  });

  addListenerById(
    ADD_ITEM_CANCEL_BUTTON_ID,
    clearAddItemModal,
    EventType.CLICK,
  );
}

function getNewContentModal() {
  const wrapper = createElement({ id: NEW_CONTENT_MODAL_WRAPPER_ID });
  const modal = createElement({ id: NEW_CONTENT_MODAL_ID });
  const heading = createElement({
    tag: HeaderTag.H2,
    innerHTML: STRINGS.NEW_CONTENT_HEADER,
  });
  const list = createElement({ tag: _ElementTag.UL });
  const buttons = [
    { id: ADD_ITEM_HEADING_ID, innerHTML: STRINGS.BUTTON_ADD_HEADING },
    { id: ADD_ITEM_PARAGRAPH_ID, innerHTML: STRINGS.BUTTON_ADD_PARAGRAPH },
    { id: ADD_ITEM_IMAGE_ID, innerHTML: STRINGS.BUTTON_ADD_IMAGE },
  ];
  buttons.forEach((buttonOptions) => {
    const listItem = createElement({ tag: _ElementTag.LI });
    const button = createElement({ tag: _ElementTag.BUTTON, ...buttonOptions });
    insertElementWithinElement(listItem, button);
    insertElementWithinElement(list, listItem);
  });
  const cancelButton = createElement({
    tag: _ElementTag.BUTTON,
    id: ADD_ITEM_CANCEL_BUTTON_ID,
    innerHTML: STRINGS.BUTTON_CANCEL,
  });
  insertElementWithinElement(modal, heading);
  insertElementWithinElement(modal, list);
  insertElementWithinElement(modal, cancelButton);
  insertElementWithinElement(wrapper, modal);
  return wrapper;
}

function addNewTextElementEditor(type: EditorTypes = EditorTypes.PARAGRAPH) {
  const tag = type === EditorTypes.HEADING ? HeaderTag.H2 : _ElementTag.P;
  const innerHTML = STRINGS.PLACEHOLDER_TEXT;
  const newElement = createElement({ tag, innerHTML });
  addNewEditorCleanup(newElement, textEventListener);
}

function addNewImageEditor() {
  const tag = _ElementTag.IMG;
  const newElement = createElement({ tag });
  addNewEditorCleanup(newElement, imageEventListener);
}

function addNewEditorCleanup(
  newElement: HTMLElement,
  editCallback: (event: Event) => void,
) {
  insertElementToDOM(END_OF_DOC_ID, newElement, InsertPosition.BEFORE_BEGIN);
  scrollToElement(newElement.id);
  // TODO this is maybe broken
  const fakeEvent = new Event("click");
  Object.defineProperty(fakeEvent, "currentTarget", { value: newElement });
  editCallback(fakeEvent);
}
