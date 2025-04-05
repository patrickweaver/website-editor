import {
  HIDDEN_CLASS,
  IMAGE_PREVIEW_CLASS,
  IMAGE_PREVIEW_FIGURE_ID_PREFIX,
  IMAGE_PREVIEW_ID_PREFIX,
  STRINGS,
} from "../../constants";
import { IMAGE_PREVIEW } from "../../types";
import { _ElementTag, createElement } from "./createElement";
import { insertElementWithinElement } from "./insertElementWithinElement";

const captions = {
  [IMAGE_PREVIEW.IMAGE]: STRINGS.IMAGE_PREVIEW_CAPTION,
  [IMAGE_PREVIEW.FAVICON]: STRINGS.FAVICON_PREVIEW_CAPTION,
};

export function makeImagePreview(
  id: string,
  type: IMAGE_PREVIEW = IMAGE_PREVIEW.IMAGE,
) {
  const imagePreviewImg = createElement({
    tag: _ElementTag.IMG,
    id: `${IMAGE_PREVIEW_ID_PREFIX}${id}`,
    classList: [IMAGE_PREVIEW_CLASS],
  });
  const captionText = captions[type];
  const imagePreviewCaption = createElement({
    tag: _ElementTag.FIGCAPTION,
    innerHTML: captionText,
  });
  const imagePreviewFigure = createElement({
    tag: _ElementTag.FIGURE,
    id: `${IMAGE_PREVIEW_FIGURE_ID_PREFIX}${id}`,
    classList: [HIDDEN_CLASS],
  });
  insertElementWithinElement(imagePreviewFigure, imagePreviewCaption);
  insertElementWithinElement(imagePreviewFigure, imagePreviewImg);
  return imagePreviewFigure;
}
