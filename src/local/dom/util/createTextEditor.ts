import { EDIT_CLASS, EDIT_UI_CONTAINER_CLASS } from "../../util/constants";
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
import { showAlert } from "./alert";
import { DEPRECATED_createAlignmentWidget } from "./DEPRECATED_createAlignmentWidget";

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
  tagName: ElementTag;
  style: { [key: string]: string };
}): Editor | null {
  let editLevelElement: HTMLSelectElement;
  let editLevelLabel: HTMLLabelElement;
  const isHeading = headingElements.some((i) => i === tagName.toLowerCase());

  const editorChangeListener = getEditorChangeListener(id, confirmButtonLabel);
  let editElement = createElement({
    tag: tagName,
    id,
    classList: [EDIT_CLASS],
    innerHTML: content,
  });
  const isParagraphEditor = editElement instanceof HTMLParagraphElement;
  const isHeadingEditor = editElement instanceof HTMLHeadingElement;
  if (!(isParagraphEditor || isHeadingEditor)) {
    showAlert("Invalid tag for text editor");
    return null;
  }

  editElement.contentEditable = "true";
  editElement.addEventListener(EventType.INPUT, editorChangeListener);

  // TODO move UI to container
  const _uiContainer = createElement({
    tag: ElementTag.DIV,
    id: `${id}-ui-container`,
    classList: [EDIT_CLASS, EDIT_UI_CONTAINER_CLASS],
  });

  const currentTextAlign = style.textAlign || AlignOptions.DEFAULT;
  const editAlignElement = DEPRECATED_createAlignmentWidget(
    id,
    editorChangeListener,
    currentTextAlign,
  );
  if (!editAlignElement) {
    showAlert("Failed to create alignment widget");
    return null;
  }
  // insertElementWithinElement(uiContainer, editAlignElement);

  const editElementLabel = createEditorLabel(
    id,
    isHeading ? EditorTypes.HEADING : EditorTypes.PARAGRAPH,
  );
  const editorObject: {
    editor: HTMLParagraphElement | HTMLHeadingElement;
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
    hrefEditor: null,
    hrefEditorLabel: null,
    imagePreview: null,
  };
}
