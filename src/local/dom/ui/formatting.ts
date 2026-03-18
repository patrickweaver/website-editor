import { AlignOptions, EditorTypes, ElementTag, EventType, InsertPosition } from "../../types";
import { CURRENTLY_EDITING_FORMATTING_ID, CURRENTLY_EDITING_UPLOAD_ID, CURRENTLY_EDITING_UPLOAD_IMAGE_INPUT_ID, EditableType, INPUT_TYPES } from "../../util/constants";
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

export function getUploadPanel() {
    const uploadPanel = createElement({
        tag: ElementTag.DIV,
        id: CURRENTLY_EDITING_UPLOAD_ID
    })

    return uploadPanel
}

export function getAlignmentWidget(
) {

    const currentlyEditing = getCurrentlyEditingElement();

    const currentTextAlign = currentlyEditing?.style.textAlign

    const editAlignElement = createElement({
        tag: ElementTag.FIELDSET,
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
        const valueLower = value.toLowerCase();
        const input = createElement({
            tag: ElementTag.INPUT,
            id: getUniqueId(),
            type: INPUT_TYPES.RADIO,
            name: editAlignElement.id,
            value: valueLower,
        });
        if (!foundCurrent && currentTextAlign === valueLower) {
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

    // const altEditor = createElement({
    //     tag: ElementTag.INPUT,
    //     type: INPUT_TYPES.TEXT,
    //     id: `alt-text-${id}`,
    //     value: altTextContent ?? "",
    // });
    // altEditor.addEventListener(EventType.INPUT, editorChangeListener);
    // const altEditorLabel = createLabel(
    //     altEditor.id,
    //     EditorTypes.IMAGE_ALT_TEXT,
    // );

    insertElementWithinElement(container, imagePickerLabel, InsertPosition.BEFORE_END);
    insertElementWithinElement(container, imagePicker, InsertPosition.BEFORE_END);

    return container
}