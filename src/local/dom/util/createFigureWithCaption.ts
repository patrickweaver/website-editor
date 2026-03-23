import { createElement } from "./createElement";
import { insertElementWithinElement } from "./insertElementWithinElement";
import { ElementTag } from "../../types";
import { PLACEHOLDER_CLASS } from "../../util/constants";

export function createFigureWithCaption(
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
  let imageOrPlaceholder: HTMLElement;
  if (imageSrc) {
    imageOrPlaceholder = createElement({
      tag: ElementTag.IMG,
      id: imageId,
      imageSrc,
      altText: imageAlt,
    });
  } else {
    imageOrPlaceholder = createElement({
      tag: ElementTag.DIV,
      classList: [PLACEHOLDER_CLASS],
      id: imageId,
      innerHTML: "No image",
    });
  }
  insertElementWithinElement(figure, caption);
  insertElementWithinElement(figure, imageOrPlaceholder);
  Object.entries(figureStyle).forEach(([key, value]) => {
    figure.style.setProperty(key, String(value ?? ""));
  });
  if (imageOrPlaceholder instanceof HTMLImageElement) {
    Object.entries(imageStyle).forEach(([key, value]) => {
      imageOrPlaceholder.style.setProperty(key, String(value ?? ""));
    });
  }
  return figure;
}
