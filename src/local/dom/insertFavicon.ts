import { GLOBALS } from "../../globals";
import {
  CURRENT_FAVICON_PREVIEW_ID,
  FAVICON_QUERY_SELECTOR,
} from "../constants";
import { ElementTag } from "../types";
import { getDataURLFromFile } from "../util/files";
import { createElement } from "./util/createElement";
import { getTypedElementById } from "./util/getTypedElementById";

export async function insertFavicon(file: File) {
  const oldElement = document.querySelector(FAVICON_QUERY_SELECTOR);
  if (oldElement) oldElement.remove();
  const dataUrl = await getDataURLFromFile(file);
  const newElement = createElement({ tag: ElementTag.LINK });
  newElement.rel = "icon";
  newElement.href = dataUrl;
  const faviconPreviewElement = getTypedElementById(
    CURRENT_FAVICON_PREVIEW_ID,
    HTMLImageElement,
  );
  if (!faviconPreviewElement) return;
  faviconPreviewElement.src = dataUrl;
  document.getElementsByTagName("head")?.[0]?.appendChild(newElement);
  GLOBALS.EDITING_STATE_DIRTY = true;
}
