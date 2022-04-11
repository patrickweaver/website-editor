const DEV_MODE = false;
var editingStateDirty = false;

/*
 *   Check for local file:
 */

const protocol = window.location.protocol;
if (protocol === "file:") {
  localEditingMode();
}

/*
 *   Editng JavaScript only runs locally:
 */

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
  const SAVE_CHANGES_ID = "save-changes";
  const CLONE_CLASS = "clone";
  const CLONE_CONTAINER_CLASS = "clone-container";
  const EDIT_CLASS = "edit";
  const EDIT_CONTAINER_CLASS = "edit-container";
  const EDIT_BUTTONS_CLASS = "edit-buttons";
  const TEXT_EDITOR_ID_READABLE_STRING = "text-editor";
  const IMAGE_PICKER_ID_READABLE_STRING = "image-picker";
  const END_OF_DOC_ID = "end-of-document";
  const LOCAL_CONTROLS_ID = "local-controls";
  const NEW_CONTENT_MODAL_WRAPPER = "new-content-modal-wrapper";
  const HEADING_ELEMENTS = ["h1", "h2", "h3", "h4", "h5", "h6"];
  const PARAGRAPH_ELEMENT = "p";

  const EDITOR_TYPES = {
    TEXT: "text",
    HEADING: "heading",
    HEADING_LEVEL: "heading-level",
    PARAGRAPH: "paragraph",
    IMAGE: "image",
  };

  const STRINGS = {
    BUTTON_CANCEL: "Cancel",
    BUTTON_DELETE: "Delete",
    BUTTON_LINK: "Make Link From Selection",
    BUTTON_SAVE: "Save",
    BUTTON_UPDATE: "Update",
    CONFIRM_DELETE: "Are you sure you want to delete this element?",
    ERROR_IMAGE_ONLY: "Error: Please choose an image file",
    ERROR_NO_SELECTION: "Error: Nothing selected",
    EDITOR_LABELS: {
      [EDITOR_TYPES.PARAGRAPH]: "Edit paragraph text",
      [EDITOR_TYPES.HEADING]: "Edit heading text",
      [EDITOR_TYPES.HEADING_LEVEL]: "Edit heading level",
      [EDITOR_TYPES.IMAGE]: "Select an image",
    },
    PLACEHOLDER_TEXT: "Your text here",
    PROMPT_LINK_URL: "URL:",
  };

  const NEW_CONTENT_MODAL_HTML = `
          <div id="new-content-modal">
            <h2>Add New Content</h2>
            <ul>
              <li><button id="${ADD_ITEM_HEADING_ID}">Heading</button></li>
              <li><button id="${ADD_ITEM_PARAGRAPH_ID}">Paragraph</button></li>
              <li><button><label class="label-button" for="${ADD_ITEM_IMAGE_ID}">Image</label><input type="file" id="${ADD_ITEM_IMAGE_ID}" style="display: none" /></button></li>
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
            <input type="text" id="${PAGE_TITLE_INPUT_ID}" />
            <label for="${PAGE_DESC_INPUT_ID}">Page Description</label>
            <textarea id="${PAGE_DESC_INPUT_ID}" style="min-height: 2rem"></textarea>
            <label for="${PAGE_LANG_INPUT_ID}">Page Language</label>
            <input type="text" id="${PAGE_LANG_INPUT_ID}" value="en" />
            <label for="edit-page-langauge" class="below-label">See list of valid language tags <a href="https://en.wikipedia.org/wiki/IETF_language_tag#List_of_subtags" target="_blank">here</a>.
          </div>

          <div class="controls-section">
            <h4>Favicon</h4>
            <figure id="favicon-preview">
              <figcaption>Current Favicon:</figcaption>  
              <img id="${CURRENT_FAVICON_PREVIEW_ID}" src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='0.9em' font-size='90'>📓</text></svg>"
              alt="The current favicon">
            </figure>
            <label for="${UPDATE_FAVICON_ID}">Update Favicon</label>
            <input id="${UPDATE_FAVICON_ID}" type="file" />
            <div class="${EDIT_BUTTONS_CLASS}">
              <button id="${CANCEL_FAVICON_UPDATE_ID}" disabled>${STRINGS.BUTTON_CANCEL}</button>
              <button id="${CONFIRM_FAVICON_UPDATE_ID}" disabled>${STRINGS.BUTTON_UPDATE}</button>
            </div>
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
      const { tagName: _tagName, innerHTML: originalContent } = element;
      const tagName = _tagName.toLowerCase();

      const deleteButton = {
        label: STRINGS.BUTTON_DELETE,
        initiallyDisabled: false,
        updateElement: (editorElement, _, originalElement) => {
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
        updateElement: (_) => true,
      };

      const linkButton = {
        label: STRINGS.BUTTON_LINK,
        initiallyDisabled: false,
        updateElement: (
          _editorElement,
          _tagNameSelect,
          _originalElement,
          editorId
        ) => {
          const selectableInput = document.getElementById(editorId);
          selectableInput.value = addLinkAroundSelection(selectableInput);
        },
      };

      const updateButtonLabel = isExistingElement
        ? STRINGS.BUTTON_UPDATE
        : STRINGS.BUTTON_SAVE;

      const updateTextButton = {
        label: updateButtonLabel,
        initiallyDisabled: false,
        updateElement: (editorElement, tagNameSelect, originalElement) => {
          let updatedElement = originalElement;
          const newContent = editorElement.value;
          if (!newContent) return false;
          const tagChanged =
            tagNameSelect && tagName !== tagNameSelect.value.toLowerCase();
          if (tagChanged) {
            updatedElement = createElement(tagNameSelect.value);
            originalElement.insertAdjacentElement(
              "beforebegin",
              updatedElement
            );
            originalElement.remove();
            activateHeading(updatedElement);
          }
          const contentChanged = newContent !== originalContent;
          updatedElement.innerHTML = newContent;
          editingStateDirty = editingStateDirty || tagChanged || contentChanged;
          return true;
        },
      };

      const upateImageButton = {
        label: updateButtonLabel,
        initiallyDisabled: true,
        updateElement: (imagePicker) => {
          const newImage = addImage(imagePicker.id);
          if (!newImage) return false;
          element.remove();
          editingStateDirty = true;
          return true;
        },
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

      const editorId = uniqueId(type.idReadableString);

      const editElements = type.createEditor(
        editorId,
        editorType,
        updateButtonLabel,
        originalContent,
        tagName
      );
      const [editor, _e, tagPicker, _t] = editElements;

      let buttonsContainerElement = createElement("div");
      buttonsContainerElement.classList.add(EDIT_BUTTONS_CLASS);

      let editorContainerElement = createElement("div");
      editorContainerElement.classList.add(EDIT_CONTAINER_CLASS);
      editorContainerElement.id = getEditorContainerId(editorId);

      if (isExistingElement) {
        const elementCloneContainer = createElement("div");
        elementCloneContainer.classList.add(CLONE_CONTAINER_CLASS);

        elementCloneContainer.insertAdjacentElement("beforeend", elementClone);

        editorContainerElement.insertAdjacentElement(
          "beforeend",
          elementCloneContainer
        );

        const elementCloneLabel = createElement("label");
        elementCloneLabel.innerHTML = "Original Element:";
        elementCloneContainer.insertAdjacentElement(
          "beforebegin",
          elementCloneLabel
        );
      }

      type.controls.forEach((i) => {
        let buttonElement = createElement("button");
        buttonElement.classList.add(`${slugify(i.label)}-button`);
        buttonElement.id = getButtonId(i.label, editorId);
        buttonElement.disabled = i.initiallyDisabled;
        buttonElement.innerHTML = i.label;
        buttonsContainerElement.insertAdjacentElement(
          "beforeend",
          buttonElement
        );
        buttonElement.addEventListener("click", function (_event) {
          const success = i.updateElement(editor, tagPicker, element, editorId);
          if (success) {
            editorContainerElement.remove();
            element.style.display = originalDisplay;
          }
        });
      });

      element.insertAdjacentElement("beforebegin", editorContainerElement);
      // Reverse so labels are placed above inputs
      const editElementsReversed = [...editElements].reverse();
      [...editElementsReversed, buttonsContainerElement].forEach(
        (editorElement) => {
          if (!editorElement) return;
          editorContainerElement.insertAdjacentElement(
            "beforeend",
            editorElement
          );
        }
      );

      editor.focus();
      editor.select();
    };
  }

  /*
   * Activate existing elements for editing
   */

  function makeActivator(type) {
    return function (element) {
      element.addEventListener("click", makeElementEventListener(type));
    };
  }

  // Headings
  function activateHeading(element) {
    makeActivator(EDITOR_TYPES.HEADING)(element);
  }
  document
    .querySelectorAll(HEADING_ELEMENTS.join(", "))
    .forEach(activateHeading);

  // Paragraph
  function activateParagraph(element) {
    makeActivator(EDITOR_TYPES.PARAGRAPH)(element);
  }
  document.querySelectorAll(PARAGRAPH_ELEMENT).forEach(activateParagraph);

  // Image
  function activateImage(element) {
    makeActivator(EDITOR_TYPES.IMAGE)(element);
  }
  document.querySelectorAll("img").forEach(activateImage);

  /*
   * Page Controls:
   */

  let localControls = createElement("div");
  localControls.id = LOCAL_CONTROLS_ID;
  localControls.innerHTML = LOCAL_CONTROLS_HTML;

  function addLocalControls() {
    document
      .getElementById(END_OF_DOC_ID)
      .insertAdjacentElement("afterend", localControls);

    document
      .getElementById(ADD_ITEM_ID)
      .addEventListener("click", showNewContentModal);

    window.addEventListener("beforeunload", function (event) {
      if (!DEV_MODE && editingStateDirty) {
        event.preventDefault();
        event.returnValue = "";
      }
    });
  }

  addLocalControls();

  /*
   * Activate Controls
   */

  document
    .getElementById(UPDATE_FAVICON_ID)
    .addEventListener("change", onUpdateFaviconPicker);

  /*
   *   Add Content
   */

  function showNewContentModal() {
    let newContentModal = createElement("div");
    newContentModal.id = NEW_CONTENT_MODAL_WRAPPER;
    newContentModal.innerHTML = NEW_CONTENT_MODAL_HTML;

    document
      .getElementById(LOCAL_CONTROLS_ID)
      .insertAdjacentElement("beforeend", newContentModal);

    function clearAddItemModal() {
      document.getElementById(NEW_CONTENT_MODAL_WRAPPER).remove();
    }

    // Heading and Paragraph buttons
    const addTextItemButtonIds = [ADD_ITEM_HEADING_ID, ADD_ITEM_PARAGRAPH_ID];
    addTextItemButtonIds.forEach((buttonId) => {
      document.getElementById(buttonId).addEventListener("click", (event) => {
        addTextItem(
          event.currentTarget.id.slice(
            ADD_ITEM_ID_PREFIX.length,
            event.currentTarget.id.length
          )
        );
        clearAddItemModal();
      });
    });

    // Image Button
    document
      .getElementById(ADD_ITEM_IMAGE_ID)
      .addEventListener("change", () => {
        addImage(ADD_ITEM_IMAGE_ID);
        clearAddItemModal();
      });

    // cancel Button
    document
      .getElementById(ADD_ITEM_CANCEL_ID)
      .addEventListener("click", clearAddItemModal);
  }

  function addImage(filePickerId) {
    const update = filePickerId !== ADD_ITEM_IMAGE_ID;
    const filePicker = document.getElementById(filePickerId);
    const file = filePicker.files[0];
    // This won't happen because button is disabled
    // unless file is an image
    if (!isImageFile(file)) {
      alert(STRINGS.ERROR_IMAGE_ONLY);
      return null;
    }
    const newElement = createElement("img");
    newElement.file = file;
    if (update) {
      // Add image above current image
      filePicker.parentElement.insertAdjacentElement("afterend", newElement);
    } else {
      // Add image at the end of the document
      addAtEndOfDocument(newElement);
    }
    highlightNewElement(newElement);

    // Set img src to file contents as Data URL
    const reader = new FileReader();
    reader.onload = ((aImg) => {
      return (e) => {
        aImg.src = e.target.result;
      };
    })(newElement);
    reader.readAsDataURL(file);

    newElement.addEventListener(
      "click",
      makeElementEventListener(EDITOR_TYPES.IMAGE)
    );
    return newElement;
  }

  function addTextItem(type) {
    let elementType;
    if (type === EDITOR_TYPES.HEADING) {
      elementType = HEADING_ELEMENTS[1];
    } else if (type === EDITOR_TYPES.PARAGRAPH) {
      elementType = PARAGRAPH_ELEMENT;
    }

    const newElement = createElement(elementType);

    const editCallback = makeElementEventListener(type);
    if (type === EDITOR_TYPES.HEADING || type === EDITOR_TYPES.PARAGRAPH) {
      newElement.innerHTML = STRINGS.PLACEHOLDER_TEXT;

      addAtEndOfDocument(newElement);
      highlightNewElement(newElement);

      newElement.addEventListener("click", editCallback);
      const fakeEvent = { currentTarget: newElement };
      editCallback(fakeEvent, false);
    }
  }

  /*
   *   Page Metadata
   */

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

  /*
   *   Save Changes
   */

  document
    .getElementById(SAVE_CHANGES_ID)
    .addEventListener("click", async function (_event) {
      // Remove local controls:
      localControls.remove();

      const htmlSourceCode = `
            <!DOCTYPE html>
            <html lang="en">
              <head>
                ${document.head.innerHTML}
              </head>
              <body>
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
      // Re-add local controls
      addLocalControls();
    });

  // Chromium only
  // https://developer.mozilla.org/en-US/docs/Web/API/FileSystemWritableFileStream/write
  async function saveFile(data) {
    // create a new handle
    const newHandle = await window.showSaveFilePicker({
      startIn: "desktop",
      suggestedName: "index.html",
      types: [
        {
          description: "HTML",
          accept: {
            "text/markdown": [".html"],
          },
        },
      ],
    });

    // create a FileSystemWritableFileStream to write to
    const writableStream = await newHandle.createWritable();

    // write our file
    await writableStream.write(data);

    // close the file and write the contents to disk.
    await writableStream.close();
  }

  function createTextEditor(id, type, confirmButtonLabel, content, tagName) {
    let levelEditorId, editLevelLabel;
    if (type === EDITOR_TYPES.HEADING) {
      levelEditorId = `level-${id}`;
      var editLevelElement = createElement("select");
      HEADING_ELEMENTS.forEach((level) => {
        let headingLevelElement = createElement("option");
        headingLevelElement.innerHTML = level;
        headingLevelElement.value = level;
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

    let editElement = createElement("textarea");
    editElement.id = id;
    editElement.classList.add(EDIT_CLASS);
    editElement.innerHTML = content;
    editElement.addEventListener(
      "input",
      makeEditorChangeListener(id, confirmButtonLabel)
    );

    const editElementLabel = createEditorLabel(id, type);
    return [editElement, editElementLabel, editLevelElement, editLevelLabel];
  }

  function createImageEditor(id, type, confirmButtonLabel, _content) {
    const imagePicker = createElement("input");
    imagePicker.type = "file";
    imagePicker.id = id;
    imagePicker.classList.add(EDIT_CLASS);
    imagePicker.addEventListener(
      "change",
      makeEditorChangeListener(id, confirmButtonLabel)
    );
    const imagePickerLabel = createEditorLabel(id, type);
    return [imagePicker, imagePickerLabel];
  }

  function makeEditorChangeListener(id, confirmButtonLabel) {
    return function (event) {
      const updateButtonId = getButtonId(confirmButtonLabel, id);
      const updateButton = document.getElementById(updateButtonId);
      const { tagName: _tagName, type, files } = event.currentTarget;
      const tagName = _tagName.toLowerCase();
      if (tagName === "textarea" && updateButton) {
        updateButton.disabled = !event.currentTarget.value;
      } else if (tagName === "input" && type === "file") {
        const validFile = isImageFile(files[0]);
        updateButton.disabled = !validFile;
        if (!validFile) {
          alert(STRINGS.ERROR_IMAGE_ONLY);
        }
      }
    };
  }

  function createEditorLabel(editorId, type) {
    let editElementLabel = createElement("label");
    editElementLabel.innerHTML = STRINGS.EDITOR_LABELS[type];
    editElementLabel.htmlFor = editorId;
    editElementLabel.classList.add(EDIT_CLASS);
    return editElementLabel;
  }

  function onUpdateFaviconPicker(changeEvent) {
    const file = changeEvent.target.files[0];
    const validFile = isImageFile(file);

    const UPDATE_METHODS = {
      REMOVE: "removeEventListener",
      ADD: "addEventListener",
    };

    const faviconUpdateButtons = [
      {
        id: CANCEL_FAVICON_UPDATE_ID,
        onClick: (clickEvent) => {
          updateFaviconUpdateButtons(true, UPDATE_METHODS.REMOVE);
        },
      },
      {
        id: CONFIRM_FAVICON_UPDATE_ID,
        onClick: (clickEvent) => {
          updateFaviconUpdateButtons(true, UPDATE_METHODS.REMOVE);
          onConfirmUpdateFavicon(file);
        },
      },
    ];

    function updateFaviconUpdateButtons(disabled, method) {
      if (disabled) {
        changeEvent.target.value = "";
      }
      faviconUpdateButtons.forEach((i) => {
        const button = document.getElementById(i.id);
        button.disabled = disabled;
        button[method]("click", i.onClick);
      });
    }

    updateFaviconUpdateButtons(!validFile, UPDATE_METHODS.ADD);

    if (!validFile) {
      alert(STRINGS.ERROR_IMAGE_ONLY);
      return null;
    }
  }

  function onConfirmUpdateFavicon(file) {
    let oldLink = document.querySelector("link[rel~='icon']");
    oldLink.remove();
    let link = document.createElement("link");
    link.rel = "icon";
    link.file = file;

    // Set img src to file contents as Data URL
    const reader = new FileReader();
    reader.onload = ((aLink) => {
      return (e) => {
        aLink.href = e.target.result;
        document.getElementById(CURRENT_FAVICON_PREVIEW_ID).src =
          e.target.result;
      };
    })(link);
    reader.readAsDataURL(file);

    document.getElementsByTagName("head")[0].appendChild(link);
  }

  function uniqueId(readableString) {
    return `${readableString}-${Math.random().toString().slice(2, 12)}`;
  }

  function createElement(type) {
    return document.createElement(type);
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

  function isImageFile(file) {
    if (!file.type.startsWith("image/")) {
      return false;
    }
    return true;
  }

  function addAtEndOfDocument(element) {
    document
      .getElementById(END_OF_DOC_ID)
      .insertAdjacentElement("beforebegin", element);
  }

  function highlightNewElement(element) {
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
}
