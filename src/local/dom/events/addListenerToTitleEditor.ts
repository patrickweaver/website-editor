import { EventType, TitleProperty } from "../../types";

export function addListenerToTitleEditor(
  editorId: string,
  elementId: string,
  property: TitleProperty,
  otherElementIds?: string[],
) {
  const editor = document.getElementById(editorId);
  if (
    !(editor instanceof HTMLInputElement) &&
    !(editor instanceof HTMLTextAreaElement)
  )
    return;
  const element = document.getElementById(elementId);

  if (!(element instanceof HTMLTitleElement)) {
    return;
  }

  editor.value = element[property];

  const onUpdateTitleProperty = (_event: Event) => {
    const newValue = editor.value;
    element[property] = newValue;
    otherElementIds?.forEach((id) => {
      const element = document.getElementById(id);
      if (!(element instanceof HTMLTitleElement)) return;
      element[property] = newValue;
    });
  };

  editor.addEventListener(EventType.INPUT, onUpdateTitleProperty);
}
