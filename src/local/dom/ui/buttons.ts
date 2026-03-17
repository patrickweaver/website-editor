import { EditorButtonConfig, ElementTag, EventType } from "../../types";
import { EDIT_BUTTONS_CLASS } from "../../util/constants";
import { BUTTON_CANCEL, BUTTON_DELETE, BUTTON_SAVE } from "../../util/strings";
import {
  actionCancelEdit,
  actionDeleteElement,
  actionSaveChanges,
} from "../events/actions";
import { createElement } from "../util/createElement";

const buttonConfig: EditorButtonConfig[] = [
  {
    label: BUTTON_DELETE,
    initiallyDisabled: false,
    eventListener: actionDeleteElement,
  },
  {
    label: BUTTON_CANCEL,
    initiallyDisabled: false,
    eventListener: actionCancelEdit,
  },
  {
    label: BUTTON_SAVE,
    initiallyDisabled: false,
    eventListener: actionSaveChanges,
  },
];

export function getButtons(): HTMLDivElement {
  const buttonsContainerElement = createElement({
    tag: ElementTag.DIV,
    classList: [EDIT_BUTTONS_CLASS],
  });

  for (const { label, initiallyDisabled, eventListener } of buttonConfig) {
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
