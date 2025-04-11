import { GLOBALS } from "../../../globals";
import { CSSProperties } from "../../types";

export function getHandleGlobalStyleChange(property: CSSProperties) {
  return (changeEvent: Event) => {
    const target = changeEvent.target;
    if (!(target instanceof HTMLInputElement)) return;
    document.body.style[property] = target.value;
    GLOBALS.EDITING_STATE_DIRTY = true;
  };
}
