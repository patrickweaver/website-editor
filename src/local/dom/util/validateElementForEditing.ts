import { CURRENTLY_EDITING_ID } from "../../util/constants";
import { cancelEdit } from "../events/actions";
import { showAlert } from "./alert";

export function validateElementForEditing(element: HTMLElement) {
  const isValidEditableElement =
    element instanceof HTMLHeadingElement ||
    element instanceof HTMLParagraphElement ||
    element instanceof HTMLImageElement;
  if (!isValidEditableElement) {
    showAlert("Invalid element for editor");
    return false;
  }

  if (element.id === CURRENTLY_EDITING_ID) {
    return false;
  }

  cancelEdit();
  return true;
}
