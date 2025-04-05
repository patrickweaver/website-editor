import {
  ADD_ITEM_ID,
  ALERT_LIST,
  CANCEL_FAVICON_UPDATE_ID,
  COLOR_PICKER_CLASS,
  CONFIRM_FAVICON_UPDATE_ID,
  CURRENT_FAVICON_FIGURE_ID,
  CURRENT_FAVICON_PREVIEW_ID,
  CURRENT_SOCIAL_IMAGE_PREVIEW_ID,
  EDIT_BUTTONS_CLASS,
  FULL_WIDTH_CHECKBOX_ID,
  INPUT_BELOW_LABEL_CLASS,
  INPUT_TYPES,
  LOCAL_CONTROLS_ID,
  NOTE_CLASS,
  PAGE_DESC_INPUT_ID,
  PAGE_LANG_INPUT_ID,
  PAGE_TITLE_INPUT_ID,
  SAVE_CHANGES_ID,
  SETTINGS,
  SOCIAL_IMAGE_FIGURE_ID,
  STRINGS,
  UPDATE_BACKGROUND_COLOR_ID,
  UPDATE_BODY_ALIGN_CONTAINER_ID,
  UPDATE_BODY_ALIGN_ID,
  UPDATE_BODY_ALIGN_OPTION_NAME,
  UPDATE_FAVICON_ID,
  UPDATE_SOCIAL_IMAGE_ID,
  UPDATE_TEXT_ALIGN_ID,
  UPDATE_TEXT_ALIGN_OPTION_NAME,
  UPDATE_TEXT_COLOR_ID,
  UPDATE_TEXT_SIZE_ID,
  WIDTH_SLIDER_CONTAINER_ID,
  WIDTH_SLIDER_DATALIST_ID,
  WIDTH_SLIDER_ID,
  WIDTH_SLIDER_VALUE_ID,
} from "../constants";
import { CSSProperties, IMAGE_PREVIEW } from "../types";
import { addControlsInput } from "./controls/addControlsInput";
import { addControlsSection } from "./controls/addControlsSection";
import { _ElementTag, createElement, HeaderTag } from "./util/createElement";
import { getCurrentStyle } from "./util/getCurrentStyle";
import { insertElementWithinElement } from "./util/insertElementWithinElement";
import { addControlsAlignmentInput } from "./controls/addControlsAlignmentInput";
import { makeImagePreview } from "./util/makeImagePreview";
import { getFigureWithCaption } from "./util/getFigureWithCaption";
import { getCurrentFaviconURL } from "./util/getCurrentFaviconUrl";
import { getCurrentSocialImage } from "./util/getCurrentSocialImage";

const {
  ALIGNMENT_LABELS,
  BUTTON_CANCEL,
  BUTTON_UPDATE,
  LC_BG_COLOR_SUBHEADER,
  LC_TEXT_COLOR_SUBHEADER,
  LC_COLOR_LABEL,
  LC_BODY_ALIGNMENT_LEGEND,
  LC_BODY_ALIGNMENT_RIGHT_MESSAGE,
  LC_BODY_ALIGNMENT_SUBHEADER,
  LC_BODY_WIDTH_SUBHEADER,
  LC_BODY_WIDTH_FIXED_LABEL,
  LC_BODY_WIDTH_FULL_LABEL,
  LC_TEXT_ALIGNMENT_LEGEND,
  LC_TEXT_ALIGNMENT_SUBHEADER,
  LC_TEXT_STYLE_SUBHEADER,
  LC_CONTENT_SUBHEADER,
  LC_CONTENT_BUTTON,
  LC_CURRENT_FAVICON_CAPTION,
  LC_CURRENT_FAVICON_ALT_TEXT,
  LC_FAVICON_SUBHEADER,
  LC_GENERAL_PAGE_DESC_LABEL,
  LC_GENERAL_PAGE_LANG_LABEL,
  LC_GENERAL_PAGE_LANG_BELOW_LABEL,
  LC_GENERAL_PAGE_TITLE_LABEL,
  LC_GENERAL_SUBHEADER,
  LC_HEADER,
  LC_INSTRUCTIONS,
  LC_METADATA_SUBHEADER,
  LC_SAVE_CHANGES_BUTTON_LABEL,
  LC_SAVE_CHANGES_SUBHEADER,
  LC_SOCIAL_IMAGE_INPUT_BELOW_LABEL,
  LC_SOCIAL_IMAGE_INPUT_LABEL,
  LC_SOCIAL_IMAGE_LABEL,
  LC_SOCIAL_IMAGE_SUBHEADER,
  LC_STYLES_SUBHEADER,
  LC_UPDATE_FAVICON_LABEL,
  MISSING_SOCIAL_IMAGE_ALT,
} = STRINGS;

export function getLocalControls(): HTMLElement {
  const addContent = addControlsSection(LC_CONTENT_SUBHEADER, [
    createElement({
      id: ADD_ITEM_ID,
      tag: _ElementTag.BUTTON,
      innerHTML: LC_CONTENT_BUTTON,
    }),
  ]);

  const generalMetaEditor = addControlsSection(LC_GENERAL_SUBHEADER, [
    ...addControlsInput(
      PAGE_TITLE_INPUT_ID,
      INPUT_TYPES.TEXT,
      LC_GENERAL_PAGE_TITLE_LABEL,
    ),
    ...addControlsInput(
      PAGE_DESC_INPUT_ID,
      INPUT_TYPES.TEXTAREA,
      LC_GENERAL_PAGE_DESC_LABEL,
    ),
    ...addControlsInput(
      PAGE_LANG_INPUT_ID,
      INPUT_TYPES.TEXT,
      LC_GENERAL_PAGE_LANG_LABEL,
    ),
    createElement({
      tag: _ElementTag.LABEL,
      htmlFor: PAGE_LANG_INPUT_ID,
      classList: [INPUT_BELOW_LABEL_CLASS],
      innerHTML: LC_GENERAL_PAGE_LANG_BELOW_LABEL,
    }),
  ]);

  const backgroundColorEditor = addControlsSection(
    LC_BG_COLOR_SUBHEADER,
    addControlsInput(
      UPDATE_BACKGROUND_COLOR_ID,
      INPUT_TYPES.COLOR,
      LC_COLOR_LABEL,
      getCurrentStyle(CSSProperties.BACKGROUND_COLOR),
    ),
  );

  const textColorEditor = addControlsSection(
    LC_TEXT_COLOR_SUBHEADER,
    addControlsInput(
      UPDATE_TEXT_COLOR_ID,
      INPUT_TYPES.COLOR,
      LC_COLOR_LABEL,
      getCurrentStyle(CSSProperties.COLOR),
      [COLOR_PICKER_CLASS],
    ),
  );

  const bodyWidthFixedEditor = createElement({ id: WIDTH_SLIDER_CONTAINER_ID });
  const bodyWidthFixedCurrentValue = createElement({
    id: WIDTH_SLIDER_VALUE_ID,
    tag: _ElementTag.SPAN,
    innerHTML: `${SETTINGS.BODY_WIDTH}px`,
  });
  const bodyWidthFixedLabel = createElement({
    tag: _ElementTag.LABEL,
    htmlFor: WIDTH_SLIDER_ID,
    innerHTML: LC_BODY_WIDTH_FIXED_LABEL,
  });
  insertElementWithinElement(bodyWidthFixedLabel, bodyWidthFixedCurrentValue);
  const bodyWidthFixedInput = createElement({
    id: WIDTH_SLIDER_ID,
    tag: _ElementTag.INPUT,
    type: INPUT_TYPES.RANGE,
  });
  bodyWidthFixedInput.min = SETTINGS.BODY_WIDTHS[0];
  bodyWidthFixedInput.max =
    SETTINGS.BODY_WIDTHS[SETTINGS.BODY_WIDTHS.length - 1];
  // value must be after min/max to prevent overwrites
  bodyWidthFixedInput.value = SETTINGS.BODY_WIDTH;

  const bodyWidthFixedDataList = createElement({
    id: WIDTH_SLIDER_DATALIST_ID,
    tag: _ElementTag.DATALIST,
  });
  SETTINGS.BODY_WIDTHS.forEach((value) => {
    const option = createElement({ tag: _ElementTag.OPTION, value });
    option.label = `${value}px`;
    insertElementWithinElement(bodyWidthFixedDataList, option);
  });
  bodyWidthFixedInput.setAttribute("list", WIDTH_SLIDER_DATALIST_ID);
  insertElementWithinElement(bodyWidthFixedEditor, bodyWidthFixedLabel);
  insertElementWithinElement(bodyWidthFixedEditor, bodyWidthFixedInput);
  insertElementWithinElement(bodyWidthFixedEditor, bodyWidthFixedDataList);

  const bodyWidthEditor = addControlsSection(
    LC_BODY_WIDTH_SUBHEADER,
    [
      ...addControlsInput(
        FULL_WIDTH_CHECKBOX_ID,
        INPUT_TYPES.CHECKBOX,
        LC_BODY_WIDTH_FULL_LABEL,
      ),
      bodyWidthFixedEditor,
    ],
    HeaderTag.H4,
  );

  const bodyAlignmentEditor = addControlsSection(
    LC_BODY_ALIGNMENT_SUBHEADER,
    [
      ...addControlsAlignmentInput(
        UPDATE_BODY_ALIGN_ID,
        LC_BODY_ALIGNMENT_LEGEND,
        [
          {
            id: "body-left",
            name: UPDATE_BODY_ALIGN_OPTION_NAME,
            value: "left",
            checked: true,
            labelText: ALIGNMENT_LABELS.LEFT,
          },
          {
            id: "body-center",
            name: UPDATE_BODY_ALIGN_OPTION_NAME,
            value: "center",
            checked: false,
            labelText: ALIGNMENT_LABELS.CENTER,
          },
        ],
      ),
      createElement({
        tag: _ElementTag.LABEL,
        innerHTML: LC_BODY_ALIGNMENT_RIGHT_MESSAGE,
      }),
    ],
    HeaderTag.H4,
    UPDATE_BODY_ALIGN_CONTAINER_ID,
  );

  const textAlignmentEditor = addControlsSection(
    LC_TEXT_ALIGNMENT_SUBHEADER,
    addControlsAlignmentInput(UPDATE_TEXT_ALIGN_ID, LC_TEXT_ALIGNMENT_LEGEND, [
      {
        id: "text-left",
        name: UPDATE_TEXT_ALIGN_OPTION_NAME,
        value: "left",
        checked: true,
        labelText: ALIGNMENT_LABELS.LEFT,
      },
      {
        id: "text-center",
        name: UPDATE_TEXT_ALIGN_OPTION_NAME,
        value: "center",
        checked: false,
        labelText: ALIGNMENT_LABELS.CENTER,
      },
      {
        id: "text-right",
        name: UPDATE_TEXT_ALIGN_OPTION_NAME,
        value: "right",
        checked: false,
        labelText: ALIGNMENT_LABELS.RIGHT,
      },
    ]),
    HeaderTag.H4,
  );

  const textSizeControls = addControlsInput(
    UPDATE_TEXT_SIZE_ID,
    INPUT_TYPES.NUMBER,
    STRINGS.LC_TEXT_SIZE_LABEL,
    String(100),
  );
  textSizeControls[1].step = String(10);
  const textStyleEditor = addControlsSection(LC_TEXT_STYLE_SUBHEADER, [
    ...textSizeControls,
  ]);

  const faviconImagePreview = makeImagePreview(
    UPDATE_FAVICON_ID,
    IMAGE_PREVIEW.FAVICON,
  );

  const faviconEditorButtons = createElement({
    classList: [EDIT_BUTTONS_CLASS],
  });
  const faviconEditorCancelButton = createElement({
    tag: _ElementTag.BUTTON,
    id: CANCEL_FAVICON_UPDATE_ID,
    innerHTML: BUTTON_CANCEL,
  });
  faviconEditorCancelButton.disabled = true;
  const faviconEditorUpdateButton = createElement({
    tag: _ElementTag.BUTTON,
    id: CONFIRM_FAVICON_UPDATE_ID,
    innerHTML: BUTTON_UPDATE,
  });
  faviconEditorUpdateButton.disabled = true;
  insertElementWithinElement(faviconEditorButtons, faviconEditorCancelButton);
  insertElementWithinElement(faviconEditorButtons, faviconEditorUpdateButton);
  const faviconEditor = addControlsSection(
    LC_FAVICON_SUBHEADER,
    [
      getFigureWithCaption(
        CURRENT_FAVICON_FIGURE_ID,
        LC_CURRENT_FAVICON_CAPTION,
        CURRENT_FAVICON_PREVIEW_ID,
        getCurrentFaviconURL(),
        LC_CURRENT_FAVICON_ALT_TEXT,
      ),
      ...addControlsInput(
        UPDATE_FAVICON_ID,
        INPUT_TYPES.FILE,
        LC_UPDATE_FAVICON_LABEL,
      ),
      faviconImagePreview,
      faviconEditorButtons,
    ],
    HeaderTag.H4,
  );

  const { url: currentSocialImageURL, alt: currentSocialImageAlt } =
    getCurrentSocialImage();
  const socialImageEditor = addControlsSection(
    LC_SOCIAL_IMAGE_SUBHEADER,
    [
      getFigureWithCaption(
        SOCIAL_IMAGE_FIGURE_ID,
        LC_SOCIAL_IMAGE_LABEL,
        CURRENT_SOCIAL_IMAGE_PREVIEW_ID,
        currentSocialImageURL ?? "",
        currentSocialImageAlt ??
          (currentSocialImageURL ? "" : MISSING_SOCIAL_IMAGE_ALT),
      ),
      ...addControlsInput(
        UPDATE_SOCIAL_IMAGE_ID,
        INPUT_TYPES.TEXT,
        LC_SOCIAL_IMAGE_INPUT_LABEL,
      ),
      createElement({
        tag: _ElementTag.LABEL,
        htmlFor: UPDATE_SOCIAL_IMAGE_ID,
        classList: [NOTE_CLASS],
        innerHTML: LC_SOCIAL_IMAGE_INPUT_BELOW_LABEL,
      }),
    ],
    HeaderTag.H4,
  );

  const saveChanges = addControlsSection(LC_SAVE_CHANGES_SUBHEADER, [
    createElement({
      tag: _ElementTag.BUTTON,
      id: SAVE_CHANGES_ID,
      innerHTML: LC_SAVE_CHANGES_BUTTON_LABEL,
    }),
  ]);

  const wrapper = createElement({ id: LOCAL_CONTROLS_ID });
  const children = [
    createElement({ id: ALERT_LIST }),
    createElement({ tag: HeaderTag.H2, innerHTML: LC_HEADER }),
    createElement({ tag: _ElementTag.P, innerHTML: LC_INSTRUCTIONS }),
    createElement({ tag: _ElementTag.HR }),
    addContent,
    createElement({ tag: HeaderTag.H3, innerHTML: LC_METADATA_SUBHEADER }),
    generalMetaEditor,
    createElement({ tag: HeaderTag.H3, innerHTML: LC_STYLES_SUBHEADER }),
    backgroundColorEditor,
    textColorEditor,
    bodyWidthEditor,
    bodyAlignmentEditor,
    textAlignmentEditor,
    textStyleEditor,
    faviconEditor,
    socialImageEditor,
    saveChanges,
  ];

  children.forEach((element) => {
    insertElementWithinElement(wrapper, element);
  });

  return wrapper;
}
