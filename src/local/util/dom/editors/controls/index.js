import {
  createElement,
  getBodyBackgroundColor,
  getCurrentFaviconURL,
  getCurrentSocialImage,
} from "../..";
import {
  ADD_ITEM_ID,
  BUTTON_ELEMENT,
  CANCEL_FAVICON_UPDATE_ID,
  COLOR_PICKER_CLASS,
  CONFIRM_FAVICON_UPDATE_ID,
  CONTROLS_SECTION_CLASS,
  CURRENT_FAVICON_FIGURE_ID,
  CURRENT_FAVICON_PREVIEW_ID,
  CURRENT_SOCIAL_IMAGE_PREVIEW_ID,
  DATALIST_ELEMENT,
  EDIT_BUTTONS_CLASS,
  FIELDSET_ELEMENT,
  FIGCAPTION_ELEMENT,
  FIGURE_ELEMENT,
  FULL_WIDTH_CHECKBOX_ID,
  HEADING_ELEMENTS,
  HOZ_RULE_ELEMENT,
  IMG_ELEMENT,
  INPUT_BELOW_LABEL_CLASS,
  INPUT_ELEMENT,
  INPUT_TYPES,
  INPUT_TYPE_TEXT_CLASS,
  LABEL_ELEMENT,
  LEGEND_ELEMENT,
  LOCAL_CONTROLS_ID,
  NOTE_CLASS,
  OPTION_ELEMENT,
  PAGE_DESC_INPUT_ID,
  PAGE_LANG_INPUT_ID,
  PAGE_TITLE_INPUT_ID,
  PARAGRAPH_ELEMENT,
  SAVE_CHANGES_ID,
  SETTINGS,
  SOCIAL_IMAGE_FIGURE_ID,
  SPAN_ELEMENT,
  STRINGS,
  TEXTAREA_ELEMENT,
  UPDATE_BACKGROUND_COLOR_ID,
  UPDATE_BODY_ALIGN_ID,
  UPDATE_BODY_ALIGN_OPTION_NAME,
  UPDATE_FAVICON_ID,
  UPDATE_SOCIAL_IMAGE_ID,
  UPDATE_TEXT_ALIGN_ID,
  UPDATE_TEXT_ALIGN_OPTION_NAME,
  WIDTH_SLIDER_CONTAINER_ID,
  WIDTH_SLIDER_DATALIST_ID,
  WIDTH_SLIDER_ID,
  WIDTH_SLIDER_VALUE_ID,
} from "../../../../constants";

const {
  ALIGNMENT_LABELS,
  BUTTON_CANCEL,
  BUTTON_UPDATE,
  LC_BG_COLOR_SUBHEADER,
  LC_BG_COLOR_LABEL,
  LC_BODY_ALIGNMENT_LEGEND,
  LC_BODY_ALIGNMENT_RIGHT_MESSAGE,
  LC_BODY_ALIGNMENT_SUBHEADER,
  LC_BODY_WIDTH_SUBHEADER,
  LC_BODY_WIDTH_FIXED_LABEL,
  LC_BODY_WIDTH_FULL_LABEL,
  LC_TEXT_ALIGNMENT_LEGEND,
  LC_TEXT_ALIGNMENT_SUBHEADER,
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
const [_H1, H2, H3, H4] = HEADING_ELEMENTS;

function getControlsSection(headerText, children = [], headerTag = H3) {
  const section = createElement({ classList: [CONTROLS_SECTION_CLASS] });
  const header = createElement({ tag: headerTag, innerHTML: headerText });
  [header, ...children].forEach((element) => {
    section.insertAdjacentElement("beforeend", element);
  });
  return section;
}

function getControlsInput(id, _type, labelText, value, _classList = []) {
  const label = createElement({
    tag: LABEL_ELEMENT,
    innerHTML: labelText,
    htmlFor: id,
  });
  let classList = _classList;
  _type === INPUT_TYPES.TEXT && classList.push(INPUT_TYPE_TEXT_CLASS);
  let tag = INPUT_ELEMENT;
  let type = _type;
  if (_type === INPUT_TYPES.TEXTAREA) {
    tag = TEXTAREA_ELEMENT;
    type = undefined;
  }
  const input = createElement({ id, tag, type, value, classList });
  return [label, input];
}

function getControlsAlignmentInput(fieldsetId, legendText, options) {
  const fieldset = createElement({
    tag: FIELDSET_ELEMENT,
    id: UPDATE_BODY_ALIGN_ID,
  });
  const legend = createElement({
    tag: LEGEND_ELEMENT,
    innerHTML: LC_BODY_ALIGNMENT_LEGEND,
  });
  const optionElements = options.map((option) => {
    const { id, name, value, checked, labelText } = option;
    const container = createElement();
    const [label, input] = getControlsInput(
      id,
      INPUT_TYPES.RADIO,
      labelText,
      value
    );
    input.name = name;
    input.checked = checked;
    container.insertAdjacentElement("beforeend", input);
    container.insertAdjacentElement("beforeend", label);
    return container;
  });
  fieldset.insertAdjacentElement("beforeend", legend);
  optionElements.forEach((optionElement) => {
    fieldset.insertAdjacentElement("beforeend", optionElement);
  });
  return [fieldset];
}

function getFigureWithCaption(
  figureId,
  captionText,
  imageId,
  imageSrc,
  imageAlt
) {
  const figure = createElement({ tag: FIGURE_ELEMENT, id: figureId });
  const caption = createElement({
    tag: FIGCAPTION_ELEMENT,
    innerHTML: captionText,
  });
  const image = createElement({
    tag: IMG_ELEMENT,
    id: imageId,
    imageSrc,
    altText: imageAlt,
  });
  figure.insertAdjacentElement("beforeend", caption);
  figure.insertAdjacentElement("beforeend", image);
  return figure;
}

export function getLocalControls() {
  const addContent = getControlsSection(LC_CONTENT_SUBHEADER, [
    createElement({
      id: ADD_ITEM_ID,
      tag: BUTTON_ELEMENT,
      innerHTML: LC_CONTENT_BUTTON,
    }),
  ]);

  const generalMetaEditor = getControlsSection(LC_GENERAL_SUBHEADER, [
    ...getControlsInput(
      PAGE_TITLE_INPUT_ID,
      INPUT_TYPES.TEXT,
      LC_GENERAL_PAGE_TITLE_LABEL
    ),
    ...getControlsInput(
      PAGE_DESC_INPUT_ID,
      INPUT_TYPES.TEXTAREA,
      LC_GENERAL_PAGE_DESC_LABEL
    ),
    ...getControlsInput(
      PAGE_LANG_INPUT_ID,
      INPUT_TYPES.TEXT,
      LC_GENERAL_PAGE_LANG_LABEL
    ),
    createElement({
      tag: LABEL_ELEMENT,
      htmlFor: PAGE_LANG_INPUT_ID,
      classList: [INPUT_BELOW_LABEL_CLASS],
      innerHTML: LC_GENERAL_PAGE_LANG_BELOW_LABEL,
    }),
  ]);
  const backgroundColorEditor = getControlsSection(
    LC_BG_COLOR_SUBHEADER,
    getControlsInput(
      UPDATE_BACKGROUND_COLOR_ID,
      INPUT_TYPES.COLOR,
      LC_BG_COLOR_LABEL,
      getBodyBackgroundColor(),
      [COLOR_PICKER_CLASS]
    ),
    H4
  );

  const bodyWidthFixedEditor = createElement({ id: WIDTH_SLIDER_CONTAINER_ID });
  const bodyWidthFixedCurrentValue = createElement({
    id: WIDTH_SLIDER_VALUE_ID,
    tag: SPAN_ELEMENT,
    innerHTML: `${SETTINGS.BODY_WIDTH}px`,
  });
  const bodyWidthFixedLabel = createElement({
    tag: LABEL_ELEMENT,
    htmlFor: WIDTH_SLIDER_ID,
    innerHTML: LC_BODY_WIDTH_FIXED_LABEL,
  });
  bodyWidthFixedLabel.insertAdjacentElement(
    "beforeend",
    bodyWidthFixedCurrentValue
  );
  const bodyWidthFixedInput = createElement({
    id: WIDTH_SLIDER_ID,
    tag: INPUT_ELEMENT,
    type: INPUT_TYPES.RANGE,
    value: SETTINGS.BODY_WIDTH,
  });
  bodyWidthFixedInput.min = SETTINGS.BODY_WIDTHS[0];
  bodyWidthFixedInput.max =
    SETTINGS.BODY_WIDTHS[SETTINGS.BODY_WIDTHS.length - 1];

  const bodyWidthFixedDatalist = createElement({
    id: WIDTH_SLIDER_DATALIST_ID,
    tag: DATALIST_ELEMENT,
  });
  SETTINGS.BODY_WIDTHS.forEach((value) => {
    const option = createElement({ tag: OPTION_ELEMENT, value });
    option.label = `${value}px`;
    bodyWidthFixedDatalist.insertAdjacentElement("beforeend", option);
  });
  bodyWidthFixedInput.setAttribute("list", WIDTH_SLIDER_DATALIST_ID);
  bodyWidthFixedEditor.insertAdjacentElement("beforeend", bodyWidthFixedLabel);
  bodyWidthFixedEditor.insertAdjacentElement("beforeend", bodyWidthFixedInput);
  bodyWidthFixedEditor.insertAdjacentElement(
    "beforeend",
    bodyWidthFixedDatalist
  );

  const bodyWidthEditor = getControlsSection(
    LC_BODY_WIDTH_SUBHEADER,
    [
      ...getControlsInput(
        FULL_WIDTH_CHECKBOX_ID,
        INPUT_TYPES.CHECKBOX,
        LC_BODY_WIDTH_FULL_LABEL
      ),
      bodyWidthFixedEditor,
    ],
    H4
  );
  const bodyAlignmentEditor = getControlsSection(
    LC_BODY_ALIGNMENT_SUBHEADER,

    [
      ...getControlsAlignmentInput(
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
        ]
      ),
      createElement({
        tag: LABEL_ELEMENT,
        innerHTML: LC_BODY_ALIGNMENT_RIGHT_MESSAGE,
      }),
    ],
    H4
  );
  const textAlignmentEditor = getControlsSection(
    LC_TEXT_ALIGNMENT_SUBHEADER,

    getControlsAlignmentInput(UPDATE_TEXT_ALIGN_ID, LC_TEXT_ALIGNMENT_LEGEND, [
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
    H4
  );

  const faviconEditorButtons = createElement({
    classList: [EDIT_BUTTONS_CLASS],
  });
  const faviconEditorCancelButton = createElement({
    tag: BUTTON_ELEMENT,
    id: CANCEL_FAVICON_UPDATE_ID,
    innerHTML: BUTTON_CANCEL,
  });
  faviconEditorCancelButton.disabled = true;
  const faviconEditorUpdateButton = createElement({
    tag: BUTTON_ELEMENT,
    id: CONFIRM_FAVICON_UPDATE_ID,
    innerHTML: BUTTON_UPDATE,
  });
  faviconEditorUpdateButton.disabled = true;
  faviconEditorButtons.insertAdjacentElement(
    "beforeend",
    faviconEditorCancelButton
  );
  faviconEditorButtons.insertAdjacentElement(
    "beforeend",
    faviconEditorUpdateButton
  );
  const faviconEditor = getControlsSection(
    LC_FAVICON_SUBHEADER,
    [
      getFigureWithCaption(
        CURRENT_FAVICON_FIGURE_ID,
        LC_CURRENT_FAVICON_CAPTION,
        CURRENT_FAVICON_PREVIEW_ID,
        getCurrentFaviconURL(),
        LC_CURRENT_FAVICON_ALT_TEXT
      ),
      ...getControlsInput(
        UPDATE_FAVICON_ID,
        INPUT_TYPES.FILE,
        LC_UPDATE_FAVICON_LABEL
      ),
      faviconEditorButtons,
    ],
    H4
  );

  const { url: currentSocialImageURL, alt: currentSocialImageAlt } =
    getCurrentSocialImage();
  const socialImageEditor = getControlsSection(
    LC_SOCIAL_IMAGE_SUBHEADER,
    [
      getFigureWithCaption(
        SOCIAL_IMAGE_FIGURE_ID,
        LC_SOCIAL_IMAGE_LABEL,
        CURRENT_SOCIAL_IMAGE_PREVIEW_ID,
        currentSocialImageURL ?? "",
        currentSocialImageAlt ??
          (currentSocialImageURL ? "" : MISSING_SOCIAL_IMAGE_ALT)
      ),
      ...getControlsInput(
        UPDATE_SOCIAL_IMAGE_ID,
        INPUT_TYPES.TEXT,
        LC_SOCIAL_IMAGE_INPUT_LABEL
      ),
      createElement({
        tag: LABEL_ELEMENT,
        htmlFor: UPDATE_SOCIAL_IMAGE_ID,
        classList: [NOTE_CLASS],
        innerHTML: LC_SOCIAL_IMAGE_INPUT_BELOW_LABEL,
      }),
    ],
    H4
  );
  const saveChanges = getControlsSection(LC_SAVE_CHANGES_SUBHEADER, [
    createElement({
      tag: BUTTON_ELEMENT,
      id: SAVE_CHANGES_ID,
      innerHTML: LC_SAVE_CHANGES_BUTTON_LABEL,
    }),
  ]);

  const wrapper = createElement({ id: LOCAL_CONTROLS_ID });
  const children = [
    createElement({ tag: H2, innerHTML: LC_HEADER }),
    createElement({ tag: PARAGRAPH_ELEMENT, innerHTML: LC_INSTRUCTIONS }),
    createElement({ tag: HOZ_RULE_ELEMENT }),
    addContent,
    createElement({ tag: H3, innerHTML: LC_METADATA_SUBHEADER }),
    generalMetaEditor,
    createElement({ tag: H3, innerHTML: LC_STYLES_SUBHEADER }),
    backgroundColorEditor,
    bodyWidthEditor,
    bodyAlignmentEditor,
    textAlignmentEditor,
    faviconEditor,
    socialImageEditor,
    saveChanges,
  ];

  children.forEach((element) => {
    wrapper.insertAdjacentElement("beforeend", element);
  });

  return wrapper;
}
