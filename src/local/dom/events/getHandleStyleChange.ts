import { CSSProperties } from "../../types";
import { setUnsavedChanges } from "../util/setUnsavedChanges";

export function getHandleGlobalStyleChange(property: CSSProperties) {
  return (changeEvent: Event) => {
    const target = changeEvent.target;
    if (!(target instanceof HTMLInputElement)) return;
    document.body.style[property] = target.value;
    setUnsavedChanges();
  };
}
