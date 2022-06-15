import { GLOBALS } from "../../../../globals";
import { addLinkAroundSelection, addImage, addText, createElement } from "..";
import { getButtonId, getEditorContainerId, slugify } from "../../strings";
import { createImageEditor } from "../editors/image";
import { createTextEditor } from "../editors/text";
import { getUniqueId } from "../../random";
import { isImageFile } from "../../files";
import {
  CLONE_CLASS,
  CLONE_CONTAINER_CLASS,
  EDIT_BUTTONS_CLASS,
  EDIT_CONTAINER_CLASS,
  EDITOR_TYPES,
  IMAGE_PICKER_ID_READABLE_STRING,
  PARAGRAPH_ELEMENT,
  STRINGS,
  TEXT_EDITOR_ID_READABLE_STRING,
} from "../../../constants";

export const textEventListener = makeElementEventListener(EDITOR_TYPES.TEXT);
export const imageEventListener = makeElementEventListener(EDITOR_TYPES.IMAGE);

export function addListenerById(id, callback, type = "change") {
  document.getElementById(id).addEventListener(type, callback);
}

export function addListenerToMetaDataEditor(
  editElementId,
  mainElementId,
  secondaryElementIdArray,
  mainProperty = "content",
  secondaryProperty = "content"
) {
  const editElement = document.getElementById(editElementId);
  const mainElement = document.getElementById(mainElementId);
  editElement.value = mainElement[mainProperty];

  const onUpdateMetaData = (_event) => {
    const newValue = editElement.value;
    mainElement[mainProperty] = newValue;
    secondaryElementIdArray.forEach((element) => {
      document.getElementById(element)[secondaryProperty] = newValue;
    });
  };

  editElement.addEventListener("input", onUpdateMetaData);
}

export function makeEditorChangeListener(id, confirmButtonLabel) {
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
      GLOBALS.EDITING_STATE_DIRTY =
        GLOBALS.EDITING_STATE_DIRTY || _editingStateDirty;
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
        innerHTML: STRINGS.CLONE_LABEL,
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
      buttonsContainerElement.insertAdjacentElement("beforeend", buttonElement);
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
      editorContainerElement.insertAdjacentElement("beforeend", editorElement);
    });

    editor.focus();
    editor.select();
  };
}
