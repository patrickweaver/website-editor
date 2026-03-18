import { EditorButtonConfig, ElementTag, EventType } from "../../types";
import { EDIT_BUTTONS_CLASS, EditableType } from "../../util/constants";
import { BUTTON_ALT_TEXT, BUTTON_CANCEL, BUTTON_DELETE, BUTTON_FORMAT, BUTTON_LINK, BUTTON_SAVE, BUTTON_UPLOAD } from "../../util/strings";
import {
  actionCancelEdit,
  actionCreateLink,
  actionDeleteElement,
  actionOpenAltTextPanel,
  actionOpenFormatPanel,
  actionOpenUploadPanel,
  actionSaveChanges,
} from "../events/actions";
import { createElement } from "../util/createElement";

const buttonConfig: EditorButtonConfig[] = [
  {
    label: BUTTON_CANCEL,
    eventListener: actionCancelEdit,
    editableTypes: [EditableType.IMAGE, EditableType.TEXT]
  },
  {
    label: BUTTON_DELETE,
    eventListener: actionDeleteElement,
    editableTypes: [EditableType.IMAGE, EditableType.TEXT]
  },
  {
    label: BUTTON_FORMAT,
    eventListener: actionOpenFormatPanel,
    editableTypes: [EditableType.IMAGE, EditableType.TEXT]
  },
  {
    label: BUTTON_UPLOAD,
    eventListener: actionOpenUploadPanel,
    editableTypes: [EditableType.IMAGE]
  },
  {
    label: BUTTON_ALT_TEXT,
    eventListener: actionOpenAltTextPanel,
    editableTypes: [EditableType.IMAGE]
  },
  {
    label: BUTTON_LINK,
    eventListener: actionCreateLink,
    // TODO maybe make a paragraph only type?
    editableTypes: [EditableType.TEXT]
  },
  {
    label: BUTTON_SAVE,
    eventListener: actionSaveChanges,
    editableTypes: [EditableType.IMAGE, EditableType.TEXT]
  },
];

export function getButtons(editableType: EditableType): HTMLDivElement {
  const buttonsContainerElement = createElement({
    tag: ElementTag.DIV,
    classList: [EDIT_BUTTONS_CLASS],
  });

  const buttons = buttonConfig.filter((i) => i.editableTypes?.includes(editableType))
  for (const { label, eventListener } of buttons) {
    const buttonElement = createElement({
      tag: ElementTag.BUTTON,
      innerHTML: label,
    });
    buttonElement.addEventListener(EventType.CLICK, eventListener);
    buttonsContainerElement.appendChild(buttonElement);
  }

  return buttonsContainerElement;
}
