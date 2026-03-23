import { EditableType } from "./util/constants";

export enum ElementTag {
  A = "a",
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
  SELECT = "select",
  SPAN = "span",
  TEXTAREA = "textarea",
  UL = "ul",
}

export type ElementTagToType = {
  [ElementTag.A]: HTMLAnchorElement;
  [ElementTag.BUTTON]: HTMLButtonElement;
  [ElementTag.DATALIST]: HTMLDataListElement;
  [ElementTag.DIV]: HTMLDivElement;
  [ElementTag.FIELDSET]: HTMLFieldSetElement;
  [ElementTag.FIGCAPTION]: HTMLElement;
  [ElementTag.FIGURE]: HTMLElement;
  [ElementTag.H1]: HTMLHeadingElement;
  [ElementTag.H2]: HTMLHeadingElement;
  [ElementTag.H3]: HTMLHeadingElement;
  [ElementTag.H4]: HTMLHeadingElement;
  [ElementTag.H5]: HTMLHeadingElement;
  [ElementTag.H6]: HTMLHeadingElement;
  [ElementTag.HR]: HTMLElement;
  [ElementTag.IMG]: HTMLImageElement;
  [ElementTag.INPUT]: HTMLInputElement;
  [ElementTag.LABEL]: HTMLLabelElement;
  [ElementTag.LEGEND]: HTMLLegendElement;
  [ElementTag.LI]: HTMLLIElement;
  [ElementTag.LINK]: HTMLLinkElement;
  [ElementTag.OL]: HTMLOListElement;
  [ElementTag.OPTION]: HTMLOptionElement;
  [ElementTag.P]: HTMLParagraphElement;
  [ElementTag.SELECT]: HTMLSelectElement;
  [ElementTag.SPAN]: HTMLSpanElement;
  [ElementTag.TEXTAREA]: HTMLTextAreaElement;
  [ElementTag.UL]: HTMLUListElement;
};

export enum InsertPosition {
  BEFORE_BEGIN = "beforebegin",
  BEFORE_END = "beforeend",
  AFTER_BEGIN = "afterbegin",
  AFTER_END = "afterend",
}

export enum CSSProperties {
  COLOR = "color",
  BACKGROUND_COLOR = "backgroundColor",
}

export enum IMAGE_PREVIEW {
  IMAGE,
  FAVICON,
}

export enum EditorTypes {
  ALIGN = "align",
  HEADING = "heading",
  HEADING_LEVEL = "heading-level",
  IMAGE = "image",
  IMAGE_ALT_TEXT = "image-alt",
  IMAGE_HREF = "image-href",
  OPTION = "option",
  PARAGRAPH = "paragraph",
  TEXT = "text",
}

export enum EventType {
  CHANGE = "change",
  CLICK = "click",
  INPUT = "input",
}

export enum AlignOptions {
  LEFT = "LEFT",
  CENTER = "CENTER",
  RIGHT = "RIGHT",
  DEFAULT = "DEFAULT",
}

export enum FlexAlignCssValues {
  LEFT = "flex-start",
  CENTER = "center",
  RIGHT = "flex-end",
  DEFAULT = "default",
}

export enum TextAlignCssValues {
  LEFT = "left",
  CENTER = "center",
  RIGHT = "right",
  DEFAULT = "auto",
}

export enum UpdateMethod {
  REMOVE = "removeEventListener",
  ADD = "addEventListener",
}

export enum MetaProperty {
  CONTENT = "content",
}

export enum HtmlProperty {
  LANG = "lang",
}

export enum TitleProperty {
  INNER_HTML = "innerHTML",
}

export enum TextElementProperty {
  INNER_HTML = "innerHTML",
  STYLE = "style",
  TAG_NAME = "tagName",
}

export enum ImgElementProperty {
  ALT = "alt",
  SRC = "src",
  STYLE = "style",
}

export type Editor = {
  editor: HTMLHeadingElement | HTMLParagraphElement | HTMLInputElement;
  editorLabel: HTMLLabelElement;
  tagPicker: HTMLSelectElement | null;
  tagPickerLabel: HTMLLabelElement | null;
  altEditor: HTMLInputElement | null;
  altEditorLabel: HTMLLabelElement | null;
  hrefEditor: HTMLInputElement | null;
  hrefEditorLabel: HTMLLabelElement | null;
};

export type EditorButtonUpdateArgs = {
  editorElement?: HTMLHeadingElement | HTMLParagraphElement | HTMLInputElement;
  tagNameSelect?: HTMLSelectElement;
  altTextEditor?: HTMLInputElement;
  hrefEditor?: HTMLInputElement;
  originalElement?:
    | HTMLParagraphElement
    | HTMLHeadingElement
    | HTMLImageElement;
  editorId?: string;
};

export type TextEditorButtonUpdateCallback = (
  args: EditorButtonUpdateArgs,
) => Promise<boolean | undefined>;

export type ImageEditorButtonUpdateCallback = (
  args: EditorButtonUpdateArgs,
) => Promise<boolean | undefined>;

export type EditorButtonConfig = {
  label: string;
  eventListener: (event: Event) => void;
  editableTypes: EditableType[];
};

export type LinkButtonConfig = {
  label: string;
  getEventListener: (
    anchor: HTMLAnchorElement,
    relatedElement:
      | HTMLHeadingElement
      | HTMLParagraphElement
      | HTMLImageElement,
    relatedElementCallback: (element: HTMLElement) => void,
    linkToolbar: HTMLDivElement,
  ) => (event: Event) => void;
};
