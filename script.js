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
  const ADD_ITEM_ID = "add-item";
  const ADD_ITEM_HEADING_ID = "add-item-heading";
  const ADD_ITEM_IMAGE_ID = "add-item-image";
  const ADD_ITEM_PARAGRAPH_ID = "add-item-paragraph";
  const CURRENT_FAVICON_PREVIEW_ID = "current-favicon-preview";
  const UPDATE_FAVICON_ID = "update-favicon";
  const CANCEL_FAVICON_UPDATE_ID = "cancel-favicon-update";
  const CONFIRM_FAVICON_UPDATE_ID = "confirm-favicon-update";
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
    PARAGRAPH: "paragraph",
    IMAGE: "image",
  };

  const STRINGS = {
    BUTTON_CANCEL: "Cancel",
    BUTTON_UPDATE: "Update",
    ERROR_IMAGE_ONLY: "Error: Please choose an image file",
    EDITOR_LABELS: {
      [EDITOR_TYPES.PARAGRAPH]: "Edit paragraph",
      [EDITOR_TYPES.HEADING]: "Edit heading",
      [EDITOR_TYPES.IMAGE]: "Select an image",
    },
    PLACEHOLDER_TEXT: "Your text here",
  };

  const NEW_CONTENT_MODAL_HTML = `
          <div id="new-content-modal">
            <h2>Add New Content</h2>
            <ul>
              <li><button id="${ADD_ITEM_HEADING_ID}">Heading</button></li>
              <li><button id="${ADD_ITEM_PARAGRAPH_ID}">Text</button></li>
              <li><button><label class="label-button" for="${ADD_ITEM_IMAGE_ID}">Image</label><input type="file" id="${ADD_ITEM_IMAGE_ID}" style="display: none" /></button></li>
            </ul>
            <button>Cancel</button>
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
            <h4>Social Media Metadata</h4>
            <label for="edit-page-title">Page Title: </label>
            <input type="text" id="edit-page-title" />
            <label for="edit-page-description">Page Description</label>
            <textarea id="edit-page-description" style="min-height: 2rem"></textarea>
          </div>

          <div class="controls-section">
            <h3>Save Changes</h3>
            <button id="save-changes">Save All Changes to Local File</button>
          </div>
        `;

  function makeElementEventListener(editorType) {
    return function (event) {
      const element = event.target;

      const originalDisplay = element.style.display;
      element.style.display = "none";
      const originalContent = element.innerHTML;

      const cancelButton = {
        label: STRINGS.BUTTON_CANCEL,
        initiallyDisabled: false,
        updateElement: (_) => true,
      };

      const updateTextButton = {
        label: STRINGS.BUTTON_UPDATE,
        initiallyDisabled: false,
        updateElement: (editorElement, originalElement) => {
          const newContent = editorElement.value;
          if (!newContent) return false;
          originalElement.innerHTML = editorElement.value;
          return true;
        },
      };

      const upateImageButton = {
        label: STRINGS.BUTTON_UPDATE,
        initiallyDisabled: true,
        updateElement: (imagePicker, originalElement) => {
          const newImage = addImage({
            filePickerId: imagePicker.id,
            update: true,
          });
          if (!newImage) return false;
          element.remove();
          return true;
        },
      };

      let types = {
        text: {
          idReadableString: TEXT_EDITOR_ID_READABLE_STRING,
          controls: [cancelButton, updateTextButton],
          createEditor: createTextEditor,
        },
        [EDITOR_TYPES.IMAGE]: {
          idReadableString: IMAGE_PICKER_ID_READABLE_STRING,
          controls: [cancelButton, upateImageButton],
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
        originalContent
      );

      let buttonsContainerElement = createElement("div");
      buttonsContainerElement.classList.add(EDIT_BUTTONS_CLASS);

      let editorContainerElement = createElement("div");
      editorContainerElement.classList.add(EDIT_CONTAINER_CLASS);

      type.controls.forEach((i) => {
        let buttonElement = createElement("button");
        buttonElement.id = getButtonId(i.label, editorId);
        buttonElement.disabled = i.initiallyDisabled;
        buttonElement.innerHTML = i.label;
        buttonsContainerElement.insertAdjacentElement(
          "beforeend",
          buttonElement
        );
        buttonElement.addEventListener("click", function (_event) {
          const success = i.updateElement(editElements[1], element);
          if (success) {
            editorContainerElement.remove();
            element.style.display = originalDisplay;
          }
        });
      });

      element.insertAdjacentElement("beforebegin", editorContainerElement);
      [...editElements, buttonsContainerElement].forEach((editorElement) => {
        editorContainerElement.insertAdjacentElement(
          "beforeend",
          editorElement
        );
      });
    };
  }

  /*
   * Activate existing elements for editing
   */

  // Headings
  document.querySelectorAll(HEADING_ELEMENTS.join(", ")).forEach((element) => {
    element.addEventListener(
      "click",
      makeElementEventListener(EDITOR_TYPES.HEADING)
    );
  });

  // Paragraph
  document.querySelectorAll(PARAGRAPH_ELEMENT).forEach((element) => {
    element.addEventListener(
      "click",
      makeElementEventListener(EDITOR_TYPES.PARAGRAPH)
    );
  });

  // Image
  document.querySelectorAll("img").forEach((element) => {
    element.addEventListener(
      "click",
      makeElementEventListener(EDITOR_TYPES.IMAGE)
    );
  });

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

    document.getElementById(ADD_ITEM_ID).addEventListener("click", preAddItem);
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

  function preAddItem() {
    let newContentModal = createElement("div");
    newContentModal.id = NEW_CONTENT_MODAL_WRAPPER;
    newContentModal.innerHTML = NEW_CONTENT_MODAL_HTML;

    document.body.insertAdjacentElement("beforeend", newContentModal);

    const addItemButtonIds = [ADD_ITEM_HEADING_ID, ADD_ITEM_PARAGRAPH_ID];

    addItemButtonIds.forEach((buttonId) => {
      document.getElementById(buttonId).addEventListener("click", (event) => {
        addTextItem(
          event.target.id.slice(
            // 🚸 This is fragile with the strings coming from the constants above.
            "add-item-".length,
            event.target.id.length
          )
        );
        document.getElementById(NEW_CONTENT_MODAL_WRAPPER).remove();
      });
    });

    document
      .getElementById(ADD_ITEM_IMAGE_ID)
      .addEventListener("change", () => {
        addImage({ filePickerId: ADD_ITEM_IMAGE_ID });
        document.getElementById(NEW_CONTENT_MODAL_WRAPPER).remove();
      });
  }

  function addImage({ filePickerId, update = false }) {
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
      document
        .getElementById(END_OF_DOC_ID)
        .insertAdjacentElement("beforebegin", newElement);
    }

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

    if (type === EDITOR_TYPES.HEADING || type === EDITOR_TYPES.PARAGRAPH) {
      newElement.innerHTML = STRINGS.PLACEHOLDER_TEXT;

      document
        .getElementById(END_OF_DOC_ID)
        .insertAdjacentElement("beforebegin", newElement);

      newElement.addEventListener("click", makeElementEventListener(type));
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
    "edit-page-title",
    "page-title",
    ["meta-title", "twitter-title"],
    "innerHTML"
  );

  metaDataEditor("edit-page-description", "page-description", [
    "meta-description",
    "twitter-description",
  ]);

  /*
   *   Save Changes
   */

  document
    .getElementById("save-changes")
    .addEventListener("click", function (_event) {
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
      saveFile(htmlSourceCode);

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

  function createTextEditor(id, type, content) {
    let editElement = createElement("textarea");
    editElement.id = id;
    editElement.classList.add(EDIT_CLASS);
    editElement.innerHTML = content;
    editElement.addEventListener("input", makeUpdateButtonListener(id));
    const editElementLabel = createEditorLabel(id, type);
    return [editElementLabel, editElement];
  }

  function createImageEditor(id, type, _content) {
    const imagePicker = createElement("input");
    imagePicker.type = "file";
    imagePicker.id = id;
    imagePicker.classList.add(EDIT_CLASS);
    imagePicker.addEventListener("change", makeUpdateButtonListener(id));
    const imagePickerLabel = createEditorLabel(id, type);
    return [imagePickerLabel, imagePicker];
  }

  function makeUpdateButtonListener(id) {
    return function (event) {
      const updateButtonId = getButtonId(STRINGS.BUTTON_UPDATE, id);
      const updateButton = document.getElementById(updateButtonId);
      const { tagName, type, files } = event.target;
      if (tagName === "TEXTAREA") {
        updateButton.disabled = !event.target.value;
      } else if (tagName === "INPUT" && type === "file") {
        updateButton.disabled = !isImageFile(files[0]);
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
    return `${readableString}-${Math.random()}`;
  }

  function createElement(type) {
    return document.createElement(type);
  }

  function slugify(string) {
    return string.split(" ").join("-").toLowerCase();
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
}
