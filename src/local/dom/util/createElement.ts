import { INPUT_TYPES } from "../../constants";
import { getUniqueId } from "../../util/random";

export enum ElementTag {
  BUTTON = "button",
  DATALIST = "datalist",
  DIV = "div",
  FIELDSET = "fieldset",
  FIGCAPTION = "figcaption",
  FIGURE = "figure",
  H1 = "h1",
  H2 = "h2",
  H3 = "h3",
  H4 = "h4",
  H5 = "h5",
  H6 = "h6",
  HR = "hr",
  IMG = "img",
  INPUT = "input",
  LABEL = "label",
  LEGEND = "legend",
  LI = "li",
  LINK = "link",
  OPTION = "option",
  P = "p",
  OL = "ol",
  SPAN = "span",
  TEXTAREA = "textarea",
  UL = "ul",
}

export enum StyleProperty {
  ALIGN_ITEMS = "alignItems",
  DISPLAY = "display",
  MARGIN = "margin",
  TEXT_ALIGN = "textAlign",
  WIDTH = "width",
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

export type CreateElementParams = {
  tag?: ElementTag;
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

export function createElement({
  tag = ElementTag.DIV,
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
}: CreateElementParams = {}) {
  const element = document.createElement(tag);
  const uniqueId = giveUniqueId ? `-${getUniqueId()}` : "";
  if (uniqueId || id) {
    element.id = `${id ?? ""}${uniqueId}`;
  }
  element.classList.add(...classList);
  let styleKey: StyleProperty;
  for (styleKey in style) {
    const property = style[styleKey];
    if (property) element.setAttribute("style", property);
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
          element instanceof HTMLParagraphElement
        )
          element[elementKey] = String(value);
      }
    }
  }
  return element;
}
