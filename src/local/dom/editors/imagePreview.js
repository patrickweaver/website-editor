import { createElement } from "..";

import {
  IMG_ELEMENT,
  IMAGE_PREVIEW_ID_PREFIX,
  HIDDEN_CLASS,
  IMAGE_PREVIEW_CLASS,
  FIGCAPTION_ELEMENT,
  FIGURE_ELEMENT,
  IMAGE_PREVIEW_FIGURE_ID_PREFIX,
  STRINGS,
} from "../../constants";

export function makeImagePreview(id) {
  const imagePreviewImg = createElement({
    tag: IMG_ELEMENT,
    id: `${IMAGE_PREVIEW_ID_PREFIX}${id}`,
    classList: [IMAGE_PREVIEW_CLASS],
  });
  const imagePreviewCaption = createElement({
    tag: FIGCAPTION_ELEMENT,
    innerHTML: STRINGS.IMAGE_PREVIEW_CAPTION,
  });
  const imagePreviewFigure = createElement({
    tag: FIGURE_ELEMENT,
    id: `${IMAGE_PREVIEW_FIGURE_ID_PREFIX}${id}`,
    classList: [HIDDEN_CLASS],
  });
  imagePreviewFigure.insertAdjacentElement("beforeend", imagePreviewCaption);
  imagePreviewFigure.insertAdjacentElement("beforeend", imagePreviewImg);
  return imagePreviewFigure;
}
