import {
  FULL_WIDTH_CHECKBOX_ID,
  HTML_ELEMENT_ID,
  PAGE_DESC_ID,
  PAGE_DESC_INPUT_ID,
  PAGE_LANG_INPUT_ID,
  PAGE_OG_DESC_ID,
  PAGE_OG_TITLE_ID,
  PAGE_TITLE_ID,
  PAGE_TITLE_INPUT_ID,
  PAGE_TWITTER_DESC_ID,
  PAGE_TWITTER_TITLE_ID,
  SAVE_CHANGES_ID,
  UPDATE_BACKGROUND_COLOR_ID,
  UPDATE_BODY_ALIGN_ID,
  UPDATE_FAVICON_ID,
  UPDATE_SOCIAL_IMAGE_ID,
  UPDATE_TEXT_ALIGN_ID,
  UPDATE_TEXT_COLOR_ID,
  UPDATE_TEXT_SIZE_ID,
  BODY_WIDTH_RANGE_INPUT_ID,
  BODY_WIDTH_NUMBER_INPUT_ID,
} from "../util/constants";
import {
  CSSProperties,
  EventType,
  HtmlProperty,
  MetaProperty,
  TitleProperty,
} from "../types";
import { addListenerById } from "./events/addListenerById";
import { addListenerToHtmlElementEditor } from "./events/addListenerToHtmlElementEditor";
import { addListenerToMetaEditor } from "./events/addListenerToMetaEditor";
import { addListenerToTitleEditor } from "./events/addListenerToTitleEditor";
import { getHandleGlobalStyleChange } from "./events/getHandleStyleChange";
import { handleSaveChanges } from "./events/handleSaveChanges";
import { handleUpdateBodyAlignment } from "./events/handleUpdateBodyAlignment";
import { handleUpdateBodyTextAlign } from "./events/handleUpdateBodyTextAlign";
import { handleUpdateBodyTextSize } from "./events/handleUpdateBodyTextSize";
import { handleUpdateFavicon } from "./events/handleUpdateFavicon";
import { handleUpdateFullWidth } from "./events/handleUpdateFullWidth";
import { handleUpdateSocialImage } from "./events/handleUpdateSocialImage";
import { handleUpdateWidth } from "./events/handleUpdateWidth";

export function activatePageListeners() {
  const listeners = [
    {
      id: UPDATE_BACKGROUND_COLOR_ID,
      eventHandler: getHandleGlobalStyleChange(CSSProperties.BACKGROUND_COLOR),
    },
    {
      id: UPDATE_TEXT_COLOR_ID,
      eventHandler: getHandleGlobalStyleChange(CSSProperties.COLOR),
    },
    {
      id: FULL_WIDTH_CHECKBOX_ID,
      eventHandler: handleUpdateFullWidth,
    },
    {
      id: BODY_WIDTH_NUMBER_INPUT_ID,
      eventHandler: handleUpdateWidth,
      type: EventType.INPUT,
    },
    {
      id: BODY_WIDTH_RANGE_INPUT_ID,
      eventHandler: handleUpdateWidth,
      type: EventType.INPUT,
    },
    {
      id: UPDATE_BODY_ALIGN_ID,
      eventHandler: handleUpdateBodyAlignment,
    },
    {
      id: UPDATE_TEXT_ALIGN_ID,
      eventHandler: handleUpdateBodyTextAlign,
    },
    {
      id: UPDATE_TEXT_SIZE_ID,
      eventHandler: handleUpdateBodyTextSize,
    },
    {
      id: UPDATE_FAVICON_ID,
      eventHandler: handleUpdateFavicon,
    },
    {
      id: UPDATE_SOCIAL_IMAGE_ID,
      eventHandler: handleUpdateSocialImage,
      type: EventType.INPUT,
    },
    {
      id: SAVE_CHANGES_ID,
      eventHandler: handleSaveChanges,
      type: EventType.CLICK,
    },
  ];

  listeners.forEach((i) => addListenerById(i.id, i.eventHandler, i?.type));

  addListenerToTitleEditor(
    PAGE_TITLE_INPUT_ID,
    PAGE_TITLE_ID,
    TitleProperty.INNER_HTML,
    [PAGE_OG_TITLE_ID, PAGE_TWITTER_TITLE_ID],
  );

  addListenerToMetaEditor(
    PAGE_DESC_INPUT_ID,
    PAGE_DESC_ID,
    MetaProperty.CONTENT,
    [PAGE_TWITTER_DESC_ID, PAGE_OG_DESC_ID],
  );

  addListenerToHtmlElementEditor(
    PAGE_LANG_INPUT_ID,
    HTML_ELEMENT_ID,
    HtmlProperty.LANG,
  );
}
