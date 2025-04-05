import { INPUT_TYPES } from "../../constants";
import { getUniqueId } from "../../util/random";

export enum HeaderTag {
  H1 = "h1",
  H2 = "h2",
  H3 = "h3",
  H4 = "h4",
  H5 = "h5",
  H6 = "h6",
}

export enum _ElementTag {
  A = "a",
  BUTTON = "button",
  DATALIST = "datalist",
  DIV = "div",
  FIELDSET = "fieldset",
  FIGCAPTION = "figcaption",
  FIGURE = "figure",
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
  SELECT = "select",
  SPAN = "span",
  TEXTAREA = "textarea",
  UL = "ul",
}

export type ElementTag = HeaderTag | _ElementTag;

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

type ElementTagToType = {
  [_ElementTag.A]: HTMLAnchorElement;
  [_ElementTag.BUTTON]: HTMLButtonElement;
  [_ElementTag.DATALIST]: HTMLDataListElement;
  [_ElementTag.DIV]: HTMLDivElement;
  [_ElementTag.FIELDSET]: HTMLFieldSetElement;
  [_ElementTag.FIGCAPTION]: HTMLElement;
  [_ElementTag.FIGURE]: HTMLElement;
  [HeaderTag.H1]: HTMLHeadingElement;
  [HeaderTag.H2]: HTMLHeadingElement;
  [HeaderTag.H3]: HTMLHeadingElement;
  [HeaderTag.H4]: HTMLHeadingElement;
  [HeaderTag.H5]: HTMLHeadingElement;
  [HeaderTag.H6]: HTMLHeadingElement;
  [_ElementTag.HR]: HTMLElement;
  [_ElementTag.IMG]: HTMLImageElement;
  [_ElementTag.INPUT]: HTMLInputElement;
  [_ElementTag.LABEL]: HTMLLabelElement;
  [_ElementTag.LEGEND]: HTMLLegendElement;
  [_ElementTag.LI]: HTMLLIElement;
  [_ElementTag.LINK]: HTMLLinkElement;
  [_ElementTag.OL]: HTMLOListElement;
  [_ElementTag.OPTION]: HTMLOptionElement;
  [_ElementTag.P]: HTMLParagraphElement;
  [_ElementTag.SELECT]: HTMLSelectElement;
  [_ElementTag.SPAN]: HTMLSpanElement;
  [_ElementTag.UL]: HTMLUListElement;
};

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
  tag = _ElementTag.DIV as T,
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
