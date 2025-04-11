import { EventType, HtmlProperty } from "../../types";

export function addListenerToHtmlElementEditor(
  editorId: string,
  elementId: string,
  property: HtmlProperty,
) {
  const editor = document.getElementById(editorId);
  if (
    !(editor instanceof HTMLInputElement) &&
    !(editor instanceof HTMLTextAreaElement)
  )
    return;
  const element = document.getElementById(elementId);

  if (!(element instanceof HTMLHtmlElement)) {
    return;
  }

  editor.value = element[property];

  const onUpdateHtmlProperty = (_event: Event) => {
    const newValue = editor.value;
    element[property] = newValue;
  };

  editor.addEventListener(EventType.INPUT, onUpdateHtmlProperty);
}
