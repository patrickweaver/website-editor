import {
  EditorTypes,
  ElementTag,
  EventType,
  InsertPosition,
} from "../../types";
import {
  CURRENTLY_EDITING_UPLOAD_IMAGE_INPUT_ID,
  INPUT_TYPES,
} from "../../util/constants";
import { actionHandleImageUpload } from "../events/actions";
import { createElement } from "../util/createElement";
import { createLabel } from "../util/createLabel";
import { insertElementWithinElement } from "../util/insertElementWithinElement";

export function getUploadWidget() {
  const container = createElement({
    tag: ElementTag.DIV,
  });
  const id = CURRENTLY_EDITING_UPLOAD_IMAGE_INPUT_ID;
  const imagePicker = createElement({
    tag: ElementTag.INPUT,
    id,
    type: INPUT_TYPES.FILE,
  });
  imagePicker.addEventListener(EventType.CHANGE, actionHandleImageUpload);

  const imagePickerLabel = createLabel(id, EditorTypes.IMAGE);

  insertElementWithinElement(
    container,
    imagePickerLabel,
    InsertPosition.BEFORE_END,
  );
  insertElementWithinElement(container, imagePicker, InsertPosition.BEFORE_END);

  return container;
}
