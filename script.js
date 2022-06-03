const DEV_MODE = false;
var editingStateDirty = false;

/* Check for local file */
const protocol = window.location.protocol;
if (protocol === "file:") {
  localEditingMode();
}

/* Editng JavaScript only runs locally */
function localEditingMode() {
  // Constants
  const PAGE_TITLE_INPUT_ID = "edit-page-title";
  const PAGE_DESC_INPUT_ID = "edit-page-description";
  const PAGE_LANG_INPUT_ID = "edit-page-language";
  const ADD_ITEM_ID = "add-item";
  const ADD_ITEM_ID_PREFIX = "add-item-";
  const ADD_ITEM_HEADING_ID = `${ADD_ITEM_ID_PREFIX}heading`;
  const ADD_ITEM_IMAGE_ID = `${ADD_ITEM_ID_PREFIX}image`;
  const ADD_ITEM_PARAGRAPH_ID = `${ADD_ITEM_ID_PREFIX}paragraph`;
  const ADD_ITEM_CANCEL_ID = `${ADD_ITEM_ID_PREFIX}cancel`;
  const CURRENT_FAVICON_PREVIEW_ID = "current-favicon-preview";
  const UPDATE_FAVICON_ID = "update-favicon";
  const CANCEL_FAVICON_UPDATE_ID = "cancel-favicon-update";
  const CONFIRM_FAVICON_UPDATE_ID = "confirm-favicon-update";
  const FAVICON_QUERY_SELECTOR = "link[rel~='icon']";
  const CURRENT_SOCIAL_IMAGE_ID = "meta-image";
  const CURRENT_TWITTER_IMAGE_ID = "twitter-image";
  const CURRENT_SOCIAL_IMAGE_PREVIEW_ID = "current-social-image-preview";
  const UPDATE_SOCIAL_IMAGE_ID = "update-social-image";
  const UPDATE_BACKGROUND_COLOR_ID = "update-background-color";
  const FULL_WIDTH_CHECKBOX_ID = "update-full-width";
  const WIDTH_SLIDER_CONTAINER_ID = "update-body-width-container";
  const WIDTH_SLIDER_ID = "update-body-width";
  const WIDTH_SLIDER_VALUE_ID = "update-body-width-value";
  const UPDATE_BODY_ALIGN_CONTAINER = "udpate-body-align-container";
  const UPDATE_BODY_ALIGN_ID = "update-body-align";
  const UPDATE_TEXT_ALIGN_ID = "update-text-align";
  const COLOR_PICKER_CLASS = "color-picker";
  const SAVE_CHANGES_ID = "save-changes";
  const CLONE_LABEL = "Original Element";
  const CLONE_CLASS = "clone";
  const CLONE_CONTAINER_CLASS = "clone-container";
  const EDIT_CLASS = "edit";
  const EDIT_CONTAINER_CLASS = "edit-container";
  const EDIT_BUTTONS_CLASS = "edit-buttons";
  const TEXT_EDITOR_ID_READABLE_STRING = "text-editor";
  const IMAGE_PICKER_ID_READABLE_STRING = "image-picker";
  const END_OF_DOC_ID = "end-of-document";
  const LOCAL_CONTROLS_CONTAINER_ID = "local-controls-container";
  const LOCAL_CONTROLS_ID = "local-controls";
  const NEW_CONTENT_MODAL_WRAPPER = "new-content-modal-wrapper";
  const HEADING_ELEMENTS = ["h1", "h2", "h3", "h4", "h5", "h6"];
  const PARAGRAPH_ELEMENT = "p";
  const IMG_ELEMENT = "img";

  const EDITOR_TYPES = {
    TEXT: "text",
    HEADING: "heading",
    HEADING_LEVEL: "heading-level",
    ALIGN: "align",
    PARAGRAPH: "paragraph",
    IMAGE: "image",
    IMAGE_ALT_TEXT: "image-alt",
  };

  const STRINGS = {
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

  const currentFaviconURL = document.querySelector(FAVICON_QUERY_SELECTOR).href;
  const currentBackgroundColor = getBodyBackgroundColor();
  const { href: currentSocialImageURL, alt: currentSocialImageAlt } =
    document.getElementById(CURRENT_SOCIAL_IMAGE_ID);

  const NEW_CONTENT_MODAL_HTML = `
          <div id="new-content-modal">
            <h2>Add New Content</h2>
            <ul>
              <li><button id="${ADD_ITEM_HEADING_ID}">Heading</button></li>
              <li><button id="${ADD_ITEM_PARAGRAPH_ID}">Paragraph</button></li>
              <li><button id="${ADD_ITEM_IMAGE_ID}">Image</button></li>
            </ul>
            <button id="${ADD_ITEM_CANCEL_ID}">Cancel</button>
          </div>
        `;

  const LOCAL_CONTROLS_HTML = `
          <h2>Local Controls</h2>
          <p>This section of the page will only display when viewing the local version of your website by opening the <code>index.html</code> file on a computer.
          <hr/>

          <div class="controls-section">
            <h3>Add Content<h3>
            <button id="${ADD_ITEM_ID}">Add Item</button>
          </div>

          <h3>Metadata</h3>

          <div class="controls-section">
            <h4>General</h4>
            <label for="${PAGE_TITLE_INPUT_ID}">Page Title: </label>
            <input type="text" id="${PAGE_TITLE_INPUT_ID}" class="text-input" />
            <label for="${PAGE_DESC_INPUT_ID}">Page Description</label>
            <textarea id="${PAGE_DESC_INPUT_ID}" style="min-height: 2rem"></textarea>
            <label for="${PAGE_LANG_INPUT_ID}">Page Language</label>
            <input type="text" id="${PAGE_LANG_INPUT_ID}" class="text-input" value="${
    document.documentElement.lang
  }" />
            <label for="edit-page-langauge" class="below-label">See list of valid language tags <a href="https://en.wikipedia.org/wiki/IETF_language_tag#List_of_subtags" target="_blank">here</a>.
          </div>

          <div class="controls-section">
            <h4>Background Color</h4>
            <input type="color" value="${currentBackgroundColor}" class="${COLOR_PICKER_CLASS}" id="${UPDATE_BACKGROUND_COLOR_ID}" />
          </div>

          <div class="controls-section">
            <h4>Body Width</h4>
            <label for="${FULL_WIDTH_CHECKBOX_ID}">Use Full Window Width</label>
            <input type="checkbox" id="${FULL_WIDTH_CHECKBOX_ID}" />
            <div id="${WIDTH_SLIDER_CONTAINER_ID}">
              <label for="${WIDTH_SLIDER_ID}">Fixed Body Width: <span id="${WIDTH_SLIDER_VALUE_ID}">800px</span></label>
              <input
                type="range"
                id="${WIDTH_SLIDER_ID}"
                min="200"
                max="1920"
                value="800"
                list="tickmarks" />
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

          <div class="controls-section">
            <h4>Text Alignment</h2>
            <fieldset id="${UPDATE_TEXT_ALIGN_ID}">
                <legend>
                  Select an option for aligning the text withing the body
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

          <div class="controls-section">
            <h4>Favicon</h4>
            <figure id="favicon-preview">
              <figcaption>Current Favicon:</figcaption>
              <img id="${CURRENT_FAVICON_PREVIEW_ID}" src="${currentFaviconURL}"
              alt="The current favicon">
            </figure>
            <label for="${UPDATE_FAVICON_ID}">Update Favicon</label>
            <input id="${UPDATE_FAVICON_ID}" type="file" />
            <div class="${EDIT_BUTTONS_CLASS}">
              <button id="${CANCEL_FAVICON_UPDATE_ID}" disabled>${
    STRINGS.BUTTON_CANCEL
  }</button>
              <button id="${CONFIRM_FAVICON_UPDATE_ID}" disabled>${
    STRINGS.BUTTON_UPDATE
  }</button>
            </div>
          </div>

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
            <label for="${UPDATE_SOCIAL_IMAGE_ID}" class="note">Social Image must be a full URL including the domain name and cannot be included inline as a data URL like other images. You will likely need to upload the image to your web host, then update your page again with the hosted image URL. The social image is configured for a square image at least 144px x 144px large.</label>
          </div>

          <div class="controls-section">
            <h3>Save Changes</h3>
            <button id="${SAVE_CHANGES_ID}">Save All Changes to Local File</button>
          </div>
        `;

  function makeElementEventListener(editorType) {
    return function (event, isExistingElement = true) {
      const element = event.currentTarget;
      let elementClone;
      if (isExistingElement) {
        elementClone = element.cloneNode(true);
        elementClone.classList.add(CLONE_CLASS);
      }
      const originalDisplay = element.style.display;
      element.style.display = "none";
      const {
        tagName: _tagName,
        innerHTML: _originalContent,
        alt: altTextContent,
      } = element;
      const tagName = _tagName.toLowerCase();
      const originalContent = _originalContent
        .split(/(\n|\s)+/)
        .filter((i) => ![" ", "", "\n"].some((j) => j === i))
        .join(" ");

      const deleteButton = {
        label: STRINGS.BUTTON_DELETE,
        initiallyDisabled: false,
        updateElement: ({ editorElement, originalElement }) => {
          const result = window.confirm(STRINGS.CONFIRM_DELETE);
          if (!result) return;
          editorElement.remove();
          originalElement.remove();
          return true;
        },
      };

      const cancelButton = {
        label: STRINGS.BUTTON_CANCEL,
        initiallyDisabled: false,
        updateElement: ({}) => true,
      };

      const linkButton = {
        label: STRINGS.BUTTON_LINK,
        initiallyDisabled: false,
        updateElement: ({ editorId }) => {
          const selectableInput = document.getElementById(editorId);
          selectableInput.value = addLinkAroundSelection(selectableInput);
        },
      };

      const updateButtonLabel = isExistingElement
        ? STRINGS.BUTTON_UPDATE
        : STRINGS.BUTTON_SAVE;

      const updateTextCallback = ({
        editorElement,
        tagNameSelect,
        alignSelectElement,
        originalElement,
      }) => {
        const tagName = tagNameSelect?.value ?? PARAGRAPH_ELEMENT;
        const updatedTextElement = addText({
          editorId: editorElement.id,
          tagName,
          alignSelectElement,
          text: editorElement.value,
        });
        return elementUpdateCleanup(updatedTextElement, originalElement, [
          // 🚸 TODO check alignment dirty
          "innerHTML",
          "style",
          "tagName",
        ]);
      };

      const updateImageCallback = async ({
        editorElement: imagePicker,
        altTextEditor,
        alignSelectElement,
        originalElement,
      }) => {
        const updatedImageElement = await addImage({
          filePickerId: imagePicker.id,
          altText: altTextEditor?.value,
          alignSelectElement,
          originalElement,
        });
        return elementUpdateCleanup(
          updatedImageElement,
          originalElement,
          // 🚸 TODO check alignment dirty
          ["alt", "src", "style"]
        );
      };

      function elementUpdateCleanup(
        updatedElement,
        originalElement,
        propertyArray
      ) {
        if (!updatedElement) return false;
        const _editingStateDirty = propertyArray.some((p) => {
          const updatedValue = updatedElement?.[p];
          const originalValue = originalElement?.[p];
          // 🚸 TODO only check relevant sub properties for style
          // https://github.com/patrickweaver/website-editor/issues/87
          return updatedValue !== originalValue;
        });
        originalElement.remove();
        editingStateDirty = editingStateDirty || _editingStateDirty;
        return true;
      }

      const updateTextButton = {
        label: updateButtonLabel,
        initiallyDisabled: false,
        updateElement: updateTextCallback,
      };

      const upateImageButton = {
        label: updateButtonLabel,
        initiallyDisabled: true,
        updateElement: updateImageCallback,
      };

      const defaultButtons = [deleteButton];
      if (isExistingElement) {
        defaultButtons.unshift(cancelButton);
      }

      let types = {
        text: {
          idReadableString: TEXT_EDITOR_ID_READABLE_STRING,
          controls: [...defaultButtons, linkButton, updateTextButton],
          createEditor: createTextEditor,
        },
        [EDITOR_TYPES.IMAGE]: {
          idReadableString: IMAGE_PICKER_ID_READABLE_STRING,
          controls: [...defaultButtons, upateImageButton],
          createEditor: createImageEditor,
        },
      };
      types[EDITOR_TYPES.HEADING] = types.text;
      types[EDITOR_TYPES.PARAGRAPH] = types.text;
      const type = types[editorType];

      const editorId = getUniqueId(type.idReadableString);

      const editElements = type.createEditor({
        id: editorId,
        confirmButtonLabel: updateButtonLabel,
        content: originalContent,
        tagName,
        altTextContent,
        style: element.style,
      });
      const {
        editor,
        editorLabel,
        tagPicker,
        tagPickerLabel,
        altEditor,
        altEditorLabel,
        alignSelect,
      } = editElements;

      let buttonsContainerElement = createElement({
        classList: [EDIT_BUTTONS_CLASS],
      });

      let editorContainerElement = createElement({
        classList: [EDIT_CONTAINER_CLASS],
        id: getEditorContainerId(editorId),
      });

      if (isExistingElement) {
        const elementCloneContainer = createElement({
          id: "clone-container",
          uniqueId: true,
          classList: [CLONE_CONTAINER_CLASS],
          style: {
            textAlign: document.body.textAlign,
            display: document.body.display,
            flexDirection: document.body.flexDirection,
          },
        });

        elementCloneContainer.insertAdjacentElement("beforeend", elementClone);

        editorContainerElement.insertAdjacentElement(
          "beforeend",
          elementCloneContainer
        );

        const elementCloneLabel = createElement({
          tag: "label",
          innerHTML: CLONE_LABEL,
        });
        elementCloneContainer.insertAdjacentElement(
          "beforebegin",
          elementCloneLabel
        );
      }

      type.controls.forEach((i) => {
        let buttonElement = createElement({
          tag: "button",
          classList: [`${slugify(i.label)}-button`],
        });
        buttonElement.id = getButtonId(i.label, editorId);
        buttonElement.disabled = i.initiallyDisabled;
        buttonElement.innerHTML = i.label;
        buttonsContainerElement.insertAdjacentElement(
          "beforeend",
          buttonElement
        );
        buttonElement.addEventListener("click", function (_event) {
          const success = i.updateElement({
            editorElement: editor,
            tagNameSelect: tagPicker,
            alignSelectElement: alignSelect,
            altTextEditor: altEditor,
            originalElement: element,
            editorId,
          });
          if (success) {
            editorContainerElement.remove();
            element.style.display = originalDisplay;
          }
        });
      });

      element.insertAdjacentElement("beforebegin", editorContainerElement);
      // Reverse so labels are placed above inputs
      const editElementsArray = [
        tagPickerLabel,
        tagPicker,
        alignSelect,
        editorLabel,
        editor,
        altEditorLabel,
        altEditor,
        buttonsContainerElement,
      ];
      editElementsArray.forEach((editorElement) => {
        if (!editorElement) return;
        editorContainerElement.insertAdjacentElement(
          "beforeend",
          editorElement
        );
      });

      editor.focus();
      editor.select();
    };
  }
  const textEventListener = makeElementEventListener(EDITOR_TYPES.TEXT);
  const imageEventListener = makeElementEventListener(EDITOR_TYPES.IMAGE);

  function insertAdj(id, element, pos = "afterbegin") {
    document.getElementById(id).insertAdjacentElement(pos, element);
  }

  function activate(id, callback, type = "change") {
    document.getElementById(id).addEventListener(type, callback);
  }

  function activateText(element) {
    element.addEventListener("click", textEventListener);
  }

  [
    ...document.querySelectorAll(HEADING_ELEMENTS.join(", ")),
    ...document.querySelectorAll(PARAGRAPH_ELEMENT),
  ].forEach(activateText);

  function activateImage(element) {
    element.addEventListener("click", imageEventListener);
  }
  document.querySelectorAll(IMG_ELEMENT).forEach(activateImage);

  /* Local Controls */
  let localControls = createElement({
    id: LOCAL_CONTROLS_ID,
    innerHTML: LOCAL_CONTROLS_HTML,
  });
  let localControlsContainer = createElement({
    id: LOCAL_CONTROLS_CONTAINER_ID,
  });

  function addLocalControls() {
    insertAdj(END_OF_DOC_ID, localControlsContainer, "afterend");
    insertAdj(LOCAL_CONTROLS_CONTAINER_ID, localControls);
    activate(ADD_ITEM_ID, showNewContentModal, "click");

    window.addEventListener("beforeunload", function (event) {
      if (!DEV_MODE && editingStateDirty) {
        event.preventDefault();
        event.returnValue = "";
      }
    });
  }

  addLocalControls();

  /* Activate Controls on Existing Elements */
  activate(UPDATE_BACKGROUND_COLOR_ID, onUpdateBackgroundColor);
  activate(FULL_WIDTH_CHECKBOX_ID, onUpdateFullWidth);
  activate(WIDTH_SLIDER_ID, onUpdateWidth, "input");
  activate(UPDATE_BODY_ALIGN_ID, onUpdateBodyAlign);
  activate(UPDATE_TEXT_ALIGN_ID, onUpdateBodyTextAlign);
  activate(UPDATE_FAVICON_ID, onUpdateFaviconPicker);
  activate(UPDATE_SOCIAL_IMAGE_ID, onUpdateSocialImage, "input");

  /* Add Content */
  function showNewContentModal() {
    let newContentModal = createElement({
      id: NEW_CONTENT_MODAL_WRAPPER,
      innerHTML: NEW_CONTENT_MODAL_HTML,
    });
    insertAdj(LOCAL_CONTROLS_ID, newContentModal, "beforeend");

    function clearAddItemModal() {
      document.getElementById(NEW_CONTENT_MODAL_WRAPPER).remove();
    }

    // Heading, Paragraph, and Image buttons
    const addTextItemButtonIds = [
      ADD_ITEM_HEADING_ID,
      ADD_ITEM_PARAGRAPH_ID,
      ADD_ITEM_IMAGE_ID,
    ];
    addTextItemButtonIds.forEach((buttonId) => {
      const callback = (event) => {
        addNewElement(
          event.currentTarget.id.slice(
            ADD_ITEM_ID_PREFIX.length,
            event.currentTarget.id.length
          )
        );
        clearAddItemModal();
      };
      activate(buttonId, callback, "click");
    });

    // cancel Button
    activate(ADD_ITEM_CANCEL_ID, clearAddItemModal, "click");
  }

  async function addImage({
    filePickerId,
    altText,
    alignSelectElement,
    originalElement,
  }) {
    const imageAlign = getAlignValueFromFieldset(alignSelectElement);
    const style = handleUpdateImgElementAlign(imageAlign);
    const file = document.getElementById(filePickerId).files[0];
    if (file && !isImageFile(file)) {
      // This won't happen because button is disabled
      // unless file is an image
      alert(STRINGS.ERROR_IMAGE_ONLY);
      return null;
    }
    const newElement = createElement({ tag: "img", style, altText });
    insertAdj(getEditorContainerId(filePickerId), newElement, "afterend");
    scrollToNewElement(newElement);

    if (file) {
      newElement.src = await getDataURLFromFile(file);
    } else if (originalElement.src) {
      newElement.src = originalElement.src;
    } else {
      alert(STRINGS.ERROR_NO_IMAGE);
      return null;
    }

    newElement.addEventListener("click", imageEventListener);
    return newElement;
  }

  function addText({ editorId, tagName, alignSelectElement, text }) {
    const textAlign = getAlignValueFromFieldset(alignSelectElement);
    const style = textAlign === "default" ? {} : { textAlign };
    const newElement = createElement({
      tag: tagName,
      innerHTML: text,
      style,
    });
    insertAdj(getEditorContainerId(editorId), newElement, "afterend");
    scrollToNewElement(newElement);
    newElement.addEventListener("click", textEventListener);
    return newElement;
  }

  function addNewElement(type) {
    let elementType;
    let editCallback = textEventListener;
    if (type === EDITOR_TYPES.HEADING) {
      elementType = HEADING_ELEMENTS[1];
    } else if (type === EDITOR_TYPES.PARAGRAPH) {
      elementType = PARAGRAPH_ELEMENT;
    } else if (type === EDITOR_TYPES.IMAGE) {
      elementType = IMG_ELEMENT;
      editCallback = imageEventListener;
    }

    const newElement = createElement({ tag: elementType });
    if (type === EDITOR_TYPES.HEADING || type === EDITOR_TYPES.PARAGRAPH) {
      newElement.innerHTML = STRINGS.PLACEHOLDER_TEXT;
    }
    addAtEndOfDocument(newElement);
    scrollToNewElement(newElement);
    const fakeEvent = { currentTarget: newElement };
    editCallback(fakeEvent, false);
  }

  /* Page Metadata */
  function metaDataEditor(
    editElementId,
    mainElementId,
    secondaryElementIdArray,
    mainProperty = "content",
    secondaryProperty = "content"
  ) {
    const editElement = document.getElementById(editElementId);
    const mainElement = document.getElementById(mainElementId);
    editElement.value = mainElement[mainProperty];

    editElement.addEventListener("input", (event) => {
      const newValue = editElement.value;
      mainElement[mainProperty] = newValue;
      secondaryElementIdArray.forEach((element) => {
        document.getElementById(element)[secondaryProperty] = newValue;
      });
    });
  }

  metaDataEditor(
    PAGE_TITLE_INPUT_ID,
    "page-title",
    ["meta-title", "twitter-title"],
    "innerHTML"
  );

  metaDataEditor(PAGE_DESC_INPUT_ID, "page-description", [
    "meta-description",
    "twitter-description",
  ]);

  metaDataEditor(PAGE_LANG_INPUT_ID, "html-element", [], "lang");

  /* Save Changes */
  const handleSaveChanges = async function (_event) {
    localControls.remove();
    const htmlSourceCode = `
            <!DOCTYPE html>
            <html lang="${document.documentElement.lang}"  id="html-element">
              <head>
                ${document.head.innerHTML}
              </head>
              <body
                style="
                  background-color: ${getBodyBackgroundColor()};
                  text-align: ${document.body.style.textAlign};
                  align-items: ${document.body.style.alignItems};
                ">
                ${document.body.innerHTML}
              </body>
            </html>
          `;
    try {
      await saveFile(htmlSourceCode);
    } catch (error) {
      if (error?.message === "The user aborted a request.") {
        // Error is just cancel button
      } else {
        alert(error?.message ?? "Error saving file.");
      }
    }
    addLocalControls();
  };
  activate(SAVE_CHANGES_ID, handleSaveChanges, "click");

  // Chromium only
  // https://developer.mozilla.org/en-US/docs/Web/API/FileSystemWritableFileStream/write
  async function saveFile(data) {
    // create a new handle
    const newHandle = await window.showSaveFilePicker({
      startIn: "desktop",
      suggestedName: "index.html",
      types: [{ description: "HTML", accept: { "text/markdown": [".html"] } }],
    });
    // create a FileSystemWritableFileStream to write to
    const writableStream = await newHandle.createWritable();
    // write our file
    await writableStream.write(data);
    // close the file and write the contents to disk.
    await writableStream.close();
  }

  function createTextEditor({
    id,
    confirmButtonLabel,
    content,
    tagName,
    style,
  }) {
    let levelEditorId, editLevelLabel;
    const isHeading = HEADING_ELEMENTS.some((i) => i === tagName.toLowerCase());
    if (isHeading) {
      var editLevelElement = createElement({
        tag: "select",
        id: `level-${id}`,
        classList: [EDIT_CLASS],
      });
      HEADING_ELEMENTS.forEach((level) => {
        let headingLevelElement = createElement({
          tag: "option",
          innerHTML: level,
          value: level,
        });
        if (level.toLowerCase() === tagName) {
          headingLevelElement.selected = "selected";
        }
        editLevelElement.insertAdjacentElement(
          "beforeend",
          headingLevelElement
        );
      });
      editLevelLabel = createEditorLabel(
        levelEditorId,
        EDITOR_TYPES.HEADING_LEVEL
      );
    }

    const editorChangeListener = makeEditorChangeListener(
      id,
      confirmButtonLabel
    );

    let editElement = createElement({
      tag: "textarea",
      id,
      classList: [EDIT_CLASS],
      innerHTML: content,
      style: {
        minHeight: `${content.length / 65}rem`,
      },
    });
    editElement.addEventListener("input", editorChangeListener);

    const editAlignElement = createElement({
      tag: "fieldset",
      id: `align-${id}`,
      classList: [EDIT_CLASS],
    });
    editAlignElement.addEventListener("change", editorChangeListener);
    const alignLegend = createElement({
      tag: "legend",
      innerHTML: STRINGS.EDITOR_LABELS[EDITOR_TYPES.ALIGN],
    });
    editAlignElement.insertAdjacentElement("beforeend", alignLegend);
    const alignOptions = ["Right", "Center", "Left", "Default"];
    let foundCurrent = false;
    alignOptions.forEach((labelText, index, array) => {
      const container = createElement({ id: "cont", uniqueId: true });
      const value = labelText.toLowerCase();
      const input = createElement({
        tag: "input",
        id: `${editAlignElement.id}-option-${value}`,
        type: "radio",
        name: editAlignElement.id,
        value: value,
      });
      if (!foundCurrent && style.textAlign === labelText.toLowerCase()) {
        input.checked = true;
        foundCurrent = true;
      }
      const label = createEditorLabel(input.id, null, labelText);
      container.insertAdjacentElement("afterbegin", label);
      container.insertAdjacentElement("afterbegin", input);
      editAlignElement.insertAdjacentElement("afterbegin", container);
    });

    if (!foundCurrent) {
      editAlignElement.children[0].children[0].checked = true;
    }

    const editElementLabel = createEditorLabel(
      id,
      isHeading ? EDITOR_TYPES.HEADING : EDITOR_TYPES.PARAGRAPH
    );
    return {
      editor: editElement,
      editorLabel: editElementLabel,
      tagPicker: editLevelElement,
      tagPickerLabel: editLevelLabel,
      alignSelect: editAlignElement,
    };
  }

  function createImageEditor({
    id,
    confirmButtonLabel,
    altTextContent,
    style,
  }) {
    const editorChangeListener = makeEditorChangeListener(
      id,
      confirmButtonLabel
    );
    const imagePicker = createElement({
      tag: "input",
      type: "file",
      id,
      classList: [EDIT_CLASS],
    });
    imagePicker.addEventListener("change", editorChangeListener);
    const imagePickerLabel = createEditorLabel(id, EDITOR_TYPES.IMAGE);
    const altEditor = createElement({
      tag: "input",
      type: "text",
      id: `alt-text-${id}`,
      classList: [EDIT_CLASS],
      value: altTextContent ?? "",
    });
    altEditor.addEventListener("input", editorChangeListener);
    const altEditorLabel = createEditorLabel(
      altEditor.id,
      EDITOR_TYPES.IMAGE_ALT_TEXT
    );

    const editAlignElement = createElement({
      tag: "fieldset",
      id: `align-${id}`,
      classList: [EDIT_CLASS],
    });
    editAlignElement.addEventListener("change", editorChangeListener);
    const alignLegend = createElement({
      tag: "legend",
      innerHTML: STRINGS.EDITOR_LABELS[EDITOR_TYPES.ALIGN],
    });
    editAlignElement.insertAdjacentElement("beforeend", alignLegend);
    const alignOptions = ["Right", "Center", "Left", "Default"];
    let foundCurrent = false;
    alignOptions.forEach((labelText, index, array) => {
      const container = createElement();
      const value = labelText.toLowerCase();
      const input = createElement({
        tag: "input",
        value,
        id: `${editAlignElement.id}-option-${value}`,
        type: "radio",
        name: editAlignElement.id,
        value,
      });
      const { alignSelf } = style;
      if (
        (alignSelf === "flex-start" && labelText.toLowerCase() === "left") ||
        (alignSelf === "flex-end" && labelText.toLowerCase() === "right") ||
        alignSelf === labelText.toLowerCase()
      ) {
        input.checked = true;
        foundCurrent = true;
      }
      const label = createEditorLabel(input.id, null, labelText);
      container.insertAdjacentElement("afterbegin", label);
      container.insertAdjacentElement("afterbegin", input);
      editAlignElement.insertAdjacentElement("afterbegin", container);
    });

    if (!foundCurrent) {
      editAlignElement.children[0].children[0].checked = true;
    }

    return {
      editor: imagePicker,
      editorLabel: imagePickerLabel,
      altEditor,
      altEditorLabel,
      alignSelect: editAlignElement,
    };
  }

  function makeEditorChangeListener(id, confirmButtonLabel) {
    return function (event) {
      const updateButtonId = getButtonId(confirmButtonLabel, id);
      const updateButton = document.getElementById(updateButtonId);
      const { tagName: _tagName, type, files } = event.currentTarget;
      const tagName = _tagName.toLowerCase();
      const isParagraphEditor = tagName === "textarea";
      const isHeadingOrAltEditor = tagName === "input" && type === "text";
      const isImageEditor = tagName === "input" && type === "file";
      const isAlignEditor = tagName === "fieldset";
      if (isParagraphEditor) {
        // 🚸 TODO shouldn't be able to update if empty text but other branches here can enable it.
        // https://github.com/patrickweaver/website-editor/issues/86
        updateButton.disabled = !event.currentTarget.value;
      } else if (isImageEditor) {
        const validFile = isImageFile(files[0]);
        updateButton.disabled = !validFile;
        if (!validFile) {
          alert(STRINGS.ERROR_IMAGE_ONLY);
        }
      } else if (isHeadingOrAltEditor) {
        updateButton.disabled = false;
      } else if (isAlignEditor) {
        updateButton.disabled = false;
      }
    };
  }

  function createEditorLabel(editorId, type, text = null) {
    return createElement({
      tag: "label",
      innerHTML: STRINGS?.EDITOR_LABELS?.[type] ?? text,
      htmlFor: editorId,
      classList: [EDIT_CLASS],
    });
  }

  function onUpdateFaviconPicker(changeEvent) {
    const file = changeEvent.target.files[0];
    const validFile = isImageFile(file);

    const UPDATE_METHODS = {
      REMOVE: "removeEventListener",
      ADD: "addEventListener",
    };

    const updateButtons = [
      {
        id: CANCEL_FAVICON_UPDATE_ID,
        onClick: (clickEvent) => {
          updateHandler(true, UPDATE_METHODS.REMOVE);
        },
      },
      {
        id: CONFIRM_FAVICON_UPDATE_ID,
        onClick: (clickEvent) => {
          updateHandler(true, UPDATE_METHODS.REMOVE);
          insertFavicon(file);
        },
      },
    ];

    function updateHandler(disabled, method) {
      if (disabled) {
        changeEvent.target.value = "";
      }
      updateButtons.forEach((i) => {
        const button = document.getElementById(i.id);
        button.disabled = disabled;
        button[method]("click", i.onClick);
      });
    }

    updateHandler(!validFile, UPDATE_METHODS.ADD);

    if (!validFile) {
      alert(STRINGS.ERROR_IMAGE_ONLY);
      return null;
    }
  }

  async function insertFavicon(file) {
    const oldElement = document.querySelector(FAVICON_QUERY_SELECTOR);
    oldElement.remove();
    const newElement = createElement({ tag: "link" });
    const dataURL = await getDataURLFromFile(file);
    newElement.rel = "icon";
    newElement.href = dataURL;
    const faviconPreviewElement = document.getElementById(
      CURRENT_FAVICON_PREVIEW_ID
    );
    faviconPreviewElement.src = dataURL;
    document.getElementsByTagName("head")[0].appendChild(newElement);
    editingStateDirty = true;
  }

  function onUpdateSocialImage(inputEvent) {
    [
      { id: CURRENT_SOCIAL_IMAGE_ID, property: "content" },
      { id: CURRENT_TWITTER_IMAGE_ID, property: "content" },
      { id: CURRENT_SOCIAL_IMAGE_PREVIEW_ID, property: "src" },
    ].forEach(({ id, property }) => {
      const element = document.getElementById(id);
      element[property] = inputEvent.target.value;
    });
  }

  function onUpdateBackgroundColor(changeEvent) {
    document.body.style.backgroundColor = changeEvent.target.value;
    editingStateDirty = true;
  }

  function onUpdateFullWidth(changeEvent) {
    const fullWidth = event.target.checked;
    document.getElementById(WIDTH_SLIDER_ID).disabled = fullWidth;
    document.getElementById(UPDATE_BODY_ALIGN_ID).disabled = fullWidth;
    document.getElementById(WIDTH_SLIDER_CONTAINER_ID).style.display = fullWidth
      ? "none"
      : "block";
    document.getElementById(UPDATE_BODY_ALIGN_CONTAINER).style.display =
      fullWidth ? "none" : "block";
    let bodyWidth;
    let bodyMargin;
    if (fullWidth) {
      bodyWidth = "calc(100% - 4rem)";
      bodyMargin = "2rem";
      document.getElementById(WIDTH_SLIDER_VALUE_ID).innerHTML = "Disabled";
    } else {
      bodyWidth = `${document.getElementById(WIDTH_SLIDER_ID).value}px`;
      onUpdateBodyAlign();
      document.getElementById(WIDTH_SLIDER_VALUE_ID).innerHTML = bodyWidth;
    }

    document.body.style.width = bodyWidth;
    document.body.style.margin = bodyMargin;
  }

  function onUpdateWidth(inputEvent) {
    const value = `${event.target.value}px`;
    document.body.style.width = value;
    document.getElementById(WIDTH_SLIDER_VALUE_ID).innerHTML = value;
  }

  function onUpdateBodyAlign(_changeEvent) {
    const { value } = document.querySelector(
      "input[type='radio'][name='body-align']:checked"
    );
    if (value === "left") {
      document.body.style.margin = "2rem";
    } else if (value === "center") {
      document.body.style.margin = "2rem auto";
    }
  }

  function onUpdateBodyTextAlign(changeEvent) {
    const { value } = changeEvent.target;
    const flexClasses = {
      left: "flex-start",
      center: "center",
      right: "flex-end",
    };
    document.body.style.textAlign = value;
    document.body.style.alignItems = flexClasses[value];
    editingStateDirty = true;
  }

  function getAlignValueFromFieldset(alignSelectElement) {
    const selectedAlign = Array.from(alignSelectElement.children)
      .map((container) => Array.from(container.children)[0])
      .filter((element) => {
        return element?.checked;
      })[0];
    return selectedAlign?.value;
  }

  function handleUpdateImgElementAlign(value) {
    if (value === "default") {
      return {};
    } else {
      let flexValue = value;
      flexValue =
        value === "left"
          ? "flex-start"
          : value === "right"
          ? "flex-end"
          : value;
      return { alignSelf: flexValue };
    }
  }

  function getUniqueId(readableString) {
    return `${readableString}-${Math.random().toString().slice(2, 12)}`;
  }

  function createElement({
    tag = "div",
    id = null,
    uniqueId = false,
    classList = [],
    style = {},
    innerHTML = null,
    value = null,
    type = null,
    name = null,
    htmlFor = null,
    altText = null,
  } = {}) {
    const element = document.createElement(tag);
    if (id) {
      element.id = `${id}${uniqueId ? `-${getUniqueId()}` : ""}`;
    }
    classList.forEach((htmlClass) => element.classList.add(htmlClass));
    Object.keys(style).forEach((key) => (element.style[key] = style[key]));
    const properties = {
      innerHTML,
      value,
      type,
      name,
      htmlFor,
      alt: altText,
    };
    Object.keys(properties).forEach((p) => {
      if (properties[p] !== null) element[p] = properties[p];
    });
    return element;
  }

  function slugify(string) {
    return string.split(" ").join("-").toLowerCase();
  }

  function getEditorContainerId(editorId) {
    return `container-${editorId}`;
  }

  function getButtonId(label, editorId) {
    return `${slugify(label)}-${editorId}`;
  }

  function addAtEndOfDocument(element) {
    document
      .getElementById(END_OF_DOC_ID)
      .insertAdjacentElement("beforebegin", element);
  }

  function scrollToNewElement(element) {
    const elementTop = element.getBoundingClientRect().top;
    if (elementTop < 0) {
      const { scrollTop } = document.documentElement;
      const scrollTo = elementTop + scrollTop - 20;
      window.scrollTo(0, scrollTo < 0 ? 0 : scrollTo);
    }
  }

  function addLinkAroundSelection(selectableInput) {
    const { selectionStart: start, selectionEnd: end, value } = selectableInput;
    if (start === end) {
      alert(STRINGS.ERROR_NO_SELECTION);
      return value;
    }
    const selection = value.substring(start, end);
    const url = window.prompt(STRINGS.PROMPT_LINK_URL);
    return `${value.slice(
      0,
      start
    )}<a href="${url}" target="_blank">${selection}</a>${value.slice(
      end,
      value.length
    )}`;
  }

  function getBodyBackgroundColor() {
    return rgb2hex(
      document.body?.style?.backgroundColor ?? "rgb(255, 255, 255)"
    );
  }

  // https://stackoverflow.com/questions/1740700/how-to-get-hex-color-value-rather-than-rgb-value
  // Hex is needed for <input type="color" />
  function rgb2hex(rgb) {
    return `#${rgb
      .match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)
      .slice(1)
      .map((n) => parseInt(n, 10).toString(16).padStart(2, "0"))
      .join("")}`;
  }

  function isImageFile(file) {
    if (!file.type.startsWith("image/")) {
      return false;
    }
    return true;
  }

  async function getDataURLFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
