export function getButtonId(label: string, editorId: string) {
  return `${slugify(label)}-${editorId}`;
}

export function getEditorContainerId(editorId: string) {
  return `container-${editorId}`;
}

export function slugify(text: string) {
  return text.split(" ").join("-").toLowerCase();
}

export function trimHTML(text: string) {
  return text
    .split(/(\s)+/)
    .filter((i) => ![" ", "", "\t"].some((j) => j === i))
    .join(" ");
}
