const htmlLinebreakRegex = /<\s?br\s?\/?>/g;
const textLinebreakRegex = /\n/g;

export function countLinebreaks(text: string) {
  return text.split(textLinebreakRegex).length;
}

export function getButtonId(label: string, editorId: string) {
  return `${slugify(label)}-${editorId}`;
}

export function getEditorContainerId(editorId: string) {
  return `container-${editorId}`;
}

export function renderWhitespaceForHTML(text: string) {
  return text.replaceAll(/\n/g, "<br />");
}

export function renderWhitespaceForEditor(text: string) {
  return text.replaceAll(htmlLinebreakRegex, "\n");
}

export function slugify(text: string) {
  return text.split(" ").join("-").toLowerCase();
}

export function trimHTML(text: string) {
  console.log({ string: text.split(/(\s)+/) });
  return text
    .split(/(\s)+/)
    .filter((i) => ![" ", "", "\t"].some((j) => j === i))
    .join(" ");
}
