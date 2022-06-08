import {
  getBodyBackgroundColor,
  getCurrentFaviconURL,
  getCurrentSocialImage,
} from "./util/dom";

import {
  ADD_ITEM_ID,
  CANCEL_FAVICON_UPDATE_ID,
  COLOR_PICKER_CLASS,
  CONFIRM_FAVICON_UPDATE_ID,
  CURRENT_FAVICON_PREVIEW_ID,
  CURRENT_SOCIAL_IMAGE_PREVIEW_ID,
  EDIT_BUTTONS_CLASS,
  FULL_WIDTH_CHECKBOX_ID,
  PAGE_DESC_INPUT_ID,
  PAGE_LANG_INPUT_ID,
  PAGE_TITLE_INPUT_ID,
  STRINGS,
  UPDATE_BACKGROUND_COLOR_ID,
  UPDATE_BODY_ALIGN_CONTAINER,
  UPDATE_BODY_ALIGN_ID,
  UPDATE_FAVICON_ID,
  UPDATE_TEXT_ALIGN_ID,
  UPDATE_SOCIAL_IMAGE_ID,
  SAVE_CHANGES_ID,
  WIDTH_SLIDER_CONTAINER_ID,
  WIDTH_SLIDER_ID,
  WIDTH_SLIDER_VALUE_ID,
} from "./constants";

const { url: currentSocialImageURL, alt: currentSocialImageAlt } =
  getCurrentSocialImage();

const ADD_CONTENT = `
  <div class="controls-section">
    <h3>Add Content<h3>
    <button id="${ADD_ITEM_ID}">Add Item</button>
  </div>
`;

const METADATA_EDITOR = `
  <div class="controls-section">
    <h4>General</h4>
    <label for="${PAGE_TITLE_INPUT_ID}">Page Title: </label>
    <input type="text" id="${PAGE_TITLE_INPUT_ID}" class="text-input" />
    <label for="${PAGE_DESC_INPUT_ID}">Page Description</label>
    <textarea id="${PAGE_DESC_INPUT_ID}" style="min-height: 2rem"></textarea>
    <label for="${PAGE_LANG_INPUT_ID}">Page Language</label>
    <input
      type="text"
      id="${PAGE_LANG_INPUT_ID}"
      class="text-input"
      value="${document.documentElement.lang}"
    />
    <label
      for="edit-page-langauge"
      class="below-label"
    >
      See list of valid language tags <a href="https://en.wikipedia.org/wiki/IETF_language_tag#List_of_subtags" target="_blank">here</a>.
    </label>
  </div>
`;

const BACKGROUND_COLOR_EDITOR = `
  <div class="controls-section">
    <h4>Background Color</h4>
    <input
      type="color"
      value="${getBodyBackgroundColor()}"
      class="${COLOR_PICKER_CLASS}"
      id="${UPDATE_BACKGROUND_COLOR_ID}"
    />
  </div>
`;

const BODY_WIDTH_EDITOR = `
  <div class="controls-section">
    <h4>Body Width</h4>
    <label for="${FULL_WIDTH_CHECKBOX_ID}">Use Full Window Width</label>
    <input type="checkbox" id="${FULL_WIDTH_CHECKBOX_ID}" />
    <div id="${WIDTH_SLIDER_CONTAINER_ID}">
      <label for="${WIDTH_SLIDER_ID}">
        Fixed Body Width: <span id="${WIDTH_SLIDER_VALUE_ID}">800px</span>
      </label>
      <input
        type="range"
        id="${WIDTH_SLIDER_ID}"
        min="200"
        max="1920"
        value="800"
        list="tickmarks"
      />
      <datalist id="tickmarks">
        <option value="200" label="200px" />
        <option value="300" label="300px" />
        <option value="400" label="400px" />
        <option value="500" label="500px" />
        <option value="640" label="640px" />
        <option value="800" label ="800px" />
        <option value="1000" label="1000px" />
        <option value="1200" label="1200px" />
        <option value="1500" label="1500px" />
        <option value="1920" label="1920px" />
      </datalist>
    </div>
  </div>
`;

const BODY_ALIGNMENT_EDITOR = `
  <div class="controls-section" id="${UPDATE_BODY_ALIGN_CONTAINER}">
    <h4>Body Alignment</h2>
    <fieldset id="${UPDATE_BODY_ALIGN_ID}">
        <legend>
          Select an option for aligning the body of the page on the
          window
        </legend>
        <div>
          <input type="radio" id="body-left" name="body-align" value="left"
                checked>
          <label for="body-left">Left</label>
        </div>

        <div>
          <input type="radio" id="body-center" name="body-align" value="center">
          <label for="body-center">Center</label>
        </div>

        <div>
          <label><em>Right aligned body is not supported.</em></label>
        </div>
    </fieldset>
  </div>
`;

const TEXT_ALIGNMENT_EDITOR = `
  <div class="controls-section">
    <h4>Text Alignment</h2>
    <fieldset id="${UPDATE_TEXT_ALIGN_ID}">
        <legend>
          Select an option for aligning the text within the body
        </legend>
        <div>
          <input type="radio" id="text-left" name="text-align" value="left"
                checked>
          <label for="text-left">Left</label>
        </div>

        <div>
          <input type="radio" id="text-center" name="text-align" value="center">
          <label for="text-center">Center</label>
        </div>

        <div>
          <input type="radio" id="text-right" name="text-align" value="right">
          <label for="text-right">Right</label>
        </div>
    </fieldset>
  </div>
`;

const FAVICON_EDITOR = `
  <div class="controls-section">
    <h4>Favicon</h4>
    <figure id="favicon-preview">
      <figcaption>Current Favicon:</figcaption>
      <img id="${CURRENT_FAVICON_PREVIEW_ID}" src="${getCurrentFaviconURL()}"
      alt="The current favicon">
    </figure>
    <label for="${UPDATE_FAVICON_ID}">Update Favicon</label>
    <input id="${UPDATE_FAVICON_ID}" type="file" />
    <div class="${EDIT_BUTTONS_CLASS}">
      <button
        id="${CANCEL_FAVICON_UPDATE_ID}"
        disabled
      >${STRINGS.BUTTON_CANCEL}</button>
      <button
        id="${CONFIRM_FAVICON_UPDATE_ID}"
        disabled
      >${STRINGS.BUTTON_UPDATE}</button>
    </div>
  </div>
`;

const SOCIAL_IMAGE_EDITOR = `
  <div class="controls-section">
    <h4>Social Image</h4>
    <figure id="social-image-preview">
      <figcaption>Current Social Image:</figcaption>
      <img
        id="${CURRENT_SOCIAL_IMAGE_PREVIEW_ID}"
        src="${currentSocialImageURL ?? ""}"
        alt="${
          currentSocialImageAlt ?? currentSocialImageURL
            ? ""
            : STRINGS.MISSING_SOCIAL_IMAGE_ALT
        }"
      >
    </figure>
    <label for="${UPDATE_SOCIAL_IMAGE_ID}">Update Social Image</label>
    <input type="text" id="${UPDATE_SOCIAL_IMAGE_ID}" class="text-input" />
    <label for="${UPDATE_SOCIAL_IMAGE_ID}" class="note">
      Social Image must be a full URL including the domain name and cannot be included inline as a data URL like other images. You will likely need to upload the image to your web host, then update your page again with the hosted image URL. The social image is configured for a square image at least 144px x 144px large.
    </label>
  </div>
`;

const SAVE_CHANGES = `
  <div class="controls-section">
    <h3>Save Changes</h3>
    <button id="${SAVE_CHANGES_ID}">Save All Changes to Local File</button>
  </div>
`;

export const LOCAL_CONTROLS_HTML = `
  <h2>${STRINGS.LOCAL_CONTROLS_HEADER}</h2>
  <p>
    ${STRINGS.LOCAL_CONTROLS_INSTRUCTIONS}
  </p>
  <hr/>

  ${ADD_CONTENT}

  <h3>${STRINGS.LOCAL_CONTROLS_METADATA_SUBHEADER}</h3>

  ${METADATA_EDITOR}

  <h3>Styles</h3>

  ${BACKGROUND_COLOR_EDITOR}

  ${BODY_WIDTH_EDITOR}

  ${BODY_ALIGNMENT_EDITOR}

  ${TEXT_ALIGNMENT_EDITOR}

  ${FAVICON_EDITOR}

  ${SOCIAL_IMAGE_EDITOR}

  ${SAVE_CHANGES}
`;
