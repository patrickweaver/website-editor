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
  const EDITABLE_HEADING_ELEMENTS = ["h1", "h2", "h3", "h4", "h5", "h6"].join(
    ", "
  );
  const EDITABLE_PARAGRAPH_ELEMENT = "p";

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
      element.style.display = "none";
      const originalContent = element.innerHTML;

      const cancelButton = {
        label: STRINGS.BUTTON_CANCEL,
        getNewContent: (_) => originalContent,
      };

      const updateButton = {
        label: STRINGS.BUTTON_UPDATE,
        getNewContent: (element) => element.value,
      };

      let types = {
        text: {
          idReadableString: TEXT_EDITOR_ID_READABLE_STRING,
          controls: [updateButton, cancelButton],
          createEditor: createEditTextElement,
        },
        [EDITOR_TYPES.IMAGE]: {
          idReadableString: IMAGE_PICKER_ID_READABLE_STRING,
          controls: [cancelButton],
          createEditor: createEditImageElements,
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

      type.controls.forEach(function (i) {
        let buttonElement = createElement("button");
        buttonElement.innerHTML = i.label;
        buttonsContainerElement.insertAdjacentElement(
          "afterbegin",
          buttonElement
        );
        buttonElement.addEventListener("click", function (_event) {
          element.innerHTML = i.getNewContent(editElements[1]);
          editorContainerElement.remove();
          element.style.display = originalDisplay;
        });
      });

      element.insertAdjacentElement("beforebegin", editorContainerElement);
      [...editElements, buttonsContainerElement].forEach(function (
        editorElement
      ) {
        editorContainerElement.insertAdjacentElement(
          "beforeend",
          editorElement
        );
      });
    };
  }

  function imageElementListener(event) {
    const element = event.target;
    const originalDisplay = element.style.display;
    const originalContent = element.innerHTML;
    const imagePickerId = uniqueId(IMAGE_PICKER_ID_READABLE_STRING);
    let newElements = createEditImageElements(imagePickerId);

    element.style.display = "none";

    const controls = [
      {
        label: STRINGS.BUTTON_CANCEL,
        getNewContent: (_) => {
          return originalContent;
        },
      },
    ];

    let buttonsContainerElement = createElement("div");
    buttonsContainerElement.classList.add(EDIT_BUTTONS_CLASS);
    [...newElements, buttonsContainerElement].forEach((element) => {
      buttonsContainerElement.insertBefore(element);
    });
    insertElementsAbove(element, [buttonsContainerElement]);

    insertEditorControls(
      element,
      originalDisplay,
      buttonsContainerElement,
      controls,
      newElements
    );
    element.parentElement.classList.add(EDIT_CONTAINER_CLASS);
  }

  // Headings
  document.querySelectorAll(EDITABLE_HEADING_ELEMENTS).forEach((element) => {
    element.addEventListener(
      "click",
      makeElementEventListener(EDITOR_TYPES.HEADING)
    );
  });

  // Paragraph
  document
    // TODO Don't actually need querySelectorAll here.
    .querySelectorAll(EDITABLE_PARAGRAPH_ELEMENT)
    .forEach((element) => {
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
    const imageContainer = createElement("div");
    imageContainer.classList.add(IMAGE_CONTAINER_CLASS);
    const newElement = createElement("img");
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

    newElement.addEventListener(
      "click",
      makeElementEventListener(EDITOR_TYPES.IMAGE)
    );
  }

  function addTextItem(type) {
    let elementType;
    if (type === EDITOR_TYPES.HEADING) {
      elementType = "h2";
    } else if (type === EDITOR_TYPES.PARAGRAPH) {
      elementType = "p";
    }

    const newElement = createElement(elementType);

    if (type === EDITOR_TYPES.HEADING || type === EDITOR_TYPES.PARAGRAPH) {
      newElement.innerHTML = STRINGS.PLACEHOLDER_TEXT;

      document
        .getElementById(END_OF_DOC_ID)
        .insertAdjacentElement("beforebegin", newElement);

      newElement.addEventListener("click", makeElementEventListener(type));

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

  // TODO remove?
  function insertElementsAbove(elementBelow, elementsArray) {
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
      let buttonElement = createElement("button");
      buttonElement.innerHTML = i.label;
      containerElement.insertAdjacentElement("afterbegin", buttonElement);
      buttonElement.addEventListener("click", function (_event) {
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

  function createEditTextElement(id, type, content) {
    let editElement = createElement("textarea");
    editElement.id = id;
    editElement.classList.add(EDIT_CLASS);
    editElement.innerHTML = content;
    const editElementLabel = createEditorLabel(id, type);
    return [editElementLabel, editElement];
  }

  function createEditImageElements(id, type, _content) {
    const imagePicker = createElement("input");
    imagePicker.type = "file";
    imagePicker.id = id;
    imagePicker.classList.add(EDIT_CLASS);
    const imagePickerLabel = createEditorLabel(id, type);
    return [imagePickerLabel, imagePicker];
  }

  function createEditorLabel(editorId, type) {
    let editElementLabel = createElement("label");
    editElementLabel.innerHTML = STRINGS.EDITOR_LABELS[type];
    editElementLabel.htmlFor = editorId;
    editElementLabel.classList.add(EDIT_CLASS);
    return editElementLabel;
  }

  function uniqueId(readableString) {
    return `${readableString}-${Math.random()}`;
  }

  function createElement(type) {
    return createElement(type);
  }
}
