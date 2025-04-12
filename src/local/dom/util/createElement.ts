import { INPUT_TYPES } from "../../constants";
import { getUniqueId } from "../../util/random";
import { ElementTag, ElementTagToType } from "../../types";

export enum StyleProperty {
  ALIGN_ITEMS = "alignItems",
  ALIGN_SELF = "alignSelf",
  DISPLAY = "display",
  MARGIN = "margin",
  MIN_HEIGHT = "minHeight",
  TEXT_ALIGN = "textAlign",
  WIDTH = "width",
  FLEX_DIRECTION = "flexDirection",
}

export enum ElementProperty {
  INNER_HTML = "innerHTML",
  VALUE = "value",
  TYPE = "type",
  NAME = "name",
  HTML_FOR = "htmlFor",
  SRC = "src",
  ALT = "alt",
}

export type CreateElementParams<T extends keyof ElementTagToType> = {
  tag?: T;
  id?: string | null;
  giveUniqueId?: boolean;
  classList?: string[];
  style?: { [K in StyleProperty]?: string };
  innerHTML?: string;
  value?: string | number;
  type?: INPUT_TYPES | null;
  name?: string;
  htmlFor?: string;
  imageSrc?: string;
  altText?: string;
};

export function createElement<T extends keyof ElementTagToType>({
  tag = ElementTag.DIV as T,
  id = null,
  giveUniqueId = false,
  classList = [],
  style = {},
  innerHTML,
  value,
  type,
  name,
  htmlFor,
  imageSrc,
  altText,
}: CreateElementParams<T> = {}): ElementTagToType[T] {
  const element = document.createElement(tag);
  const uniqueId = giveUniqueId ? `-${getUniqueId()}` : "";
  if (uniqueId || id) {
    element.id = `${id ?? ""}${uniqueId}`;
  }
  element.classList.add(...classList);
  let styleKey: StyleProperty;
  for (styleKey in style) {
    const property = style[styleKey];
    if (property) element.style[styleKey] = property;
  }
  const elementProperties: { [K in ElementProperty]?: string | number | null } =
    {
      innerHTML,
      value,
      type,
      name,
      htmlFor,
      src: imageSrc,
      alt: altText,
    };
  let elementKey: ElementProperty;
  for (elementKey in elementProperties) {
    const value = elementProperties[elementKey];
    if (value) {
      if (
        elementKey === ElementProperty.ALT ||
        elementKey === ElementProperty.SRC
      ) {
        if (element instanceof HTMLImageElement)
          element[elementKey] = String(value);
      } else if (elementKey === ElementProperty.VALUE) {
        if (
          element instanceof HTMLButtonElement ||
          element instanceof HTMLInputElement ||
          element instanceof HTMLLIElement ||
          element instanceof HTMLOptionElement
        )
          element[elementKey] = value;
      } else if (
        elementKey === ElementProperty.TYPE ||
        elementKey === ElementProperty.NAME
      ) {
        if (element instanceof HTMLInputElement)
          element[elementKey] = String(value);
      } else if (elementKey === ElementProperty.HTML_FOR) {
        if (element instanceof HTMLLabelElement)
          element[elementKey] = String(value);
      } else if (elementKey === ElementProperty.INNER_HTML) {
        if (
          element instanceof HTMLHeadingElement ||
          element instanceof HTMLParagraphElement ||
          element instanceof HTMLButtonElement ||
          element instanceof HTMLLabelElement ||
          element instanceof HTMLSpanElement ||
          element instanceof HTMLLegendElement ||
          element instanceof HTMLElement
        )
          element[elementKey] = String(value);
      }
    }
  }
  return element;
}
