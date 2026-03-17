import { InsertPosition } from "../../types";
import {
    CURRENTLY_EDITING_ID,
    CURRENTLY_EDITING_TOOLBAR_ID,
    EditableType,
} from "../../util/constants";
import { showAlert } from "../util/alert";
import { insertElementWithinElement } from "../util/insertElementWithinElement";
import { getFormattingPanel } from "./formatting";

export function getCurrentlyEditingElement() {
    return document.getElementById(CURRENTLY_EDITING_ID);
}

export function getCurrentlyEditingToolbar() {
    return document.getElementById(CURRENTLY_EDITING_TOOLBAR_ID);
}

export function openFormattingPanel(editableType: EditableType) {
    const toolbar = getCurrentlyEditingToolbar()
    if (!toolbar) {
        showAlert("Error: Can't open formatting panel.")
        return
    }
    const formattingPanel = getFormattingPanel();
    insertElementWithinElement(toolbar, formattingPanel, InsertPosition.AFTER_BEGIN)
}