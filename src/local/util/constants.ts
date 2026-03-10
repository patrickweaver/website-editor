import { ALIGNMENT_LABELS } from "./strings";

export const HTML_ELEMENT_ID = "html-element";
export const PAGE_TITLE_INPUT_ID = "edit-page-title";
export const PAGE_TITLE_ID = "page-title";
export const PAGE_OG_TITLE_ID = "og-title";
export const PAGE_TWITTER_TITLE_ID = "twitter-title";
export const PAGE_DESC_INPUT_ID = "edit-page-description";
export const PAGE_DESC_ID = "page-description";
export const PAGE_TWITTER_DESC_ID = "twitter-description";
export const PAGE_OG_DESC_ID = "og-description";
export const PAGE_OG_IMAGE_ID = "og-image";
export const PAGE_OG_IMAGE_ALT_ID = "og-image-alt";
export const PAGE_LANG_INPUT_ID = "edit-page-language";
export const ADD_ITEM_ID = "add-item";
export const ADD_ITEM_HEADING_ID = "add-item-heading";
export const ADD_ITEM_IMAGE_ID = "add-item-image";
export const ADD_ITEM_PARAGRAPH_ID = "add-item-paragraph";
export const ADD_ITEM_CANCEL_BUTTON_ID = "add-item-cancel";
export const CURRENT_FAVICON_FIGURE_ID = "favicon-preview";
export const CURRENT_FAVICON_PREVIEW_ID = "current-favicon-preview";
export const UPDATE_FAVICON_ID = "update-favicon";
export const CANCEL_FAVICON_UPDATE_ID = "cancel-favicon-update";
export const CONFIRM_FAVICON_UPDATE_ID = "confirm-favicon-update";
export const FAVICON_QUERY_SELECTOR = "link[rel~='icon']";
export const CURRENT_SOCIAL_IMAGE_ID = "meta-image";
export const CURRENT_SOCIAL_IMAGE_ALT_ID = "meta-image-alt";
export const CURRENT_TWITTER_IMAGE_ID = "twitter-image";
export const CURRENT_SOCIAL_IMAGE_PREVIEW_ID = "current-social-image-preview";
export const UPDATE_SOCIAL_IMAGE_ID = "update-social-image";
export const UPDATE_BACKGROUND_COLOR_ID = "update-background-color";
export const UPDATE_TEXT_COLOR_ID = "update-text-color";
export const FULL_WIDTH_CHECKBOX_ID = "update-full-width";
export const WIDTH_SLIDER_CONTAINER_ID = "update-body-width-container";
export const WIDTH_SLIDER_ID = "update-body-width";
export const WIDTH_SLIDER_VALUE_ID = "update-body-width-value";
export const WIDTH_SLIDER_DATALIST_ID = "body-width-tickmarks";
export const UPDATE_BODY_ALIGN_CONTAINER_ID = "update-body-align-container";
export const UPDATE_BODY_ALIGN_ID = "update-body-align";
export const UPDATE_BODY_ALIGN_OPTION_NAME = "body-align";
export const UPDATE_TEXT_ALIGN_ID = "update-text-align";
export const UPDATE_TEXT_ALIGN_OPTION_NAME = "text-align";
export const UPDATE_TEXT_SIZE_ID = "update-text-size";
export const ALERT_LIST = "local-controls-alert-list";
export const ALERT_CLASS = "local-controls-alert";
export const ALERT_REMOVED_CLASS = "alert-removed";
export const CONTROLS_SECTION_CLASS = "controls-section";
export const COLOR_PICKER_CLASS = "color-picker";
export const SAVE_CHANGES_ID = "save-changes";
export const SOCIAL_IMAGE_FIGURE_ID = "social-image-preview";
export const CLONE_CLASS = "clone";
export const CLONE_CONTAINER_CLASS = "clone-container";
export const EDIT_CLASS = "edit";
export const EDIT_CONTAINER_CLASS = "edit-container";
export const EDIT_BUTTONS_CLASS = "edit-buttons";
export const INPUT_TYPE_TEXT_CLASS = "text-input";
export const INPUT_TYPE_TEXTAREA_CLASS = "text-textarea";
export const INPUT_BELOW_LABEL_CLASS = "below-label";
export const TEXT_EDITOR_ID_READABLE_STRING = "text-editor";
export const IMAGE_PICKER_ID_READABLE_STRING = "image-picker";
export const IMAGE_PREVIEW_FIGURE_ID_PREFIX = "image-preview-figure-";
export const IMAGE_PREVIEW_ID_PREFIX = "image-preview-";
export const IMAGE_PREVIEW_CLASS = "image-preview";
export const HIDDEN_CLASS = "hidden";
export const END_OF_DOC_ID = "end-of-document";
export const LOCAL_CONTROLS_CONTAINER_ID = "local-controls-container";
export const LOCAL_CONTROLS_ID = "local-controls";
export const NEW_CONTENT_MODAL_ID = "new-content-modal";
export const NEW_CONTENT_MODAL_WRAPPER_ID = "new-content-modal-wrapper";
export const NOTE_CLASS = "note";

export const EDITOR_TYPES = {
  TEXT: "text",
  HEADING: "heading",
  HEADING_LEVEL: "heading-level",
  ALIGN: "align",
  PARAGRAPH: "paragraph",
  IMAGE: "image",
  IMAGE_ALT_TEXT: "image-alt",
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
  BODY_WIDTH: String(800),
  BODY_WIDTHS: [200, 300, 400, 500, 640, 800, 1000, 1200, 1500, 1920].map((i) =>
    String(i),
  ),
};

export const OPTIONS = {
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

export const ALERT_ANIMATION_DELAY = 250;
