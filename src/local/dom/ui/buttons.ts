import {
  EditorButtonConfig,
  ElementTag,
  EventType,
  LinkButtonConfig,
} from "../../types";
import {
  EDIT_BUTTONS_CLASS,
  DESTRUCTIVE_BUTTON_CLASS,
  SAVE_BUTTON_CLASS,
  NON_DESTRUCTIVE_BUTTON_CLASS,
  EditableType,
} from "../../util/constants";
import {
  BUTTON_ALT_TEXT,
  BUTTON_CANCEL,
  BUTTON_DELETE,
  BUTTON_FORMAT,
  BUTTON_LINK,
  BUTTON_OPEN_EDITOR,
  BUTTON_OPEN_LINK,
  BUTTON_SAVE,
  BUTTON_UPLOAD,
} from "../../util/strings";
import {
  actionCancelEdit,
  actionCreateLink,
  actionDeleteElement,
  actionOpenAltTextPanel,
  actionOpenFormatPanel,
  actionOpenUploadPanel,
  actionSaveChanges,
  getActionOpenEditor,
  getActionOpenLink,
} from "../events/actions";
import { createElement } from "../util/createElement";

const editorEditorButtonConfig: EditorButtonConfig[] = [
  {
    label: BUTTON_CANCEL,
    eventListener: actionCancelEdit,
    editableTypes: [EditableType.IMAGE, EditableType.TEXT],
    className: NON_DESTRUCTIVE_BUTTON_CLASS,
  },
  {
    label: BUTTON_DELETE,
    eventListener: actionDeleteElement,
    editableTypes: [EditableType.IMAGE, EditableType.TEXT],
    className: DESTRUCTIVE_BUTTON_CLASS,
  },
  {
    label: BUTTON_FORMAT,
    eventListener: actionOpenFormatPanel,
    editableTypes: [EditableType.IMAGE, EditableType.TEXT],
  },
  {
    label: BUTTON_UPLOAD,
    eventListener: actionOpenUploadPanel,
    editableTypes: [EditableType.IMAGE],
  },
  {
    label: BUTTON_ALT_TEXT,
    eventListener: actionOpenAltTextPanel,
    editableTypes: [EditableType.IMAGE],
  },
  {
    label: BUTTON_LINK,
    eventListener: actionCreateLink,
    editableTypes: [EditableType.TEXT, EditableType.IMAGE],
  },
  {
    label: BUTTON_SAVE,
    eventListener: actionSaveChanges,
    editableTypes: [EditableType.IMAGE, EditableType.TEXT],
    className: SAVE_BUTTON_CLASS,
  },
];

export function getEditorButtons(editableType: EditableType): HTMLDivElement {
  const buttonsContainerElement = createElement({
    tag: ElementTag.DIV,
    classList: [EDIT_BUTTONS_CLASS],
  });

  const buttons = editorEditorButtonConfig.filter((i) =>
    i.editableTypes?.includes(editableType),
  );
  for (const { label, eventListener, className } of buttons) {
    const buttonElement = createElement({
      tag: ElementTag.BUTTON,
      innerHTML: label,
      classList: className ? [className] : undefined,
    });
    buttonElement.addEventListener(EventType.CLICK, eventListener);
    buttonsContainerElement.appendChild(buttonElement);
  }

  return buttonsContainerElement;
}

const linkEditorButtonConfig: LinkButtonConfig[] = [
  {
    label: BUTTON_OPEN_LINK,
    getEventListener: getActionOpenLink,
  },
  {
    label: BUTTON_OPEN_EDITOR,
    getEventListener: getActionOpenEditor,
  },
];

export function getLinkButtons(
  anchor: HTMLAnchorElement,
  relatedElement: HTMLHeadingElement | HTMLParagraphElement | HTMLImageElement,
  relatedElementCallback: (element: HTMLElement) => void,
  linkToolbar: HTMLDivElement,
): HTMLDivElement {
  const buttonsContainerElement = createElement({
    tag: ElementTag.DIV,
    classList: [EDIT_BUTTONS_CLASS],
  });

  const buttons = linkEditorButtonConfig;
  for (const { label, getEventListener } of buttons) {
    const buttonElement = createElement({
      tag: ElementTag.BUTTON,
      innerHTML: label,
    });
    buttonElement.addEventListener(
      EventType.CLICK,
      getEventListener(
        anchor,
        relatedElement,
        relatedElementCallback,
        linkToolbar,
      ),
    );
    buttonsContainerElement.appendChild(buttonElement);
  }

  return buttonsContainerElement;
}
