import { InsertPosition } from "../../types";
import {
  CURRENTLY_EDITING_ALT_TEXT_ID,
  CURRENTLY_EDITING_FORMATTING_ID,
  CURRENTLY_EDITING_TOOLBAR_ID,
  CURRENTLY_EDITING_UPLOAD_ID,
  EDIT_UI_CONTAINER_CLASS,
} from "../../util/constants";
import { showAlert } from "../util/alert";
import { createElement } from "../util/createElement";
import { insertElementWithinElement } from "../util/insertElementWithinElement";
import { getAltTextWidget } from "./attributes";
import { getEditorButtons } from "./buttons";
import { getFormattingPanel } from "./formatting";
import { getSubpanel } from "./subpanel";
import { getUploadWidget } from "./upload";
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
  const existing = document.getElementById(CURRENTLY_EDITING_FORMATTING_ID);
  if (existing) return;
  const toolbar = getCurrentlyEditingToolbar();
  if (!toolbar) {
    showAlert("Error: Can't open formatting panel.");
    return;
  }
  const formattingPanel = getFormattingPanel();

  insertElementWithinElement(
    toolbar,
    formattingPanel,
    InsertPosition.AFTER_BEGIN,
  );
}

export function openUploadPanel() {
  const existing = document.getElementById(CURRENTLY_EDITING_UPLOAD_ID);
  if (existing) return;
  const toolbar = getCurrentlyEditingToolbar();
  if (!toolbar) {
    showAlert("Error: Can't open upload panel.");
    return;
  }
  const panel = getSubpanel(CURRENTLY_EDITING_UPLOAD_ID);
  const widget = getUploadWidget();

  insertElementWithinElement(panel, widget, InsertPosition.AFTER_BEGIN);
  insertElementWithinElement(toolbar, panel, InsertPosition.AFTER_BEGIN);
}

export function openAltTextPanel() {
  const existing = document.getElementById(CURRENTLY_EDITING_ALT_TEXT_ID);
  if (existing) return;
  const toolbar = getCurrentlyEditingToolbar();
  if (!toolbar) {
    showAlert("Error: Can't open alt text panel.");
    return;
  }
  const panel = getSubpanel(CURRENTLY_EDITING_ALT_TEXT_ID);
  const widget = getAltTextWidget();
  if (!widget) {
    showAlert("Error: can't open alt text panel.");
    return;
  }

  insertElementWithinElement(panel, widget, InsertPosition.AFTER_BEGIN);
  insertElementWithinElement(toolbar, panel, InsertPosition.AFTER_BEGIN);
}
