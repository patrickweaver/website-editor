import { FAVICON_QUERY_SELECTOR } from "../../constants";

export function getCurrentFaviconURL() {
  const faviconLink = document.querySelector(FAVICON_QUERY_SELECTOR);
  if (!(faviconLink instanceof HTMLLinkElement)) return "";
  return faviconLink.href;
}
