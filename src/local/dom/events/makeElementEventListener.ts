import {
  CURRENTLY_EDITING_ID,
  DATA_ORIGINAL_ALT,
  DATA_ORIGINAL_CSS,
  DATA_ORIGINAL_HTML,
  DATA_ORIGINAL_SRC,
  EDITABLE_STYLE_PROPERTIES,
  EditableType,
} from "../../util/constants";
import { InsertPosition } from "../../types";
import { showAlert } from "../util/alert";
import { insertElementToDOM } from "../util/insertElementToDOM";
import { cancelEditAction } from "./actions";
import { getToolbar } from "../ui/toolbar";
import { getEditableType } from "../ui/util";

export function makeElementEventListener() {
  return function (event: Event) {
    const element = event.currentTarget;
    const isValidEditableElement =
      element instanceof HTMLHeadingElement ||
      element instanceof HTMLParagraphElement ||
      element instanceof HTMLImageElement;
    if (!isValidEditableElement) {
      showAlert("Invalid element for editor");
      return;
    }

    if (element.id === CURRENTLY_EDITING_ID) {
      return;
    }

    cancelEditAction();
    element.id = CURRENTLY_EDITING_ID;

    const editableType = getEditableType();

    if (editableType === EditableType.TEXT) {
      element.contentEditable = "true";

      const originalHtml = element.innerHTML;
      const originalHtmlEscaped = encodeURIComponent(originalHtml);
      element.setAttribute(DATA_ORIGINAL_HTML, originalHtmlEscaped);
    }

    if (
      editableType === EditableType.IMAGE &&
      element instanceof HTMLImageElement
    ) {
      const originalSrc = element.src;
      element.setAttribute(DATA_ORIGINAL_SRC, originalSrc);
      const originalAlt = element.alt;
      element.setAttribute(DATA_ORIGINAL_ALT, originalAlt);
    }

    const editableProperties = Object.values(EDITABLE_STYLE_PROPERTIES);
    const originalCss = editableProperties.reduce<
      Record<string, string | undefined>
    >((acc, property) => {
      const v = element.style.getPropertyValue(property);
      acc[property] = v ?? undefined;
      return acc;
    }, {});
    const originalCssEscaped = encodeURIComponent(JSON.stringify(originalCss));
    element.setAttribute(DATA_ORIGINAL_CSS, originalCssEscaped);

    const toolbar = getToolbar();

    if (!toolbar) {
      showAlert("Error: Invalid element. 1");
      return;
    }

    insertElementToDOM(element.id, toolbar, InsertPosition.AFTER_END);

    element.focus();
  };
}
