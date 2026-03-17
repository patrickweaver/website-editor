import { INPUT_TYPES } from "../../util/constants";
import { getUniqueId } from "../../util/random";
import { ElementTag, ElementTagToType } from "../../types";

export enum ElementProperty {
  INNER_HTML = "innerHTML",
  VALUE = "value",
  TYPE = "type",
  NAME = "name",
  HTML_FOR = "htmlFor",
  HREF = "href",
  SRC = "src",
  ALT = "alt",
  MIN = "min",
  MAX = "max",
}

export type CreateElementParams<T extends keyof ElementTagToType> = {
  tag?: T;
  id?: string | null;
  giveUniqueId?: boolean;
  classList?: string[];
  innerHTML?: string;
  value?: string | number;
  type?: INPUT_TYPES | null;
  name?: string;
  htmlFor?: string;
  imageSrc?: string;
  altText?: string;
  min?: string | number;
  max?: string | number;
  href?: string;
};

export function createElement<T extends keyof ElementTagToType>({
  tag = ElementTag.DIV as T,
  id = null,
  giveUniqueId = false,
  classList = [],
  innerHTML,
  value,
  type,
  name,
  htmlFor,
  imageSrc,
  altText,
  min,
  max,
  href,
}: CreateElementParams<T> = {}): ElementTagToType[T] {
  const element = document.createElement(tag);
  const uniqueId = giveUniqueId ? `-${getUniqueId()}` : "";
  if (uniqueId || id) {
    element.id = `${id ?? ""}${uniqueId}`;
  }
  element.classList.add(...classList);
  const elementProperties: { [K in ElementProperty]?: string | number | null } =
    {
      innerHTML,
      value,
      type,
      name,
      htmlFor,
      src: imageSrc,
      alt: altText,
      min,
      max,
      href,
    };
  let elementKey: ElementProperty;
  for (elementKey in elementProperties) {
    const value = elementProperties[elementKey];
    // TODO this is hard to read
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
      } else if (
        elementKey === ElementProperty.MIN ||
        elementKey === ElementProperty.MAX
      ) {
        if (element instanceof HTMLInputElement) {
          element[elementKey] = String(value);
        }
      } else if (elementKey === ElementProperty.HREF) {
        if (element instanceof HTMLAnchorElement) {
          element[elementKey] = String(value);
        }
      }
    }
  }
  return element;
}
