import { CSSProperties } from "../../types";
import { rgb2hex } from "../../util/color";

export function getCurrentStyle(
  property: CSSProperties,
  element: HTMLElement = document.body,
) {
  const currentStyle = element.style[property];
  if (property === CSSProperties.BACKGROUND_COLOR || CSSProperties.COLOR)
    return rgb2hex(currentStyle || "rgb(255, 255, 255)") ?? undefined;
  return currentStyle;
}
