import { EDIT_CLASS, INPUT_TYPES } from "../../util/constants";
import {
  AlignOptions,
  Editor,
  EditorTypes,
  EventType,
  FlexAlignCssValues,
  InsertPosition,
  TextAlignCssValues,
} from "../../types";
import { getEditorChangeListener } from "../events/getEditorChangeListener";
import { createEditorLabel } from "./createEditorLabel";
import { createElement } from "./createElement";
import { insertElementWithinElement } from "./insertElementWithinElement";
import { makeImagePreview } from "./makeImagePreview";
import { ElementTag } from "../../types";
import { ALIGNMENT_LABELS, EDITOR_LABELS } from "../../util/strings";

export function createImageEditor({
  id,
  confirmButtonLabel,
  altTextContent,
  hrefContent,
  style,
}: {
  id: string;
  confirmButtonLabel: string;
  altTextContent: string;
  hrefContent: string;
  style: { [key: string]: string };
}): Editor | null {
  const editorChangeListener = getEditorChangeListener(id, confirmButtonLabel);
  const imagePicker = createElement({
    tag: ElementTag.INPUT,
    type: INPUT_TYPES.FILE,
    id,
    classList: [EDIT_CLASS],
  });
  imagePicker.addEventListener(EventType.CHANGE, editorChangeListener);
  const imagePickerLabel = createEditorLabel(id, EditorTypes.IMAGE);

  const imagePreviewFigure = makeImagePreview(id);
  const altEditor = createElement({
    tag: ElementTag.INPUT,
    type: INPUT_TYPES.TEXT,
    id: `alt-text-${id}`,
    classList: [EDIT_CLASS],
    value: altTextContent ?? "",
  });
  altEditor.addEventListener(EventType.INPUT, editorChangeListener);
  const altEditorLabel = createEditorLabel(
    altEditor.id,
    EditorTypes.IMAGE_ALT_TEXT,
  );

  const hrefEditor = createElement({
    tag: ElementTag.INPUT,
    type: INPUT_TYPES.TEXT,
    id: `href-${id}`,
    classList: [EDIT_CLASS],
    value: hrefContent ?? "",
  });
  hrefEditor.addEventListener(EventType.INPUT, editorChangeListener);
  const hrefEditorLabel = createEditorLabel(
    hrefEditor.id,
    EditorTypes.IMAGE_HREF,
  );

  const editAlignElement = createElement({
    tag: ElementTag.FIELDSET,
    id: `align-${id}`,
    classList: [EDIT_CLASS],
  });
  editAlignElement.addEventListener(EventType.CHANGE, editorChangeListener);
  const alignLegend = createElement({
    tag: ElementTag.LEGEND,
    innerHTML: EDITOR_LABELS[EditorTypes.ALIGN],
  });
  editAlignElement.insertAdjacentElement(
    InsertPosition.BEFORE_END,
    alignLegend,
  );
  const alignOptions = [
    AlignOptions.RIGHT,
    AlignOptions.CENTER,
    AlignOptions.LEFT,
    AlignOptions.DEFAULT,
  ];
  let foundCurrent = false;
  alignOptions.forEach((value) => {
    const container = createElement();
    const valueLower = value.toLowerCase();
    const input = createElement({
      tag: ElementTag.INPUT,
      value,
      id: `${editAlignElement.id}-option-${valueLower}`,
      type: INPUT_TYPES.RADIO,
      name: editAlignElement.id,
    });
    const { alignSelf } = style;
    if (
      (alignSelf === FlexAlignCssValues.LEFT &&
        valueLower === TextAlignCssValues.LEFT) ||
      (alignSelf === FlexAlignCssValues.RIGHT &&
        valueLower === TextAlignCssValues.RIGHT) ||
      (alignSelf === FlexAlignCssValues.CENTER &&
        valueLower === TextAlignCssValues.CENTER)
    ) {
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

  const editorObject = {
    editor: imagePicker,
    editorLabel: imagePickerLabel,
    altEditor,
    altEditorLabel,
    alignSelect: editAlignElement,
    imagePreview: imagePreviewFigure,
    hrefEditor,
    hrefEditorLabel,
  };

  return {
    ...editorObject,
    tagPicker: null,
    tagPickerLabel: null,
  };
}
