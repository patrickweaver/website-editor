import { AlignOptions, EditorTypes, ElementTag, EventType, InsertPosition } from "../../types";
import { CURRENTLY_EDITING_FORMATTING_ID, EDIT_CLASS, INPUT_TYPES } from "../../util/constants";
import { ALIGNMENT_LABELS, EDITOR_LABELS } from "../../util/strings";
import { actionUpdateTextAlign } from "../events/actions";
import { createEditorLabel } from "../util/createEditorLabel";
import { createElement } from "../util/createElement";
import { insertElementWithinElement } from "../util/insertElementWithinElement";
import { getCurrentlyEditingElement, getCurrentlyEditingToolbar } from "./toolbar";

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

    const currentTextAlign = currentlyEditing?.style.textAlign

    const editAlignElement = createElement({
        tag: ElementTag.FIELDSET,
        classList: [EDIT_CLASS],
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
            type: INPUT_TYPES.RADIO,
            name: editAlignElement.id,
            value: valueLower,
        });
        if (!foundCurrent && currentTextAlign === valueLower) {
            input.checked = true;
            foundCurrent = true;
        }
        const label = createEditorLabel(
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

    editAlignElement.addEventListener(EventType.CHANGE, actionUpdateTextAlign);

    if (!foundCurrent) {
        const input = editAlignElement.children[0].children[0];
        if (!(input instanceof HTMLInputElement)) return null;
        input.checked = true;
    }

    return editAlignElement;
}