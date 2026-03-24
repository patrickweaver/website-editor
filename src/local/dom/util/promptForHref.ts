import { ERROR_NO_URL, PROMPT_LINK_URL } from "../../util/strings";

export function promptForHref() {
  let href = window.prompt(PROMPT_LINK_URL);
  if (!href) {
    alert(ERROR_NO_URL);
    return;
  }
  if (href?.slice(0, 4) !== "http") {
    href = `http://${href}`;
  }
  return href;
}
