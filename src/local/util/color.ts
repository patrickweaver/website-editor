// https://stackoverflow.com/questions/1740700/how-to-get-hex-color-value-rather-than-rgb-value

import { showAlert } from "./alert";

// Hex is needed for <input type="color" />
export function rgb2hex(rgb: string) {
  const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (!match) {
    showAlert(`Invalid color: ${rgb}`);
    return null;
  }
  return `#${match
    .slice(1)
    .map((n) => parseInt(n, 10).toString(16).padStart(2, "0"))
    .join("")}`;
}
