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
  editor: HTMLTextAreaElement | HTMLInputElement;
  editorLabel: HTMLLabelElement;
  tagPicker: HTMLSelectElement | null;
  tagPickerLabel: HTMLLabelElement | null;
  altEditor: HTMLInputElement | null;
  altEditorLabel: HTMLLabelElement | null;
  alignSelect: HTMLFieldSetElement;
  imagePreview: HTMLElement | null;
};

export type EditorButtonUpdateCallback = ({
  editorElement,
  tagNameSelect,
  alignSelectElement,
  altTextEditor,
  originalElement,
  editorId,
}: {
  editorElement?: HTMLTextAreaElement | HTMLInputElement;
  tagNameSelect?: HTMLSelectElement;
  alignSelectElement: HTMLFieldSetElement;
  altTextEditor?: HTMLInputElement;
  originalElement?:
    | HTMLImageElement
    | HTMLParagraphElement
    | HTMLHeadingElement;
  editorId?: string;
}) => Promise<boolean | undefined>;

export type EditorButton = {
  label: string;
  initiallyDisabled: boolean;
  updateElement: EditorButtonUpdateCallback;
};
