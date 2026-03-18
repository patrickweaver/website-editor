import { EditorButtonConfig, ElementTag, EventType } from "../../types";
import { EDIT_BUTTONS_CLASS, EditableType } from "../../util/constants";
import { BUTTON_CANCEL, BUTTON_DELETE, BUTTON_FORMAT, BUTTON_LINK, BUTTON_SAVE, BUTTON_UPLOAD } from "../../util/strings";
import {
  actionCancelEdit,
  actionCreateLink,
  actionDeleteElement,
  actionOpenFormatPanel,
  actionOpenUploadPanel,
  actionSaveChanges,
} from "../events/actions";
import { createElement } from "../util/createElement";

const buttonConfig: EditorButtonConfig[] = [
  {
    label: BUTTON_CANCEL,
    initiallyDisabled: false,
    eventListener: actionCancelEdit,
    editableTypes: [EditableType.IMAGE, EditableType.TEXT]
  },
  {
    label: BUTTON_FORMAT,
    initiallyDisabled: false,
    eventListener: actionOpenFormatPanel,
    editableTypes: [EditableType.IMAGE, EditableType.TEXT]
  },
  {
    label: BUTTON_UPLOAD,
    initiallyDisabled: false,
    eventListener: actionOpenUploadPanel,
    editableTypes: [EditableType.IMAGE]
  },
  {
    label: BUTTON_DELETE,
    initiallyDisabled: false,
    eventListener: actionDeleteElement,
    editableTypes: [EditableType.IMAGE, EditableType.TEXT]
  },
  {
    label: BUTTON_LINK,
    initiallyDisabled: false,
    eventListener: actionCreateLink,
    // TODO maybe make a paragraph only type?
    editableTypes: [EditableType.TEXT]
  },
  {
    label: BUTTON_SAVE,
    initiallyDisabled: false,
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
  for (const { label, initiallyDisabled, eventListener } of buttons) {
    const buttonElement = createElement({
      tag: ElementTag.BUTTON,
      innerHTML: label,
    });
    buttonElement.disabled = initiallyDisabled;
    // TODO remove when type is updated
    if (!eventListener) return buttonsContainerElement;
    buttonElement.addEventListener(EventType.CLICK, eventListener);
    buttonsContainerElement.appendChild(buttonElement);
  }

  return buttonsContainerElement;
}
