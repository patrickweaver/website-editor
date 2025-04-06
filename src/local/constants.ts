import { HeaderTag } from "./dom/util/createElement";

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
export const ALERT_REMOVED = "alert-removed";
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
export const BUTTON_ELEMENT = "button";
export const DATALIST_ELEMENT = "datalist";
export const HEADING_ELEMENTS: Array<HeaderTag> = [
  HeaderTag.H1,
  HeaderTag.H1,
  HeaderTag.H2,
  HeaderTag.H3,
  HeaderTag.H4,
  HeaderTag.H5,
  HeaderTag.H6,
];
export const FIELDSET_ELEMENT = "fieldset";
export const FIGCAPTION_ELEMENT = "figcaption";
export const FIGURE_ELEMENT = "figure";
export const INPUT_ELEMENT = "input";
export const LABEL_ELEMENT = "label";
export const LEGEND_ELEMENT = "legend";
export const OPTION_ELEMENT = "option";
export const PARAGRAPH_ELEMENT = "p";
export const IMG_ELEMENT = "img";
export const LIST_ELEMENTS = { UNORDERED: "ul", ORDERED: "ol" };
export const LIST_ITEM_ELEMENT = "li";
export const HOZ_RULE_ELEMENT = "hr";
export const SPAN_ELEMENT = "span";
export const TEXTAREA_ELEMENT = "textarea";

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

export const STRINGS = {
  ALIGNMENT_LABELS: {
    LEFT: "Left",
    CENTER: "Center",
    RIGHT: "Right",
  },
  BUTTON_CANCEL: "Cancel",
  BUTTON_DELETE: "Delete",
  BUTTON_LINK: "Make Link From Selection",
  BUTTON_ADD_HEADING: "Heading",
  BUTTON_ADD_PARAGRAPH: "Paragraph",
  BUTTON_ADD_IMAGE: "Image",
  BUTTON_SAVE: "Save",
  BUTTON_UPDATE: "Update",
  CLONE_LABEL: "Original Element",
  CONFIRM_DELETE: "Are you sure you want to delete this element?",
  ERROR_IMAGE_ONLY: "Error: Please choose an image file",
  ERROR_NO_IMAGE: "Error: No image found",
  ERROR_NO_SELECTION: "Error: Nothing selected",
  EDITOR_LABELS: {
    [EDITOR_TYPES.PARAGRAPH]: "Edit paragraph text",
    [EDITOR_TYPES.HEADING]: "Edit heading text",
    [EDITOR_TYPES.HEADING_LEVEL]: "Edit heading level",
    [EDITOR_TYPES.IMAGE]: "Select an image",
    [EDITOR_TYPES.IMAGE_ALT_TEXT]: "Image alt text",
    [EDITOR_TYPES.ALIGN]: "Edit alignment",
  },
  FAVICON_PREVIEW_CAPTION: "New favicon preview:",
  IMAGE_PREVIEW_CAPTION: "Image preview:",
  LC_BG_COLOR_SUBHEADER: "Background Color",
  LC_TEXT_COLOR_SUBHEADER: "Text Color",
  LC_COLOR_LABEL: "Select a color",
  LC_BODY_ALIGNMENT_LEGEND:
    "Select an option for aligning the body of the page on the window",
  LC_BODY_ALIGNMENT_RIGHT_MESSAGE: "Right aligned body is not supported.",
  LC_BODY_ALIGNMENT_SUBHEADER: "Body Alignment",
  LC_BODY_WIDTH_SUBHEADER: "Body Width",
  LC_BODY_WIDTH_FIXED_LABEL: "Fixed Body Width: ",
  LC_BODY_WIDTH_FULL_LABEL: "Use Full Window Width",
  LC_CONTENT_SUBHEADER: "Add Content",
  LC_CONTENT_BUTTON: "Add Item",
  LC_CURRENT_FAVICON_CAPTION: "Current Favicon:",
  LC_CURRENT_FAVICON_ALT_TEXT: "The current favicon",
  LC_FAVICON_SUBHEADER: "Favicon",
  LC_GENERAL_PAGE_DESC_LABEL: "Page Description",
  LC_GENERAL_PAGE_LANG_LABEL: "Page Language",
  LC_GENERAL_PAGE_LANG_BELOW_LABEL: `See list of valid language tags <a href="https://en.wikipedia.org/wiki/IETF_language_tag#List_of_subtags" target="_blank">here</a>.`,
  LC_GENERAL_PAGE_TITLE_LABEL: "Page Title",
  LC_GENERAL_SUBHEADER: "General",
  LC_HEADER: "Local Controls",
  LC_INSTRUCTIONS:
    "This section of the page will only display when viewing the local version of your website by opening the <code>index.html</code> file on a computer.",
  LC_METADATA_SUBHEADER: "Metadata",
  LC_SAVE_CHANGES_BUTTON_LABEL: "Save All Changes to Local File",
  LC_SAVE_CHANGES_SUBHEADER: "Save Changes",
  LC_SOCIAL_IMAGE_INPUT_BELOW_LABEL:
    "Social Image must be a full URL including the domain name and cannot be included inline as a data URL like other images. You will likely need to upload the image to your web host, then update your page again with the hosted image URL. The social image is configured for a square image at least 144px x 144px large.",
  LC_SOCIAL_IMAGE_INPUT_LABEL: "Update Social Image",
  LC_SOCIAL_IMAGE_LABEL: "Current Social Image:",
  LC_SOCIAL_IMAGE_SUBHEADER: "Social Image",
  LC_STYLES_SUBHEADER: "Styles",
  LC_TEXT_ALIGNMENT_LEGEND:
    "Select an option for aligning the text within the body",
  LC_TEXT_ALIGNMENT_SUBHEADER: "Text Alignment",
  LC_TEXT_SIZE_LABEL: "Font Size (%)",
  LC_TEXT_STYLE_SUBHEADER: "Text Style",
  LC_UPDATE_FAVICON_LABEL: "Update Favicon",
  PLACEHOLDER_TEXT: "Your text here",
  PROMPT_LINK_URL: "URL:",
  MISSING_SOCIAL_IMAGE_ALT: "Social Image is not set.",
  NEW_CONTENT_HEADER: "Add New Content",
};

export const OPTIONS = {
  LC_BODY_ALIGNMENT_OPTIONS: [
    {
      id: "body-left",
      name: UPDATE_BODY_ALIGN_OPTION_NAME,
      value: "left",
      checked: true,
      labelText: STRINGS.ALIGNMENT_LABELS.LEFT,
      style: {
        margin: "2rem",
      },
    },
    {
      id: "body-center",
      name: UPDATE_BODY_ALIGN_OPTION_NAME,
      value: "center",
      checked: false,
      labelText: STRINGS.ALIGNMENT_LABELS.CENTER,
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
      labelText: STRINGS.ALIGNMENT_LABELS.LEFT,
    },
    {
      id: "text-center",
      name: UPDATE_TEXT_ALIGN_OPTION_NAME,
      value: "CENTER",
      checked: false,
      labelText: STRINGS.ALIGNMENT_LABELS.CENTER,
    },
    {
      id: "text-right",
      name: UPDATE_TEXT_ALIGN_OPTION_NAME,
      value: "RIGHT",
      checked: false,
      labelText: STRINGS.ALIGNMENT_LABELS.RIGHT,
    },
  ],
};

export const ALERT_ANIMATION_DELAY = 250;
