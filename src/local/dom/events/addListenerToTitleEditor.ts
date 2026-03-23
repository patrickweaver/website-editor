import { EventType, TitleProperty } from "../../types";
import { setUnsavedChanges } from "../util/setUnsavedChanges";

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

  // TODO could this be abstracted?
  const onUpdateTitleProperty = (_event: Event) => {
    const newValue = editor.value;
    element[property] = newValue;
    otherElementIds?.forEach((id) => {
      const element = document.getElementById(id);
      if (!(element instanceof HTMLTitleElement)) return;
      element[property] = newValue;
    });
    setUnsavedChanges();
  };

  editor.addEventListener(EventType.INPUT, onUpdateTitleProperty);
}
