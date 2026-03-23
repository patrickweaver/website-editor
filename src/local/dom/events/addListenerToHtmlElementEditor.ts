import { EventType, HtmlProperty } from "../../types";
import { setUnsavedChanges } from "../util/setUnsavedChanges";

export function addListenerToHtmlElementEditor(
  editorId: string,
  elementId: string,
  property: HtmlProperty,
) {
  const editor = document.getElementById(editorId);
  if (!(editor instanceof HTMLInputElement)) return;
  const element = document.getElementById(elementId);

  if (!(element instanceof HTMLHtmlElement)) {
    return;
  }

  editor.value = element[property];

  const onUpdateHtmlProperty = (_event: Event) => {
    const newValue = editor.value;
    element[property] = newValue;
    setUnsavedChanges();
  };

  editor.addEventListener(EventType.INPUT, onUpdateHtmlProperty);
}
