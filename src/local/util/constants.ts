import { AlignOptions } from "../types";
import { ALIGNMENT_LABELS, BODY_WIDTH_LABELS } from "./strings";

export const HTML_ELEMENT_ID = "html-element";
export const PAGE_TITLE_INPUT_ID = "edit-page-title";
export const PAGE_TITLE_ID = "page-title";
export const PAGE_OG_TITLE_ID = "og-title";
export const PAGE_TWITTER_TITLE_ID = "twitter-title";
export const PAGE_DESC_INPUT_ID = "edit-page-description";
export const PAGE_DESC_ID = "page-description";
export const PAGE_TWITTER_DESC_ID = "twitter-description";
export const PAGE_OG_DESC_ID = "og-description";
export const PAGE_LANG_INPUT_ID = "edit-page-language";
export const STATE_ELEMENT_ID = "editor-state";
export const UNSAVED_CHANGES_BANNER_ID = "unsaved-changes-banner";
export const MINIMIZE_BUTTON_ID = "minimize-lc";
export const UNMINIMIZE_BUTTON_ID = "unminimize-lc";
export const ADD_ITEM_ID = "add-item";
export const ADD_ITEM_MINIMIZED_ID = "add-item-minimized";
export const ADD_ITEM_HEADING_ID = "add-item-heading";
export const ADD_ITEM_IMAGE_ID = "add-item-image";
export const ADD_ITEM_PARAGRAPH_ID = "add-item-paragraph";
export const ADD_ITEM_CANCEL_BUTTON_ID = "add-item-cancel";
export const CURRENT_FAVICON_PREVIEW_FIGURE_ID = "favicon-preview";
export const CURRENT_FAVICON_PREVIEW_ID = "current-favicon-preview";
export const UPDATE_FAVICON_ID = "update-favicon";
export const CANCEL_FAVICON_UPDATE_ID = "cancel-favicon-update";
export const CONFIRM_FAVICON_UPDATE_ID = "confirm-favicon-update";
export const FAVICON_QUERY_SELECTOR = "link[rel~='icon']";
export const CURRENT_SOCIAL_IMAGE_ID = "og-image";
export const CURRENT_SOCIAL_IMAGE_ALT_ID = "og-image-alt";
export const CURRENT_TWITTER_IMAGE_ID = "twitter-image";
export const CURRENT_TWITTER_IMAGE_ALT_ID = "twitter-image-alt";
export const SOCIAL_IMAGE_PREVIEW_FIGURE_ID = "social-image-preview";
export const CURRENT_SOCIAL_IMAGE_PREVIEW_ID = "current-social-image-preview";
export const UPDATE_SOCIAL_IMAGE_ID = "update-social-image";
export const UPDATE_SOCIAL_IMAGE_ALT_ID = "update-social-image-alt";
export const UPDATE_BACKGROUND_COLOR_ID = "update-background-color";
export const UPDATE_TEXT_COLOR_ID = "update-text-color";
export const FULL_WIDTH_RADIO_ID = "update-width-toggle";
export const WIDTH_SLIDER_CONTAINER_ID = "update-body-width-container";
export const BODY_WIDTH_RANGE_INPUT_ID = "update-body-width-range";
export const BODY_WIDTH_NUMBER_INPUT_ID = "body-width-number-input";
export const WIDTH_SLIDER_DATALIST_ID = "body-width-tickmarks";
export const UPDATE_BODY_ALIGN_CONTAINER_ID = "update-body-align-container";
export const UPDATE_BODY_ALIGN_ID = "update-body-align";
const UPDATE_BODY_ALIGN_OPTION_NAME = "body-align";
export const BODY_WIDTH_OPTION_NAME = "body-width";
export const UPDATE_TEXT_ALIGN_ID = "update-text-align";
const UPDATE_TEXT_ALIGN_OPTION_NAME = "text-align";
export const UPDATE_TEXT_SIZE_ID = "update-text-size";
export const ALERT_LIST = "local-controls-alert-list";
export const ALERT_CLASS = "local-controls-alert";
export const ALERT_REMOVED_CLASS = "alert-removed";
export const CONTROLS_SECTION_CLASS = "controls-section";
export const COLOR_PICKER_CLASS = "color-picker";
export const SAVE_CHANGES_ID = "save-changes";
export const SAVE_CHANGES_MINIMIZED_ID = "save-changes-minimized";
export const CURRENTLY_EDITING_ID = "currently-editing";
export const CURRENTLY_EDITING_LINK_HANDLER_ID = "currently-editing-link";
export const CURRENTLY_EDITING_TOOLBAR_ID = "currently-editing-toolbar";
export const CURRENTLY_EDITING_FORMATTING_ID = "currently-editing-formatting";
export const CURRENTLY_EDITING_UPLOAD_ID = "currently-editing-upload";
export const CURRENTLY_EDITING_UPLOAD_IMAGE_INPUT_ID =
  "currently-editing-upload-image-input";
export const CURRENTLY_EDITING_ALT_TEXT_ID = "currently-editing-alt-text";
export const CURRENTLY_EDITING_ALT_TEXT_INPUT_ID =
  "currently-editing-alt-text-input";
export const DATA_ORIGINAL_TAG_NAME = "data-original-tag-name";
export const DATA_ORIGINAL_HTML = "data-original-html";
export const DATA_ORIGINAL_CSS = "data-original-css";
export const DATA_ORIGINAL_SRC = "data-original-src";
export const DATA_ORIGINAL_ALT = "data-original-alt";
export const EDIT_UI_CONTAINER_CLASS = "edit-ui-container";
export const EDITOR_SUB_CONTAINER_CLASS = "editor-sub-container";
export const EDIT_BUTTONS_CLASS = "edit-buttons";
export const INPUT_TYPE_TEXT_CLASS = "text-input";
export const INPUT_BELOW_LABEL_CLASS = "below-label";
export const PLACEHOLDER_CLASS = "placeholder";
export const IMAGE_PREVIEW_FIGURE_ID_PREFIX = "image-preview-figure-";
export const IMAGE_PREVIEW_ID_PREFIX = "image-preview-";
export const IMAGE_PREVIEW_CLASS = "image-preview";
export const HIDDEN_CLASS = "hidden";
export const END_OF_DOC_ID = "end-of-document";
export const LOCAL_CONTROLS_CONTAINER_ID = "local-controls-container";
export const LOCAL_CONTROLS_ID = "local-controls";
export const LOCAL_CONTROLS_MINIMIZED_ID = "local-controls-minimized";
export const NEW_CONTENT_MODAL_ID = "new-content-modal";
export const NEW_CONTENT_MODAL_WRAPPER_ID = "new-content-modal-wrapper";
export const NOTE_CLASS = "note";

export enum EditableType {
  TEXT = "text",
  IMAGE = "image",
}

export const EDITABLE_STYLE_PROPERTIES = {
  TEXT_ALIGN: "text-align",
  ALIGN_SELF: "align-self",
};

export const BODY_WIDTH_OPTIONS = {
  FULL: "FULL",
  FIXED: "FIXED",
};

export enum INPUT_TYPES {
  TEXT = "text",
  TEXTAREA = "textarea",
  COLOR = "color",
  CHECKBOX = "checkbox",
  FILE = "file",
  RADIO = "radio",
  RANGE = "range",
  NUMBER = "number",
}

export const SETTINGS = {
  BODY_WIDTH: String(500),
  // TODO restore to 800
  // BODY_WIDTH: String(800),
  BODY_WIDTHS: [200, 300, 400, 500, 640, 800, 1000, 1200, 1500, 1920].map((i) =>
    String(i),
  ),
};

export const OPTIONS = {
  LC_BODY_WIDTH_OPTIONS: [
    {
      id: "full-width",
      name: BODY_WIDTH_OPTION_NAME,
      value: BODY_WIDTH_OPTIONS.FULL,
      checked: false,
      labelText: BODY_WIDTH_LABELS.FULL,
    },
    {
      id: "fixed-width",
      name: BODY_WIDTH_OPTION_NAME,
      value: BODY_WIDTH_OPTIONS.FIXED,
      checked: true,
      labelText: BODY_WIDTH_LABELS.FIXED,
    },
  ],
  LC_BODY_ALIGNMENT_OPTIONS: [
    {
      id: "body-left",
      name: UPDATE_BODY_ALIGN_OPTION_NAME,
      value: "left",
      checked: true,
      labelText: ALIGNMENT_LABELS.LEFT,
      style: {
        margin: "2rem",
      },
    },
    {
      id: "body-center",
      name: UPDATE_BODY_ALIGN_OPTION_NAME,
      value: "center",
      checked: false,
      labelText: ALIGNMENT_LABELS.CENTER,
      style: {
        margin: "2rem auto",
      },
    },
  ],
  LC_UPDATE_TEXT_ALIGN_OPTIONS: [
    {
      id: "text-left",
      name: UPDATE_TEXT_ALIGN_OPTION_NAME,
      value: "LEFT",
      checked: true,
      labelText: ALIGNMENT_LABELS.LEFT,
    },
    {
      id: "text-center",
      name: UPDATE_TEXT_ALIGN_OPTION_NAME,
      value: "CENTER",
      checked: false,
      labelText: ALIGNMENT_LABELS.CENTER,
    },
    {
      id: "text-right",
      name: UPDATE_TEXT_ALIGN_OPTION_NAME,
      value: "RIGHT",
      checked: false,
      labelText: ALIGNMENT_LABELS.RIGHT,
    },
  ],
};

export const FlexAlignCssKeys: {
  [key: string]: AlignOptions;
} = {
  "flex-start": AlignOptions.LEFT,
  center: AlignOptions.CENTER,
  "flex-end": AlignOptions.RIGHT,
  default: AlignOptions.DEFAULT,
};

export const TextAlignCssKeys: {
  [key: string]: AlignOptions;
} = {
  left: AlignOptions.LEFT,
  center: AlignOptions.CENTER,
  right: AlignOptions.RIGHT,
  auto: AlignOptions.DEFAULT,
};

export const ALERT_ANIMATION_DELAY = 250;
