import { rgb2hex } from "../../util/color";

export enum CSSProperties {
  COLOR = "color",
  BACKGROUND_COLOR = "backgroundColor",
}

export function getCurrentStyle(
  property: CSSProperties,
  element: HTMLElement = document.body,
) {
  const currentStyle = element.style[property];
  if (property.toLowerCase().indexOf("color") >= 0)
    return rgb2hex(currentStyle || "rgb(255, 255, 255)");
  return property;
}
