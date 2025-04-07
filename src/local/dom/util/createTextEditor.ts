import {
  EDIT_CLASS,
  EDITOR_TYPES,
  INPUT_TYPES,
  STRINGS,
} from "../../constants";
import {
  AlignOptions,
  Editor,
  EditorTypes,
  EventType,
  InsertPosition,
} from "../../types";
import { getEditorChangeListener } from "../events/getEditorChangeListener";
import { createEditorLabel } from "./createEditorLabel";
import { _ElementTag, createElement, HeaderTag } from "./createElement";
import { insertElementWithinElement } from "./insertElementWithinElement";
import { countLinebreaks, renderWhitespaceForEditor } from "../../util/strings";

const headingElements = [
  HeaderTag.H1,
  HeaderTag.H2,
  HeaderTag.H3,
  HeaderTag.H4,
  HeaderTag.H5,
  HeaderTag.H6,
];

export function createTextEditor({
  id,
  confirmButtonLabel,
  content,
  tagName,
  style,
}: {
  id: string;
  confirmButtonLabel: string;
  content: string;
  tagName: _ElementTag | HeaderTag;
  style: { [key: string]: string };
}): Editor | null {
  let editLevelElement: HTMLSelectElement;
  let editLevelLabel: HTMLLabelElement;
  const isHeading = headingElements.some((i) => i === tagName.toLowerCase());

  const editorChangeListener = getEditorChangeListener(id, confirmButtonLabel);
  const contentWithWhitespace = renderWhitespaceForEditor(content);

  let editElement = createElement({
    tag: _ElementTag.TEXTAREA,
    id,
    classList: [EDIT_CLASS],
    innerHTML: contentWithWhitespace,
    style: {
      minHeight: `${content.length / 65 + countLinebreaks(contentWithWhitespace) + 3}rem`,
    },
  });
  editElement.addEventListener(EventType.INPUT, editorChangeListener);

  const editAlignElement = createElement({
    tag: _ElementTag.FIELDSET,
    id: `align-${id}`,
    classList: [EDIT_CLASS],
  });
  editAlignElement.addEventListener(EventType.CHANGE, editorChangeListener);
  const alignLegend = createElement({
    tag: _ElementTag.LEGEND,
    innerHTML: STRINGS.EDITOR_LABELS[EDITOR_TYPES.ALIGN],
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
      tag: _ElementTag.INPUT,
      id: `${editAlignElement.id}-option-${valueLower}`,
      type: INPUT_TYPES.RADIO,
      name: editAlignElement.id,
      value: valueLower,
    });
    if (!foundCurrent && style.textAlign === valueLower) {
      input.checked = true;
      foundCurrent = true;
    }
    const label = createEditorLabel(
      input.id,
      EditorTypes.OPTION,
      STRINGS.ALIGNMENT_LABELS[value],
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

  const editElementLabel = createEditorLabel(
    id,
    isHeading ? EditorTypes.PARAGRAPH : EditorTypes.HEADING,
  );
  const editorObject: {
    editor: HTMLTextAreaElement;
    editorLabel: HTMLLabelElement;
    alignSelect: HTMLFieldSetElement;
    tagPicker?: HTMLSelectElement;
    tagPickerLabel?: HTMLLabelElement;
  } = {
    editor: editElement,
    editorLabel: editElementLabel,
    alignSelect: editAlignElement,
  };

  if (isHeading) {
    editLevelElement = createElement({
      tag: _ElementTag.SELECT,
      id: `level-${id}`,
      classList: [EDIT_CLASS],
    });
    headingElements.forEach((level) => {
      let headingLevelElement = createElement({
        tag: _ElementTag.OPTION,
        innerHTML: level,
        value: level,
      });
      if (level.toLowerCase() === tagName) {
        headingLevelElement.selected = true;
      }
      insertElementWithinElement(
        editLevelElement,
        headingLevelElement,
        InsertPosition.BEFORE_END,
      );
    });
    editLevelLabel = createEditorLabel(id, EditorTypes.HEADING_LEVEL);
    editorObject.tagPicker = editLevelElement;
    editorObject.tagPickerLabel = editLevelLabel;
  }

  // TODO weird type
  return {
    tagPicker: null,
    tagPickerLabel: null,
    ...editorObject,
    altEditor: null,
    altEditorLabel: null,
    imagePreview: null,
  };
}
