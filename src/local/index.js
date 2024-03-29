import {
  onUpdateBodyAlign,
  onUpdateBodyTextAlign,
  onUpdateBodyTextSize,
} from "./dom/align";
import {
  onClickSaveChanges,
  getHandleStyleChange,
  onUpdateFaviconPicker,
  onUpdateFullWidth,
  onUpdateSocialImage,
  onUpdateWidth,
} from "./dom/events/handlers";
import {
  addListenerById,
  addListenerToMetaDataEditor,
  imageEventListener,
  textEventListener,
} from "./dom/events/listeners";
import { enableLocalControls } from "./enable";
import {
  HEADING_ELEMENTS,
  PARAGRAPH_ELEMENT,
  IMG_ELEMENT,
  UPDATE_BACKGROUND_COLOR_ID,
  UPDATE_TEXT_COLOR_ID,
  FULL_WIDTH_CHECKBOX_ID,
  WIDTH_SLIDER_ID,
  UPDATE_BODY_ALIGN_ID,
  UPDATE_TEXT_ALIGN_ID,
  UPDATE_FAVICON_ID,
  UPDATE_SOCIAL_IMAGE_ID,
  UPDATE_TEXT_SIZE_ID,
  PAGE_TITLE_INPUT_ID,
  PAGE_DESC_INPUT_ID,
  PAGE_LANG_INPUT_ID,
  SAVE_CHANGES_ID,
} from "./constants";

/* JavaScript enabling editing only runs locally */
export function localEditingMode() {
  [
    ...document.querySelectorAll(HEADING_ELEMENTS.join(", ")),
    ...document.querySelectorAll(PARAGRAPH_ELEMENT),
  ].forEach((element) => element.addEventListener("click", textEventListener));

  document
    .querySelectorAll(IMG_ELEMENT)
    .forEach((element) =>
      element.addEventListener("click", imageEventListener)
    );

  enableLocalControls();

  /* Activate Controls on Controls Elements */
  addListenerById(
    UPDATE_BACKGROUND_COLOR_ID,
    getHandleStyleChange("backgroundColor")
  );
  addListenerById(UPDATE_TEXT_COLOR_ID, getHandleStyleChange("color"));
  addListenerById(FULL_WIDTH_CHECKBOX_ID, onUpdateFullWidth);
  addListenerById(WIDTH_SLIDER_ID, onUpdateWidth, "input");
  addListenerById(UPDATE_BODY_ALIGN_ID, onUpdateBodyAlign);
  addListenerById(UPDATE_TEXT_ALIGN_ID, onUpdateBodyTextAlign);
  addListenerById(UPDATE_TEXT_SIZE_ID, onUpdateBodyTextSize);
  addListenerById(UPDATE_FAVICON_ID, onUpdateFaviconPicker);
  addListenerById(UPDATE_SOCIAL_IMAGE_ID, onUpdateSocialImage, "input");

  addListenerToMetaDataEditor(
    PAGE_TITLE_INPUT_ID,
    "page-title",
    ["meta-title", "twitter-title"],
    "innerHTML"
  );

  addListenerToMetaDataEditor(PAGE_DESC_INPUT_ID, "page-description", [
    "meta-description",
    "twitter-description",
  ]);

  addListenerToMetaDataEditor(PAGE_LANG_INPUT_ID, "html-element", [], "lang");

  /* Save Changes */

  addListenerById(SAVE_CHANGES_ID, onClickSaveChanges, "click");
}
