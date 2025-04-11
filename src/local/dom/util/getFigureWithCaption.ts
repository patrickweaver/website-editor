import { _ElementTag, createElement } from "./createElement";
import { insertElementWithinElement } from "./insertElementWithinElement";

export function getFigureWithCaption(
  figureId: string,
  captionText: string,
  imageId: string,
  imageSrc: string,
  imageAlt: string,
) {
  const figure = createElement({ tag: _ElementTag.FIGURE, id: figureId });
  const caption = createElement({
    tag: _ElementTag.FIGCAPTION,
    innerHTML: captionText,
  });
  const image = createElement({
    tag: _ElementTag.IMG,
    id: imageId,
    imageSrc,
    altText: imageAlt,
  });
  insertElementWithinElement(figure, caption);
  insertElementWithinElement(figure, image);
  return figure;
}
