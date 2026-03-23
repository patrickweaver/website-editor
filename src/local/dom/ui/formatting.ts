import {
  AlignOptions,
  EditorTypes,
  ElementTag,
  EventType,
  InsertPosition,
  TextAlignCssValues,
} from "../../types";
import {
  CURRENTLY_EDITING_FORMATTING_ID,
  EditableType,
  FlexAlignCssKeys,
  INPUT_TYPES,
  TextAlignCssKeys,
} from "../../util/constants";
import { getUniqueId } from "../../util/random";
import { ALIGNMENT_LABELS, EDITOR_LABELS } from "../../util/strings";
import {
  actionUpdateImageAlign,
  actionUpdateTextAlign,
} from "../events/actions";
import { createLabel } from "../util/createLabel";
import { createElement } from "../util/createElement";
import { insertElementWithinElement } from "../util/insertElementWithinElement";
import { getCurrentlyEditingElement, getEditableType } from "./util";

export function getFormattingPanel() {
  const formattingPanel = createElement({
    tag: ElementTag.DIV,
    id: CURRENTLY_EDITING_FORMATTING_ID,
  });

  return formattingPanel;
}

export function getAlignmentWidget() {
  const currentlyEditing = getCurrentlyEditingElement();
  const isImage = currentlyEditing instanceof HTMLImageElement;

  let current: "LEFT" | "CENTER" | "RIGHT" | "DEFAULT" | null = null;
  if (isImage) {
    const alignSelf = currentlyEditing?.style?.alignSelf;
    current = FlexAlignCssKeys?.[alignSelf] ?? AlignOptions.DEFAULT;
  } else {
    const textAlign =
      currentlyEditing?.style?.textAlign || TextAlignCssValues.DEFAULT;
    current = TextAlignCssKeys?.[textAlign] ?? AlignOptions.DEFAULT;
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
    if (
      value !== AlignOptions.RIGHT &&
      value !== AlignOptions.CENTER &&
      value !== AlignOptions.LEFT &&
      value !== AlignOptions.DEFAULT
    )
      return;
    const input = createElement({
      tag: ElementTag.INPUT,
      id: getUniqueId(),
      type: INPUT_TYPES.RADIO,
      name: editAlignElement.id,
      value: value,
    });
    if (!foundCurrent && current === value) {
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
