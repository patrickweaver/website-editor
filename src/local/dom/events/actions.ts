import {
  CURRENTLY_EDITING_ID,
  CURRENTLY_EDITING_TOOLBAR_ID,
} from "../../util/constants";
import { CONFIRM_DELETE } from "../../util/strings";

function getCurrentlyEditingElement() {
  return document.getElementById(CURRENTLY_EDITING_ID);
}

function getCurrentlyEditingToolbar() {
  return document.getElementById(CURRENTLY_EDITING_TOOLBAR_ID);
}

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
  const toolbar = getCurrentlyEditingToolbar();
  toolbar?.remove();
}

export function cancelEditAction() {
  const currentlyEditing = getCurrentlyEditingElement();
  if (currentlyEditing) {
    const originalHtmlEscaped =
      currentlyEditing.getAttribute("data-original-html");
    if (originalHtmlEscaped) {
      const originalHtmlUnescaped = decodeURIComponent(originalHtmlEscaped);
      currentlyEditing.innerHTML = originalHtmlUnescaped;
    } else {
      currentlyEditing.innerHTML +=
        "<br>Error loading original content, please restore from backup.";
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
