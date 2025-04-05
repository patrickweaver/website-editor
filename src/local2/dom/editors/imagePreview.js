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

export const IMAGE_PREVIEW = {
  IMAGE: { caption: STRINGS.IMAGE_PREVIEW_CAPTION },
  FAVICON: { caption: STRINGS.FAVICON_PREVIEW_CAPTION },
};

export function makeImagePreview(id, type = IMAGE_PREVIEW.IMAGE) {
  const imagePreviewImg = createElement({
    tag: IMG_ELEMENT,
    id: `${IMAGE_PREVIEW_ID_PREFIX}${id}`,
    classList: [IMAGE_PREVIEW_CLASS],
  });
  const captionText = type.caption;
  const imagePreviewCaption = createElement({
    tag: FIGCAPTION_ELEMENT,
    innerHTML: captionText,
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
