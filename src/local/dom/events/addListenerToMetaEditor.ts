import { EventType, MetaProperty } from "../../types";

export function addListenerToMetaEditor(
  editorId: string,
  elementId: string,
  property: MetaProperty,
  otherElementIds?: string[],
) {
  const editor = document.getElementById(editorId);
  if (
    !(editor instanceof HTMLInputElement) &&
    !(editor instanceof HTMLTextAreaElement)
  )
    return;
  const element = document.getElementById(elementId);

  if (!(element instanceof HTMLMetaElement)) {
    return;
  }

  editor.value = element[property];

  const onUpdateMetaProperty = (_event: Event) => {
    const newValue = editor.value;
    element[property] = newValue;
    otherElementIds?.forEach((id) => {
      const element = document.getElementById(id);
      if (!(element instanceof HTMLMetaElement)) return;
      element[property] = newValue;
    });
  };

  editor.addEventListener(EventType.INPUT, onUpdateMetaProperty);
}
