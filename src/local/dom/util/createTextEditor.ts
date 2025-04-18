import { EDIT_CLASS, INPUT_TYPES, STRINGS } from "../../constants";
import {
  AlignOptions,
  Editor,
  EditorTypes,
  EventType,
  InsertPosition,
  ElementTag,
} from "../../types";
import { getEditorChangeListener } from "../events/getEditorChangeListener";
import { createEditorLabel } from "./createEditorLabel";
import { createElement } from "./createElement";
import { insertElementWithinElement } from "./insertElementWithinElement";
import { countLinebreaks, renderWhitespaceForEditor } from "../../util/strings";

const headingElements = [
  ElementTag.H1,
  ElementTag.H2,
  ElementTag.H3,
  ElementTag.H4,
  ElementTag.H5,
  ElementTag.H6,
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
  tagName: ElementTag | ElementTag;
  style: { [key: string]: string };
}): Editor | null {
  let editLevelElement: HTMLSelectElement;
  let editLevelLabel: HTMLLabelElement;
  const isHeading = headingElements.some((i) => i === tagName.toLowerCase());

  const editorChangeListener = getEditorChangeListener(id, confirmButtonLabel);
  const contentWithWhitespace = renderWhitespaceForEditor(content);

  let editElement = createElement({
    tag: ElementTag.TEXTAREA,
    id,
    classList: [EDIT_CLASS],
    innerHTML: contentWithWhitespace,
    style: {
      minHeight: `${content.length / 65 + countLinebreaks(contentWithWhitespace) + 3}rem`,
    },
  });
  editElement.addEventListener(EventType.INPUT, editorChangeListener);

  const editAlignElement = createElement({
    tag: ElementTag.FIELDSET,
    id: `align-${id}`,
    classList: [EDIT_CLASS],
  });
  editAlignElement.addEventListener(EventType.CHANGE, editorChangeListener);
  const alignLegend = createElement({
    tag: ElementTag.LEGEND,
    innerHTML: STRINGS.EDITOR_LABELS[EditorTypes.ALIGN],
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
      tag: ElementTag.SELECT,
      id: `level-${id}`,
      classList: [EDIT_CLASS],
    });
    headingElements.forEach((level) => {
      let headingLevelElement = createElement({
        tag: ElementTag.OPTION,
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
