import { EditorTypes, ElementTag, EventType, InsertPosition } from "../../types";
import { CURRENTLY_EDITING_ALT_TEXT_ID, CURRENTLY_EDITING_ALT_TEXT_INPUT_ID, INPUT_TYPES } from "../../util/constants";
import { actionHandleAltTextUpdate } from "../events/actions";
import { showAlert } from "../util/alert";
import { createElement } from "../util/createElement";
import { createLabel } from "../util/createLabel";
import { insertElementWithinElement } from "../util/insertElementWithinElement";
import { getCurrentlyEditingElement } from "./util";

export function getAltTextPanel() {
    const uploadPanel = createElement({
        tag: ElementTag.DIV,
        id: CURRENTLY_EDITING_ALT_TEXT_ID
    })
    return uploadPanel
}

export function getAltTextWidget() {
    const element = getCurrentlyEditingElement();
    if (!element || !(element instanceof HTMLImageElement)) {
        showAlert("Error: Invalid element.")
        return;
    }
    const altTextContent = element?.alt ?? "";
    const container = createElement({
        tag: ElementTag.DIV
    })
    const id = CURRENTLY_EDITING_ALT_TEXT_INPUT_ID;

    const altEditor = createElement({
        tag: ElementTag.INPUT,
        type: INPUT_TYPES.TEXT,
        id,
        value: altTextContent,
    });
    altEditor.addEventListener(EventType.INPUT, actionHandleAltTextUpdate);
    const altEditorLabel = createLabel(
        altEditor.id,
        EditorTypes.IMAGE_ALT_TEXT,
    );

    insertElementWithinElement(container, altEditorLabel, InsertPosition.BEFORE_END);
    insertElementWithinElement(container, altEditor, InsertPosition.BEFORE_END);

    return container
}