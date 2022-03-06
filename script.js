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
  const EDIT_CLASS = "edit";
  const EDIT_CONTAINER_CLASS = "edit-container";
  const EDIT_BUTTONS_CLASS = "edit-buttons";
  const TEXT_EDITOR_ID_READABLE_STRING = "text-editor";
  const IMAGE_CONTAINER_CLASS = "image-container";
  const IMAGE_PICKER_ID_READABLE_STRING = "image-picker";
  const END_OF_DOC_ID = "end-of-document";
  const LOCAL_CONTROLS_ID = "local-controls";
  const NEW_CONTENT_MODAL_WRAPPER = "new-content-modal-wrapper";
  const EDITABLE_TEXT_ELEMENTS = ["h1", "h2", "h3", "h4", "h5", "h6", "p"].join(
    ", "
  );

  const EDITOR_TYPES = {
    TEXT: "text",
    IMAGE: "image",
  };

  const STRINGS = {
    BUTTON_CANCEL: "Cancel",
    BUTTON_UPDATE: "Update",
    ERROR_IMAGE_ONLY: "Error: Please choose an image file",
    LABEL_IMAGE_PICKER: "Choose a new image",
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

          <div class="controls-section">
            <h3>Social Media Metadata</h3>
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
      const originalContent = element.innerHTML;

      const cancelButton = {
        label: STRINGS.BUTTON_CANCEL,
        getNewContent: (_) => originalContent,
      };

      const updateButton = {
        label: STRINGS.BUTTON_UPDATE,
        getNewContent: (element) => element.value,
      };

      const types = {
        text: {
          idReadableString: TEXT_EDITOR_ID_READABLE_STRING,
          controls: [updateButton, cancelButton],
          createEditor: createEditTextElement,
        },
        image: {
          idReadableString: IMAGE_PICKER_ID_READABLE_STRING,
          controls: [cancelButton],
          createEditor: createEditImageElements,
        },
      };
      const type = types[editorType];

      const editorId = uniqueId(type.idReadableString);

      const editElement = type.createEditor(editorId, originalContent);
      element.parentElement.insertBefore(editElement, element);

      element.style.display = "none";
      let buttonsContainerElement = document.createElement("div");
      buttonsContainerElement.classList.add(EDIT_BUTTONS_CLASS);

      type.controls.forEach((i) => {
        let buttonElement = document.createElement("button");
        buttonElement.innerHTML = i.label;
        buttonsContainerElement.insertAdjacentElement(
          "afterbegin",
          buttonElement
        );
        buttonElement.addEventListener("click", function (_event) {
          element.innerHTML = i.getNewContent(editElement);
          editElement.remove();
          buttonsContainerElement.remove();
          element.style.display = originalDisplay;
        });
      });
      element.parentElement.insertBefore(buttonsContainerElement, element);
    };
  }

  function imageElementListener(event) {
    const element = event.target;
    const originalDisplay = element.style.display;
    const imagePickerId = uniqueId(IMAGE_PICKER_ID_READABLE_STRING);
    let newElements = createEditImageElements(imagePickerId);

    element.style.display = "none";

    const controls = [
      {
        label: STRINGS.BUTTON_CANCEL,
        getNewContent: (_) => content,
      },
    ];

    let buttonsContainerElement = document.createElement("div");
    buttonsContainerElement.classList.add(EDIT_BUTTONS_CLASS);
    insertElements(element, [...newElements, buttonsContainerElement]);

    insertEditorControls(
      element,
      originalDisplay,
      buttonsContainerElement,
      controls,
      newElements
    );
    containerElement.parentElement.classList.add(EDIT_CONTAINER_CLASS);
  }

  // Text
  document.querySelectorAll(EDITABLE_TEXT_ELEMENTS).forEach(function (element) {
    //element.addEventListener("click", textElementListener);
    element.addEventListener(
      "click",
      makeElementEventListener(EDITOR_TYPES.TEXT)
    );
  });

  // Image
  document.querySelectorAll("img").forEach(function (element) {
    element.addEventListener("click", imageElementListener);
  });

  /*
   * Page Controls:
   */

  let localControls = document.createElement("div");
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
   *   Add Content
   */

  function preAddItem() {
    let newContentModal = document.createElement("div");
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
      });
    });

    document
      .getElementById(ADD_ITEM_IMAGE_ID)
      .addEventListener("change", () =>
        addImage({ filePickerId: ADD_ITEM_IMAGE_ID })
      );
  }

  function addImage({ filePickerId, update = false }) {
    const filePicker = document.getElementById(filePickerId);
    const file = filePicker.files[0];
    if (!file.type.startsWith("image/")) {
      alert(STRINGS.ERROR_IMAGE_ONLY);
      return;
    }
    const imageContainer = document.createElement("div");
    imageContainer.classList.add(IMAGE_CONTAINER_CLASS);
    const newElement = document.createElement("img");
    newElement.file = file;
    // Add imageContainer to end of current document
    document
      .getElementById(END_OF_DOC_ID)
      .insertAdjacentElement("beforebegin", imageContainer);
    // Add img element inside imageContainer
    imageContainer.insertAdjacentElement("afterbegin", newElement);
    // Set img src to file contents as Data URL
    const reader = new FileReader();
    reader.onload = ((aImg) => {
      return (e) => {
        aImg.src = e.target.result;
      };
    })(newElement);
    reader.readAsDataURL(file);
    // Remove new
    if (!update) {
      document.getElementById(NEW_CONTENT_MODAL_WRAPPER).remove();
    }

    newElement.addEventListener("click", imageElementListener);
  }

  function addTextItem(type) {
    let elementType;
    if (type === "heading") {
      elementType = "h2";
    } else if (type === "paragraph") {
      elementType = "p";
    }

    const newElement = document.createElement(elementType);

    if (type === "heading" || type === "paragraph") {
      newElement.innerHTML = STRINGS.PLACEHOLDER_TEXT;

      document
        .getElementById(END_OF_DOC_ID)
        .insertAdjacentElement("beforebegin", newElement);

      //newElement.addEventListener("click", textElementListener);
      newElement.addEventListener(
        "click",
        makeElementEventListener(EDITOR_TYPES.TEXT)
      );

      document.getElementById(NEW_CONTENT_MODAL_WRAPPER).remove();
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
    .addEventListener("click", function (event) {
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

  function insertElements(elementBelow, elementsArray) {
    elementsArray.forEach((element) => {
      elementBelow.insertAdjacentElement("beforebegin", element);
    });
  }

  function insertEditorControls(
    imageElement,
    originalDisplay,
    containerElement,
    controls,
    newElements
  ) {
    function clearUpdateImageUI() {
      containerElement.parentElement.remove();
    }

    controls.forEach((i) => {
      let buttonElement = document.createElement("button");
      buttonElement.innerHTML = i.label;
      containerElement.insertAdjacentElement("afterbegin", buttonElement);
      buttonElement.addEventListener("click", function (event) {
        clearUpdateImageUI();
        imageElement.style.display = originalDisplay;
      });
    });

    const imagePicker = newElements[1];
    imagePicker.addEventListener("change", () => {
      imageElement.remove();
      addImage({ filePickerId: imagePicker.id, update: true });
      clearUpdateImageUI();
    });
  }

  function createEditTextElement(_id, content) {
    // 🚸 editTextElement should also have a label
    let editElement = document.createElement("textarea");
    editElement.classList.add(EDIT_CLASS);
    editElement.innerHTML = content;
    return editElement;
  }

  function createEditImageElements(imagePickerId, _content) {
    const imagePicker = document.createElement("input");
    imagePicker.type = "file";
    imagePicker.id = imagePickerId;
    imagePicker.classList.add(EDIT_CLASS);
    const imagePickerLabel = document.createElement("label");
    imagePickerLabel.innerHTML = STRINGS.LABEL_IMAGE_PICKER;
    imagePickerLabel.for = imagePickerId;
    imagePickerLabel.classList.add(EDIT_CLASS);
    return [imagePickerLabel, imagePicker];
  }

  function uniqueId(readableString) {
    return `${readableString}-${Math.random()}`;
  }
}
