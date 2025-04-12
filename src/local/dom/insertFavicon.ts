import { GLOBALS } from "../../globals";
import {
  CURRENT_FAVICON_PREVIEW_ID,
  FAVICON_QUERY_SELECTOR,
} from "../constants";
import { ElementTag } from "../types";
import { getDataURLFromFile } from "../util/files";
import { createElement } from "./util/createElement";

export async function insertFavicon(file: File) {
  const oldElement = document.querySelector(FAVICON_QUERY_SELECTOR);
  if (!oldElement) return;
  oldElement.remove();
  const newElement = createElement({ tag: ElementTag.LINK });
  const dataUrl = await getDataURLFromFile(file);
  newElement.rel = "icon";
  newElement.href = dataUrl;
  const faviconPreviewElement = document.getElementById(
    CURRENT_FAVICON_PREVIEW_ID,
  );
  if (!(faviconPreviewElement instanceof HTMLImageElement)) return;
  faviconPreviewElement.src = dataUrl;
  document.getElementsByTagName("head")?.[0]?.appendChild(newElement);
  GLOBALS.EDITING_STATE_DIRTY = true;
}
