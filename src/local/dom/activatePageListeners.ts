import {
  FULL_WIDTH_RADIO_ID,
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
  UPDATE_SOCIAL_IMAGE_ALT_ID,
  SAVE_CHANGES_MINIMIZED_ID,
  ADD_ITEM_ID,
  ADD_ITEM_MINIMIZED_ID,
  MINIMIZE_BUTTON_ID,
  UNMINIMIZE_BUTTON_ID,
} from "../util/constants";
import {
  CSSProperties,
  EventType,
  HtmlProperty,
  MetaElementProperty,
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
import { handleUpdateBodyWidthType } from "./events/handleUpdateBodyWidthType";
import {
  handleUpdateSocialImageAlt,
  handleUpdateSocialImageSrc,
} from "./events/handleUpdateSocialImage";
import { handleUpdateBodyWidth } from "./events/handleUpdateBodyWidth";
import { onClickNewContentButton } from "./events/onClickNewContentButton";
import { handleMinimize } from "./events/handleMinimize";

export function activatePageListeners() {
  const listeners: {
    id: string;
    eventHandler: (event: Event) => void;
    type?: EventType;
  }[] = [
    {
      id: MINIMIZE_BUTTON_ID,
      eventHandler: handleMinimize,
      type: EventType.CLICK,
    },
    {
      id: UNMINIMIZE_BUTTON_ID,
      eventHandler: handleMinimize,
      type: EventType.CLICK,
    },
    {
      id: ADD_ITEM_ID,
      eventHandler: onClickNewContentButton,
      type: EventType.CLICK,
    },
    {
      id: ADD_ITEM_MINIMIZED_ID,
      eventHandler: onClickNewContentButton,
      type: EventType.CLICK,
    },
    {
      id: UPDATE_BACKGROUND_COLOR_ID,
      eventHandler: getHandleGlobalStyleChange(CSSProperties.BACKGROUND_COLOR),
    },
    {
      id: UPDATE_TEXT_COLOR_ID,
      eventHandler: getHandleGlobalStyleChange(CSSProperties.COLOR),
    },
    {
      id: FULL_WIDTH_RADIO_ID,
      eventHandler: handleUpdateBodyWidthType,
    },
    {
      id: BODY_WIDTH_NUMBER_INPUT_ID,
      eventHandler: handleUpdateBodyWidth,
      type: EventType.INPUT,
    },
    {
      id: BODY_WIDTH_RANGE_INPUT_ID,
      eventHandler: handleUpdateBodyWidth,
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
      eventHandler: handleUpdateSocialImageSrc,
      type: EventType.INPUT,
    },
    {
      id: UPDATE_SOCIAL_IMAGE_ALT_ID,
      eventHandler: handleUpdateSocialImageAlt,
      type: EventType.INPUT,
    },
    {
      id: SAVE_CHANGES_ID,
      eventHandler: handleSaveChanges,
      type: EventType.CLICK,
    },
    {
      id: SAVE_CHANGES_MINIMIZED_ID,
      eventHandler: handleSaveChanges,
      type: EventType.CLICK,
    },
  ];

  listeners.forEach((i) => addListenerById(i.id, i.eventHandler, i?.type));

  addListenerToTitleEditor(
    PAGE_TITLE_INPUT_ID,
    PAGE_TITLE_ID,
    TitleProperty.INNER_HTML,
    [
      { id: PAGE_OG_TITLE_ID, property: MetaElementProperty.CONTENT },
      { id: PAGE_TWITTER_TITLE_ID, property: MetaElementProperty.CONTENT },
    ],
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
