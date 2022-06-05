export const PAGE_TITLE_INPUT_ID = "edit-page-title";
export const PAGE_DESC_INPUT_ID = "edit-page-description";
export const PAGE_LANG_INPUT_ID = "edit-page-language";
export const ADD_ITEM_ID = "add-item";
export const ADD_ITEM_ID_PREFIX = "add-item-";
export const ADD_ITEM_HEADING_ID = `${ADD_ITEM_ID_PREFIX}heading`;
export const ADD_ITEM_IMAGE_ID = `${ADD_ITEM_ID_PREFIX}image`;
export const ADD_ITEM_PARAGRAPH_ID = `${ADD_ITEM_ID_PREFIX}paragraph`;
export const ADD_ITEM_CANCEL_ID = `${ADD_ITEM_ID_PREFIX}cancel`;
export const CURRENT_FAVICON_PREVIEW_ID = "current-favicon-preview";
export const UPDATE_FAVICON_ID = "update-favicon";
export const CANCEL_FAVICON_UPDATE_ID = "cancel-favicon-update";
export const CONFIRM_FAVICON_UPDATE_ID = "confirm-favicon-update";
export const FAVICON_QUERY_SELECTOR = "link[rel~='icon']";
export const CURRENT_SOCIAL_IMAGE_ID = "meta-image";
export const CURRENT_TWITTER_IMAGE_ID = "twitter-image";
export const CURRENT_SOCIAL_IMAGE_PREVIEW_ID = "current-social-image-preview";
export const UPDATE_SOCIAL_IMAGE_ID = "update-social-image";
export const UPDATE_BACKGROUND_COLOR_ID = "update-background-color";
export const FULL_WIDTH_CHECKBOX_ID = "update-full-width";
export const WIDTH_SLIDER_CONTAINER_ID = "update-body-width-container";
export const WIDTH_SLIDER_ID = "update-body-width";
export const WIDTH_SLIDER_VALUE_ID = "update-body-width-value";
export const UPDATE_BODY_ALIGN_CONTAINER = "udpate-body-align-container";
export const UPDATE_BODY_ALIGN_ID = "update-body-align";
export const UPDATE_TEXT_ALIGN_ID = "update-text-align";
export const COLOR_PICKER_CLASS = "color-picker";
export const SAVE_CHANGES_ID = "save-changes";
export const CLONE_LABEL = "Original Element";
export const CLONE_CLASS = "clone";
export const CLONE_CONTAINER_CLASS = "clone-container";
export const EDIT_CLASS = "edit";
export const EDIT_CONTAINER_CLASS = "edit-container";
export const EDIT_BUTTONS_CLASS = "edit-buttons";
export const TEXT_EDITOR_ID_READABLE_STRING = "text-editor";
export const IMAGE_PICKER_ID_READABLE_STRING = "image-picker";
export const END_OF_DOC_ID = "end-of-document";
export const LOCAL_CONTROLS_CONTAINER_ID = "local-controls-container";
export const LOCAL_CONTROLS_ID = "local-controls";
export const NEW_CONTENT_MODAL_ID = "new-content-modal";
export const NEW_CONTENT_MODAL_WRAPPER = "new-content-modal-wrapper";
export const HEADING_ELEMENTS = ["h1", "h2", "h3", "h4", "h5", "h6"];
export const PARAGRAPH_ELEMENT = "p";
export const IMG_ELEMENT = "img";

export const EDITOR_TYPES = {
  TEXT: "text",
  HEADING: "heading",
  HEADING_LEVEL: "heading-level",
  ALIGN: "align",
  PARAGRAPH: "paragraph",
  IMAGE: "image",
  IMAGE_ALT_TEXT: "image-alt",
};

export const STRINGS = {
  BUTTON_CANCEL: "Cancel",
  BUTTON_DELETE: "Delete",
  BUTTON_LINK: "Make Link From Selection",
  BUTTON_SAVE: "Save",
  BUTTON_UPDATE: "Update",
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
  PLACEHOLDER_TEXT: "Your text here",
  PROMPT_LINK_URL: "URL:",
  MISSING_SOCIAL_IMAGE_ALT: "&nbsp;Social Image is not set.",
};
