import { createElement } from "..";
import { makeEditorChangeListener } from "../events/listeners";
import { createEditorLabel } from "./label";
import {
  EDIT_CLASS,
  EDITOR_TYPES,
  HEADING_ELEMENTS,
  STRINGS,
} from "../../constants";
import { countLinebreaks, renderWhitespaceForEditor } from "../../util/strings";

export function createTextEditor({
  id,
  confirmButtonLabel,
  content,
  tagName,
  style,
}) {
  let levelEditorId, editLevelLabel;
  const isHeading = HEADING_ELEMENTS.some((i) => i === tagName.toLowerCase());
  if (isHeading) {
    var editLevelElement = createElement({
      tag: "select",
      id: `level-${id}`,
      classList: [EDIT_CLASS],
    });
    HEADING_ELEMENTS.forEach((level) => {
      let headingLevelElement = createElement({
        tag: "option",
        innerHTML: level,
        value: level,
      });
      if (level.toLowerCase() === tagName) {
        headingLevelElement.selected = "selected";
      }
      editLevelElement.insertAdjacentElement("beforeend", headingLevelElement);
    });
    editLevelLabel = createEditorLabel(
      levelEditorId,
      EDITOR_TYPES.HEADING_LEVEL
    );
  }

  const editorChangeListener = makeEditorChangeListener(id, confirmButtonLabel);

  const contentWithWhitespace = renderWhitespaceForEditor(content);

  let editElement = createElement({
    tag: "textarea",
    id,
    classList: [EDIT_CLASS],
    innerHTML: contentWithWhitespace,
    style: {
      minHeight: `${
        content.length / 65 + countLinebreaks(contentWithWhitespace) + 3
      }rem`,
    },
  });
  editElement.addEventListener("input", editorChangeListener);

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
    const container = createElement({ id: "cont", uniqueId: true });
    const value = labelText.toLowerCase();
    const input = createElement({
      tag: "input",
      id: `${editAlignElement.id}-option-${value}`,
      type: "radio",
      name: editAlignElement.id,
      value: value,
    });
    if (!foundCurrent && style.textAlign === labelText.toLowerCase()) {
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

  const editElementLabel = createEditorLabel(
    id,
    isHeading ? EDITOR_TYPES.HEADING : EDITOR_TYPES.PARAGRAPH
  );
  return {
    editor: editElement,
    editorLabel: editElementLabel,
    tagPicker: editLevelElement,
    tagPickerLabel: editLevelLabel,
    alignSelect: editAlignElement,
  };
}
