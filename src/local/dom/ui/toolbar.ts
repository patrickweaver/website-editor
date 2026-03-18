import { InsertPosition } from "../../types";
import {
    CURRENTLY_EDITING_TOOLBAR_ID,
    EDIT_UI_CONTAINER_CLASS,
    EditableType,
} from "../../util/constants";
import { showAlert } from "../util/alert";
import { createElement } from "../util/createElement";
import { insertElementWithinElement } from "../util/insertElementWithinElement";
import { getButtons } from "./buttons";
import { getAlignmentWidget, getFormattingPanel } from "./formatting";
import { getCurrentlyEditingToolbar, getEditableType } from "./util";

export function getToolbar() {
    const toolbar = createElement({
        classList: [EDIT_UI_CONTAINER_CLASS],
        id: CURRENTLY_EDITING_TOOLBAR_ID,
    });
    const editableType = getEditableType();
    if (!editableType) {
        showAlert("Error: Invalid element.");
        return;
    }
    const buttonsContainerElement = getButtons(editableType);

    // TODO Not for new elements
    insertElementWithinElement(toolbar, buttonsContainerElement);

    return toolbar
}

export function openFormattingPanel(editableType: EditableType) {
    const toolbar = getCurrentlyEditingToolbar()
    if (!toolbar) {
        showAlert("Error: Can't open formatting panel.")
        return
    }
    const formattingPanel = getFormattingPanel();

    const alignmentWidget = getAlignmentWidget();
    if (!alignmentWidget) {
        showAlert("Error: Can't open formatting panel.");
        return
    }


    insertElementWithinElement(formattingPanel, alignmentWidget, InsertPosition.AFTER_BEGIN)
    insertElementWithinElement(toolbar, formattingPanel, InsertPosition.AFTER_BEGIN)
}