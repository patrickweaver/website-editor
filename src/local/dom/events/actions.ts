
import { AlignOptions, TextAlignCssValues } from "../../types";
import { DATA_ORIGINAL_CSS, DATA_ORIGINAL_HTML } from "../../util/constants";
import { CONFIRM_DELETE } from "../../util/strings";
import { openFormattingPanel } from "../ui/toolbar";
import { getCurrentlyEditingElement, getCurrentlyEditingToolbar, getEditableType } from "../ui/util";
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
  element.removeAttribute("id");
  element.removeAttribute("contentEditable");
  element.removeAttribute(DATA_ORIGINAL_HTML);
  element.removeAttribute(DATA_ORIGINAL_CSS)
  const toolbar = getCurrentlyEditingToolbar();
  toolbar?.remove();
}

export function cancelEditAction() {
  const currentlyEditing = getCurrentlyEditingElement();
  if (currentlyEditing) {
    const originalHtmlEscaped =
      currentlyEditing.getAttribute(DATA_ORIGINAL_HTML);
    if (originalHtmlEscaped) {
      const originalHtmlUnescaped = decodeURIComponent(originalHtmlEscaped);
      currentlyEditing.innerHTML = originalHtmlUnescaped;
    } else {
      currentlyEditing.innerHTML +=
        "<br>Error loading original content, please restore from backup.";
    }
    const originalCssEscaped = currentlyEditing.getAttribute(DATA_ORIGINAL_CSS);
    if (originalCssEscaped) {
      const originalCssUnescaped = decodeURIComponent(originalCssEscaped);
      currentlyEditing.style = originalCssUnescaped;
    } else {
      showAlert(`Error restoring CSS for ${currentlyEditing.tagName} element.`)
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

export async function actionOpenFormatPanel(_event: Event) {
  let editableType = getEditableType();
  if (!editableType) {
    showAlert("Error: Invalid element")
    return
  }
  openFormattingPanel(editableType)
}

export async function actionUpdateTextAlign(event: Event) {
  const element = getCurrentlyEditingElement();
  if (!element) {
    showAlert("Error: Invlaid element");
    return
  }

  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;
  const value = target?.value?.toUpperCase();
  if (
    value !== AlignOptions.LEFT &&
    value !== AlignOptions.CENTER &&
    value !== AlignOptions.RIGHT
  ) return;
  element.style.setProperty("text-align", TextAlignCssValues[value]);
}
