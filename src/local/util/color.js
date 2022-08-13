// https://stackoverflow.com/questions/1740700/how-to-get-hex-color-value-rather-than-rgb-value
// Hex is needed for <input type="color" />
export function rgb2hex(rgb) {
  return `#${rgb
    .match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)
    .slice(1)
    .map((n) => parseInt(n, 10).toString(16).padStart(2, "0"))
    .join("")}`;
}
