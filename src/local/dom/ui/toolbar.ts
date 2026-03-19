import { InsertPosition } from "../../types";
import {
  CURRENTLY_EDITING_TOOLBAR_ID,
  EDIT_UI_CONTAINER_CLASS,
} from "../../util/constants";
import { showAlert } from "../util/alert";
import { createElement } from "../util/createElement";
import { insertElementWithinElement } from "../util/insertElementWithinElement";
import { getAltTextPanel, getAltTextWidget } from "./attributes";
import { getEditorButtons } from "./buttons";
import {
  getAlignmentWidget,
  getFormattingPanel,
  getUploadPanel,
  getUploadWidget,
} from "./formatting";
import { getCurrentlyEditingToolbar, getEditableType } from "./util";

export function getToolbar() {
  const toolbar = createElement({
    classList: [EDIT_UI_CONTAINER_CLASS],
    id: CURRENTLY_EDITING_TOOLBAR_ID,
  });
  const editableType = getEditableType();
  if (!editableType) {
    showAlert("Error: Invalid element. 2");
    return;
  }
  const buttonsContainerElement = getEditorButtons(editableType);
  insertElementWithinElement(toolbar, buttonsContainerElement);

  return toolbar;
}

export function openFormattingPanel() {
  const toolbar = getCurrentlyEditingToolbar();
  if (!toolbar) {
    showAlert("Error: Can't open formatting panel.");
    return;
  }
  const formattingPanel = getFormattingPanel();
  const alignmentWidget = getAlignmentWidget();
  if (!alignmentWidget) {
    showAlert("Error: Can't open formatting panel.");
    return;
  }

  insertElementWithinElement(
    formattingPanel,
    alignmentWidget,
    InsertPosition.AFTER_BEGIN,
  );
  insertElementWithinElement(
    toolbar,
    formattingPanel,
    InsertPosition.AFTER_BEGIN,
  );
}

export function openUploadPanel() {
  const toolbar = getCurrentlyEditingToolbar();
  if (!toolbar) {
    showAlert("Error: Can't open upload panel.");
    return;
  }
  const panel = getUploadPanel();
  const widget = getUploadWidget();

  insertElementWithinElement(panel, widget, InsertPosition.AFTER_BEGIN);
  insertElementWithinElement(toolbar, panel, InsertPosition.AFTER_BEGIN);
}

export function openAltTextPanel() {
  const toolbar = getCurrentlyEditingToolbar();
  if (!toolbar) {
    showAlert("Error: Can't open alt text panel.");
    return;
  }
  const panel = getAltTextPanel();
  const widget = getAltTextWidget();
  if (!widget) {
    showAlert("Error: can't open alt text panel.");
    return;
  }

  insertElementWithinElement(panel, widget, InsertPosition.AFTER_BEGIN);
  insertElementWithinElement(toolbar, panel, InsertPosition.AFTER_BEGIN);
}
