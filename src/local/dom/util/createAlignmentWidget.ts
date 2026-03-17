import {
  AlignOptions,
  EditorTypes,
  ElementTag,
  EventType,
  InsertPosition,
} from "../../types";
import { EDIT_CLASS, INPUT_TYPES } from "../../util/constants";
import { ALIGNMENT_LABELS, EDITOR_LABELS } from "../../util/strings";
import { createEditorLabel } from "./createEditorLabel";
import { createElement } from "./createElement";
import { insertElementWithinElement } from "./insertElementWithinElement";

export function createAlignmentWidget(
  parentId: string,
  changeListener: (event: Event) => Promise<void>,
  currentTextAlign: string,
) {
  const editAlignElement = createElement({
    tag: ElementTag.FIELDSET,
    id: `align-${parentId}`,
    classList: [EDIT_CLASS],
  });
  editAlignElement.addEventListener(EventType.CHANGE, changeListener);
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
      id: `${editAlignElement.id}-option-${valueLower}`,
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

  if (!foundCurrent) {
    const input = editAlignElement.children[0].children[0];
    if (!(input instanceof HTMLInputElement)) return null;
    input.checked = true;
  }

  return editAlignElement;
}
