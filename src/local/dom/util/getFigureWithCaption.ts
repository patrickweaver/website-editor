import { createElement } from "./createElement";
import { insertElementWithinElement } from "./insertElementWithinElement";
import { ElementTag } from "../../types";

export function getFigureWithCaption(
  figureId: string,
  captionText: string,
  imageId: string,
  imageSrc: string,
  imageAlt: string,
  figureStyle: Partial<CSSStyleDeclaration> = {},
  imageStyle: Partial<CSSStyleDeclaration> = {},
) {
  const figure = createElement({ tag: ElementTag.FIGURE, id: figureId });
  const caption = createElement({
    tag: ElementTag.FIGCAPTION,
    innerHTML: captionText,
  });
  const image = createElement({
    tag: ElementTag.IMG,
    id: imageId,
    imageSrc,
    altText: imageAlt,
  });
  insertElementWithinElement(figure, caption);
  insertElementWithinElement(figure, image);
  Object.entries(figureStyle).forEach(([key, value]) => {
    figure.style.setProperty(key, String(value ?? ""));
  });
  Object.entries(imageStyle).forEach(([key, value]) => {
    image.style.setProperty(key, String(value ?? ""));
  });
  return figure;
}
