import {
  ERROR_NO_SELECTION,
  ERROR_NO_URL,
  PROMPT_LINK_URL,
} from "../../util/strings";

export function addLinkAroundSelection(selectableInput: HTMLTextAreaElement) {
  const { selectionStart: start, selectionEnd: end, value } = selectableInput;
  if (start === end) {
    alert(ERROR_NO_SELECTION);
    return value;
  }
  const selection = value.substring(start, end);
  const url = window.prompt(PROMPT_LINK_URL);
  if (!url) {
    alert(ERROR_NO_URL);
    return value;
  }
  const before = value.slice(0, start);
  const after = value.slice(end, value.length);
  return `${before}${wrapLink(selection, url)}${after}`;
}

function wrapLink(text: string, url: string) {
  return `<a href="${url}" target="_blank">${text}</a>`;
}
