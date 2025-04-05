import { createElement } from "..";
import {
  ADD_ITEM_CANCEL_BUTTON_ID,
  ADD_ITEM_HEADING_ID,
  ADD_ITEM_IMAGE_ID,
  ADD_ITEM_PARAGRAPH_ID,
  BUTTON_ELEMENT,
  HEADING_ELEMENTS,
  LIST_ELEMENTS,
  LIST_ITEM_ELEMENT,
  NEW_CONTENT_MODAL_ID,
  NEW_CONTENT_MODAL_WRAPPER_ID,
  STRINGS,
} from "../../constants";

const sectionHeading = HEADING_ELEMENTS[1];

export function getNewContentModal() {
  const wrapper = createElement({ id: NEW_CONTENT_MODAL_WRAPPER_ID });
  const modal = createElement({ id: NEW_CONTENT_MODAL_ID });
  const heading = createElement({
    tag: sectionHeading,
    innerHTML: STRINGS.NEW_CONTENT_HEADER,
  });
  const list = createElement({ tag: LIST_ELEMENTS.UNORDERED });
  const buttons = [
    { id: ADD_ITEM_HEADING_ID, innerHTML: STRINGS.BUTTON_ADD_HEADING },
    { id: ADD_ITEM_PARAGRAPH_ID, innerHTML: STRINGS.BUTTON_ADD_PARAGRAPH },
    { id: ADD_ITEM_IMAGE_ID, innerHTML: STRINGS.BUTTON_ADD_IMAGE },
  ];
  buttons.forEach((buttonOptions) => {
    const listItem = createElement({ tag: LIST_ITEM_ELEMENT });
    const button = createElement({ tag: BUTTON_ELEMENT, ...buttonOptions });
    listItem.insertAdjacentElement("beforeend", button);
    list.insertAdjacentElement("beforeend", listItem);
  });
  const cancelButton = createElement({
    tag: BUTTON_ELEMENT,
    id: ADD_ITEM_CANCEL_BUTTON_ID,
    innerHTML: STRINGS.BUTTON_CANCEL,
  });
  modal.insertAdjacentElement("beforeend", heading);
  modal.insertAdjacentElement("beforeend", list);
  modal.insertAdjacentElement("beforeend", cancelButton);
  wrapper.insertAdjacentElement("beforeend", modal);
  return wrapper;
}
