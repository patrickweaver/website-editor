import { activateEditor } from "./activateEditor";

export function getElementEventListener() {
  return function (event: Event) {
    const element = event.currentTarget;
    if (!(element instanceof HTMLElement)) return;
    activateEditor(element);
  };
}
