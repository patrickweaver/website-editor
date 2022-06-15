import { createElement } from "..";
import { makeEditorChangeListener } from "../events/listeners";
import { createEditorLabel } from "./label";
import {
  EDIT_CLASS,
  EDITOR_TYPES,
  STRINGS,
  INPUT_ELEMENT,
  INPUT_TYPES,
  IMG_ELEMENT,
  IMAGE_PREVIEW_ID_PREFIX,
} from "../../constants";

export function createImageEditor({
  id,
  confirmButtonLabel,
  altTextContent,
  style,
}) {
  const editorChangeListener = makeEditorChangeListener(id, confirmButtonLabel);
  const imagePicker = createElement({
    tag: INPUT_ELEMENT,
    type: INPUT_TYPES.FILE,
    id,
    classList: [EDIT_CLASS],
  });
  imagePicker.addEventListener("change", editorChangeListener);
  const imagePickerLabel = createEditorLabel(id, EDITOR_TYPES.IMAGE);
  const altEditor = createElement({
    tag: INPUT_ELEMENT,
    type: INPUT_TYPES.TEXT,
    id: `alt-text-${id}`,
    classList: [EDIT_CLASS],
    value: altTextContent ?? "",
  });
  const imagePreview = createElement({
    tag: IMG_ELEMENT,
    id: `${IMAGE_PREVIEW_ID_PREFIX}${id}`,
  });
  altEditor.addEventListener("input", editorChangeListener);
  const altEditorLabel = createEditorLabel(
    altEditor.id,
    EDITOR_TYPES.IMAGE_ALT_TEXT
  );

  const editAlignElement = createElement({
    tag: "fieldset",
    id: `align-${id}`,
    classList: [EDIT_CLASS],
  });
  editAlignElement.addEventListener("change", editorChangeListener);
  const alignLegend = createElement({
    tag: "legend",
    innerHTML: STRINGS.EDITOR_LABELS[EDITOR_TYPES.ALIGN],
  });
  editAlignElement.insertAdjacentElement("beforeend", alignLegend);
  const alignOptions = ["Right", "Center", "Left", "Default"];
  let foundCurrent = false;
  alignOptions.forEach((labelText, index, array) => {
    const container = createElement();
    const value = labelText.toLowerCase();
    const input = createElement({
      tag: "input",
      value,
      id: `${editAlignElement.id}-option-${value}`,
      type: "radio",
      name: editAlignElement.id,
      value,
    });
    const { alignSelf } = style;
    if (
      (alignSelf === "flex-start" && labelText.toLowerCase() === "left") ||
      (alignSelf === "flex-end" && labelText.toLowerCase() === "right") ||
      alignSelf === labelText.toLowerCase()
    ) {
      input.checked = true;
      foundCurrent = true;
    }
    const label = createEditorLabel(input.id, null, labelText);
    container.insertAdjacentElement("afterbegin", label);
    container.insertAdjacentElement("afterbegin", input);
    editAlignElement.insertAdjacentElement("afterbegin", container);
  });

  if (!foundCurrent) {
    editAlignElement.children[0].children[0].checked = true;
  }

  return {
    editor: imagePicker,
    editorLabel: imagePickerLabel,
    altEditor,
    altEditorLabel,
    alignSelect: editAlignElement,
    imagePreview,
  };
}
