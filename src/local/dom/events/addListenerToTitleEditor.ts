import { EventType, MetaElementProperty, TitleProperty } from "../../types";
import { setUnsavedChanges } from "../util/setUnsavedChanges";

export function addListenerToTitleEditor(
  editorId: string,
  elementId: string,
  property: TitleProperty,
  otherElementIds?: { id: string; property: MetaElementProperty }[],
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
    otherElementIds?.forEach(({ id, property }) => {
      const element = document.getElementById(id);
      if (!(element instanceof HTMLMetaElement)) return;
      element[property] = newValue;
    });
    setUnsavedChanges();
  };

  editor.addEventListener(EventType.INPUT, onUpdateTitleProperty);
}
