export function getButtonId(label, editorId) {
  return `${slugify(label)}-${editorId}`;
}

export function getEditorContainerId(editorId) {
  return `container-${editorId}`;
}

export function slugify(string) {
  return string.split(" ").join("-").toLowerCase();
}
