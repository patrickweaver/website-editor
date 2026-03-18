import { AlignOptions, EditorTypes, ElementTag, EventType, InsertPosition, TextAlignCssValues } from "../../types";
import { CURRENTLY_EDITING_FORMATTING_ID, CURRENTLY_EDITING_UPLOAD_ID, CURRENTLY_EDITING_UPLOAD_IMAGE_INPUT_ID, EditableType, FlexAlignCssKeys, INPUT_TYPES, TextAlignCssKeys } from "../../util/constants";
import { getUniqueId } from "../../util/random";
import { ALIGNMENT_LABELS, EDITOR_LABELS } from "../../util/strings";
import { actionHandleImageUpload, actionUpdateImageAlign, actionUpdateTextAlign } from "../events/actions";
import { createLabel } from "../util/createLabel";
import { createElement } from "../util/createElement";
import { insertElementWithinElement } from "../util/insertElementWithinElement";
import { getCurrentlyEditingElement, getEditableType } from "./util";

export function getFormattingPanel() {
    const formattingPanel = createElement({
        tag: ElementTag.DIV,
        id: CURRENTLY_EDITING_FORMATTING_ID
    })

    return formattingPanel
}

export function getAlignmentWidget(
) {
    const currentlyEditing = getCurrentlyEditingElement();
    const isImage = currentlyEditing instanceof HTMLImageElement;

    let current: "LEFT" | "CENTER" | "RIGHT" | "DEFAULT" | null = null;
    if (isImage) {
        const alignSelf = currentlyEditing.style.alignSelf;
        if (alignSelf === "flex-start" || alignSelf === "center" || alignSelf === "flex-end" || alignSelf === "default") {
            current = FlexAlignCssKeys[alignSelf];
        }
    } else {
        const textAlign = currentlyEditing?.style?.textAlign?.toUpperCase() ?? "";
        if (textAlign === "LEFT" || textAlign === "CENTER" || textAlign === "RIGHT") {
            current = TextAlignCssKeys[textAlign];
        }
    }

    const editAlignElement = createElement({
        tag: ElementTag.FIELDSET,
        id: getUniqueId(),
    });

    const alignLegend = createElement({
        tag: ElementTag.LEGEND,
        innerHTML: EDITOR_LABELS[EditorTypes.ALIGN],
    });
    insertElementWithinElement(
        editAlignElement,
        alignLegend,
        InsertPosition.BEFORE_END,
    );
    const alignOptions = [
        AlignOptions.RIGHT,
        AlignOptions.CENTER,
        AlignOptions.LEFT,
        AlignOptions.DEFAULT,
    ];
    let foundCurrent = false;
    alignOptions.forEach((value) => {
        const container = createElement({ id: "cont", giveUniqueId: true });
        const valueUpper = value.toUpperCase();
        if (
            valueUpper !== AlignOptions.RIGHT
            && valueUpper !== AlignOptions.CENTER
            && valueUpper !== AlignOptions.LEFT
            && valueUpper !== AlignOptions.DEFAULT
        ) return;
        const input = createElement({
            tag: ElementTag.INPUT,
            id: getUniqueId(),
            type: INPUT_TYPES.RADIO,
            name: editAlignElement.id,
            value: valueUpper,
        });
        if (!foundCurrent && current === valueUpper) {
            input.checked = true;
            foundCurrent = true;
        }
        const label = createLabel(
            input.id,
            EditorTypes.OPTION,
            ALIGNMENT_LABELS[value],
        );
        insertElementWithinElement(container, label, InsertPosition.AFTER_BEGIN);
        insertElementWithinElement(container, input, InsertPosition.AFTER_BEGIN);
        insertElementWithinElement(
            editAlignElement,
            container,
            InsertPosition.AFTER_BEGIN,
        );
    });

    const editableType = getEditableType();

    let listener: ((event: Event) => void) | null = null;
    if (editableType === EditableType.TEXT) {
        listener = actionUpdateTextAlign;
    }
    if (editableType === EditableType.IMAGE) {
        listener = actionUpdateImageAlign;
    }
    if (!listener) return;
    editAlignElement.addEventListener(EventType.CHANGE, listener);

    if (!foundCurrent) {
        const input = editAlignElement.children[0].children[0];
        if (!(input instanceof HTMLInputElement)) return null;
        input.checked = true;
    }

    return editAlignElement;
}

export function getUploadPanel() {
    const uploadPanel = createElement({
        tag: ElementTag.DIV,
        id: CURRENTLY_EDITING_UPLOAD_ID
    })

    return uploadPanel
}

export function getUploadWidget() {
    const container = createElement({
        tag: ElementTag.DIV
    })
    const id = CURRENTLY_EDITING_UPLOAD_IMAGE_INPUT_ID;
    const imagePicker = createElement({
        tag: ElementTag.INPUT,
        id,
        type: INPUT_TYPES.FILE,
    });
    imagePicker.addEventListener(EventType.CHANGE, actionHandleImageUpload);

    const imagePickerLabel = createLabel(id, EditorTypes.IMAGE);

    insertElementWithinElement(container, imagePickerLabel, InsertPosition.BEFORE_END);
    insertElementWithinElement(container, imagePicker, InsertPosition.BEFORE_END);

    return container
}