import { STRINGS } from "../../constants";

export function addLinkAroundSelection(selectableInput: HTMLTextAreaElement) {
  const { selectionStart: start, selectionEnd: end, value } = selectableInput;
  if (start === end) {
    alert(STRINGS.ERROR_NO_SELECTION);
    return value;
  }
  const selection = value.substring(start, end);
  const url = window.prompt(STRINGS.PROMPT_LINK_URL);
  if (!url) {
    alert(STRINGS.ERROR_NO_URL);
    return value;
  }
  const before = value.slice(0, start);
  const after = value.slice(end, value.length);
  return `${before}${wrapLink(selection, url)}${after}`;
}

function wrapLink(text: string, url: string) {
  return `<a href="${url}" target="_blank">${text}</a>`;
}
