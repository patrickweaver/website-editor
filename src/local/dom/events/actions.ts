import {
  AlignOptions,
  FlexAlignCssValues,
  TextAlignCssValues,
} from "../../types";
import {
  CURRENTLY_EDITING_ALT_TEXT_ID,
  CURRENTLY_EDITING_FORMATTING_ID,
  CURRENTLY_EDITING_UPLOAD_ID,
  DATA_ORIGINAL_ALT,
  DATA_ORIGINAL_CSS,
  DATA_ORIGINAL_HTML,
  DATA_ORIGINAL_SRC,
  EditableType,
} from "../../util/constants";
import { getDataURLFromFile, isImageFile } from "../../util/files";
import { CONFIRM_DELETE } from "../../util/strings";
import {
  openAltTextPanel,
  openFormattingPanel,
  openUploadPanel,
} from "../ui/toolbar";
import {
  getCurrentlyEditingElement,
  getCurrentlyEditingToolbar,
  getEditableType,
} from "../ui/util";
import { addLinkAroundSelection } from "../util/addLinkAroundSelection";
import { showAlert } from "../util/alert";

export async function actionDeleteElement(_event: Event) {
  const result = window.confirm(CONFIRM_DELETE);
  if (!result) return;
  const currentlyEditing = getCurrentlyEditingElement();
  if (!currentlyEditing) return;
  const toolbar = getCurrentlyEditingToolbar();
  toolbar?.remove();
  currentlyEditing.remove();
}

function exitEditMode(element: HTMLElement) {
  const toolbar = getCurrentlyEditingToolbar();
  toolbar?.remove();
  const editableType = getEditableType();
  const isImage =
    editableType === EditableType.IMAGE && element instanceof HTMLImageElement;
  const trimmedInnerHtml = element?.innerHTML
    .replace(/<br\s*\/?>/gi, "")
    .trim();
  if ((isImage && !element.src) || !trimmedInnerHtml) {
    element.remove();
    return;
  }
  element.removeAttribute("id");
  element.removeAttribute("contentEditable");
  element.removeAttribute(DATA_ORIGINAL_HTML);
  element.removeAttribute(DATA_ORIGINAL_CSS);
  element.removeAttribute(DATA_ORIGINAL_SRC);
  element.removeAttribute(DATA_ORIGINAL_ALT);
}

export function cancelEditAction() {
  const currentlyEditing = getCurrentlyEditingElement();

  if (currentlyEditing) {
    const editableType = getEditableType();
    if (editableType === EditableType.TEXT) {
      const originalHtmlEscaped =
        currentlyEditing.getAttribute(DATA_ORIGINAL_HTML);
      if (originalHtmlEscaped) {
        const originalHtmlUnescaped = decodeURIComponent(originalHtmlEscaped);
        currentlyEditing.innerHTML = originalHtmlUnescaped;
      }
    }
    const isImage =
      editableType === EditableType.IMAGE &&
      currentlyEditing instanceof HTMLImageElement;
    if (isImage) {
      const originalSrc = currentlyEditing.getAttribute(DATA_ORIGINAL_SRC);
      if (originalSrc) {
        currentlyEditing.src = originalSrc;
      }
      const originalAlt = currentlyEditing?.getAttribute(DATA_ORIGINAL_ALT);
      if (originalAlt) {
        currentlyEditing.alt = originalAlt;
      } else {
        currentlyEditing.removeAttribute("alt");
      }
    }
    const originalCssEscaped = currentlyEditing.getAttribute(DATA_ORIGINAL_CSS);
    if (originalCssEscaped) {
      const originalCssUnescaped = decodeURIComponent(originalCssEscaped);
      const originalCssParsed = JSON.parse(originalCssUnescaped);
      const keys = Object.keys(originalCssParsed);
      for (const prop of keys) {
        const value = originalCssParsed[prop];
        if (value === "") {
          currentlyEditing.style.removeProperty(prop);
          continue;
        }
        currentlyEditing.style.setProperty(prop, value);
      }
    } else {
      showAlert(`Error restoring CSS for ${currentlyEditing.tagName} element.`);
    }
    exitEditMode(currentlyEditing);
    return true;
  }
  return false;
}

export async function actionCancelEdit(_event: Event) {
  cancelEditAction();
}

export async function actionSaveChanges(_event: Event) {
  const element = getCurrentlyEditingElement();
  if (!element) return;
  exitEditMode(element);
}

export async function actionCreateLink(_event: Event) {
  const element = getCurrentlyEditingElement();
  const isParagraph = element instanceof HTMLParagraphElement;
  if (!isParagraph) return;
  element.innerHTML = addLinkAroundSelection(element);
}

function closePanels(current: string) {
  const panelIds = [
    CURRENTLY_EDITING_ALT_TEXT_ID,
    CURRENTLY_EDITING_FORMATTING_ID,
    CURRENTLY_EDITING_UPLOAD_ID,
  ];
  panelIds.forEach((id) => {
    if (id !== current) {
      const panel = document.getElementById(id);
      panel?.remove();
    }
  });
}

export async function actionOpenFormatPanel(_event: Event) {
  closePanels(CURRENTLY_EDITING_FORMATTING_ID);
  openFormattingPanel();
}

export async function actionOpenUploadPanel(_event: Event) {
  closePanels(CURRENTLY_EDITING_UPLOAD_ID);
  openUploadPanel();
}

export async function actionOpenAltTextPanel(_evnet: Event) {
  closePanels(CURRENTLY_EDITING_ALT_TEXT_ID);
  openAltTextPanel();
}

export async function actionHandleImageUpload(event: Event) {
  const target = event.currentTarget;

  const element = getCurrentlyEditingElement();
  if (!element) {
    showAlert("Error: Invalid element");
    return;
  }

  if (!(element instanceof HTMLImageElement)) {
    showAlert("Error: Element not image.");
    return;
  }
  const isInput = target instanceof HTMLInputElement;
  if (!isInput) {
    showAlert("Error: Invalid element.");
    return;
  }
  const { files } = target;
  if (!files?.[0]) {
    showAlert("Error: Invalid file.");
    return;
  }
  const validFile = isImageFile(files[0]);
  if (!validFile) {
    showAlert("Error: Invalid file.");
    return;
  }
  const url = await getDataURLFromFile(files[0]);

  element.setAttribute("src", url);
  const uploadPanel = document.getElementById(CURRENTLY_EDITING_UPLOAD_ID);
  uploadPanel?.remove();
}

export function actionHandleAltTextUpdate(event: Event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return null;
  const value = target?.value ?? "";

  const element = getCurrentlyEditingElement();
  if (!element || !(element instanceof HTMLImageElement)) {
    showAlert("Invalid element.");
    return;
  }
  element.alt = value;
}

function handleAlignUpdate(event: Event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return null;
  const value = target?.value?.toUpperCase();
  if (
    value !== AlignOptions.LEFT &&
    value !== AlignOptions.CENTER &&
    value !== AlignOptions.RIGHT
  )
    return null;
  return value;
}

export function actionUpdateTextAlign(event: Event) {
  const value = handleAlignUpdate(event);
  if (!value) return;
  const element = getCurrentlyEditingElement();
  if (!element) {
    showAlert("Error: Invlaid element");
    return null;
  }
  element.style.setProperty("text-align", TextAlignCssValues[value]);
}

export function actionUpdateImageAlign(event: Event) {
  const value = handleAlignUpdate(event);
  if (!value) return;
  const element = getCurrentlyEditingElement();
  if (!element) {
    showAlert("Error: Invlaid element");
    return null;
  }
  element.style.setProperty("align-self", FlexAlignCssValues[value]);
}
