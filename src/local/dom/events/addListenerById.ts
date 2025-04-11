import { EventType } from "../../types";

export function addListenerById(
  id: string,
  callback: (event: Event) => void,
  type: EventType = EventType.CHANGE,
) {
  document.getElementById(id)?.addEventListener(type, callback);
}
