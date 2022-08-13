const htmlLinebreakRegex = /<\s?br\s?\/?>/g;
const textLinebreakRegex = /\n/g;

export function countLinebreaks(string) {
  return string.split(textLinebreakRegex).length;
}

export function getButtonId(label, editorId) {
  return `${slugify(label)}-${editorId}`;
}

export function getEditorContainerId(editorId) {
  return `container-${editorId}`;
}

export function renderWhitespaceForHTML(string) {
  return string.replaceAll(/\n/g, "<br />");
}

export function renderWhitespaceForEditor(string) {
  return string.replaceAll(htmlLinebreakRegex, "\n");
}

export function slugify(string) {
  return string.split(" ").join("-").toLowerCase();
}

export function trimHTML(string) {
  console.log({ string: string.split(/(\s)+/) });
  return string
    .split(/(\s)+/)
    .filter((i) => ![" ", "", "\t"].some((j) => j === i))
    .join(" ");
}
