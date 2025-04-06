import {
  END_OF_DOC_ID,
  FULL_WIDTH_CHECKBOX_ID,
  HEADING_ELEMENTS,
  HTML_ELEMENT_ID,
  IMG_ELEMENT,
  PAGE_DESC_ID,
  PAGE_DESC_INPUT_ID,
  PAGE_LANG_INPUT_ID,
  PAGE_OG_DESC_ID,
  PAGE_OG_TITLE_ID,
  PAGE_TITLE_ID,
  PAGE_TITLE_INPUT_ID,
  PAGE_TWITTER_DESC_ID,
  PAGE_TWITTER_TITLE_ID,
  PARAGRAPH_ELEMENT,
  SAVE_CHANGES_ID,
  UPDATE_BACKGROUND_COLOR_ID,
  UPDATE_BODY_ALIGN_ID,
  UPDATE_FAVICON_ID,
  UPDATE_SOCIAL_IMAGE_ID,
  UPDATE_TEXT_ALIGN_ID,
  UPDATE_TEXT_COLOR_ID,
  UPDATE_TEXT_SIZE_ID,
  WIDTH_SLIDER_ID,
} from "./constants";
import { enableLocalControls } from "./dom/enableLocalControls";
import { addListenerById } from "./dom/events/addListenerById";
import { addListenerToHtmlElementEditor } from "./dom/events/addListenerToHtmlElementEditor";
import { addListenerToMetaEditor } from "./dom/events/addListenerToMetaEditor";
import { addListenerToTitleEditor } from "./dom/events/addListenerToTitleEditor";
import { getHandleGlobalStyleChange } from "./dom/events/getHandleStyleChange";
import { handleSaveChanges } from "./dom/events/handleSaveChanges";
import { handleUpdateBodyAlignment } from "./dom/events/handleUpdateBodyAlignment";
import { handleUpdateBodyTextAlign } from "./dom/events/handleUpdateBodyTextAlign";
import { handleUpdateBodyTextSize } from "./dom/events/handleUpdateBodyTextSize";
import { handleUpdateFavicon } from "./dom/events/handleUpdateFavicon";
import { handleUpdateFullWidth } from "./dom/events/handleUpdateFullWidth";
import { handleUpdateSocialImage } from "./dom/events/handleUpdateSocialImage";
import { handleUpdateWidth } from "./dom/events/handleUpdateWidth";
import { imageEventListener } from "./dom/events/imageEventListener";
import { textEventListener } from "./dom/events/textEventListener";
import { _ElementTag, createElement } from "./dom/util/createElement";
import { insertElementToDOM } from "./dom/util/insertElementToDOM";
import {
  CSSProperties,
  EventType,
  HtmlProperty,
  InsertPosition,
  MetaProperty,
  TitleProperty,
} from "./types";

/* JavaScript enabling editing only runs locally */
export function localEditingMode() {
  console.log("Local editing mode enabled");
  const textElements = [...HEADING_ELEMENTS, PARAGRAPH_ELEMENT];
  document
    .querySelectorAll(textElements.join(", "))
    .forEach((element) => element.addEventListener("click", textEventListener));

  document
    .querySelectorAll(IMG_ELEMENT)
    .forEach((element) =>
      element.addEventListener("click", imageEventListener),
    );

  const testElement = createElement({
    tag: _ElementTag.P,
    innerHTML: "Test Element",
  });

  const testImage = createElement({
    tag: _ElementTag.IMG,
    imageSrc: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAIAA
AC0Ujn1AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAA
DsMAAA7DAcdvqGQAAAEDSURBVEhLtZJBEoMwDAP7lr6nn+0LqUGChsVOwoG
dvTSSNRz6Wh7jxvT7+wn9Y4LZae0e+rXLeBqjh45rBtOYgy4V9KYxlOpqRj
mNiY4+uJBP41gOI5BM40w620AknTVwGgfSWQMK0tnOaRpV6ewCatLZxn8aJ
emsAGXp7JhGLBX1wYlUtE4jkIpnwKGM9xeepG7mwblMpl2/CUbCJ7+6CnQz
Aw5lvD/8DxGIpbMClKWzdjpASTq7gJp0tnGaDlCVzhpQkM52OB3gQDrbQCS
dNSTTAc7kMAL5dIDjjj64UE4HmEh1NaM3HWAIulQwmA4wd+i4ZjwdYDR00G
qWsyPrizLD76QCPOHqP2cAAAAAElFTkSuQmCC`,
    altText: "An example image",
  });

  insertElementToDOM(END_OF_DOC_ID, testElement, InsertPosition.AFTER_END);
  insertElementToDOM(END_OF_DOC_ID, testImage, InsertPosition.AFTER_END);

  enableLocalControls();

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
      id: WIDTH_SLIDER_ID,
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
