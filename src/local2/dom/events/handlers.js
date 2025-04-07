import { GLOBALS } from "../../../globals";
import {
  addNewHeadingEditor,
  addNewParagraphEditor,
  addNewImageEditor,
  insertFavicon,
  getCurrentStyle,
} from "..";
import { onUpdateBodyAlign } from "../align";
import { isImageFile, saveFile, getDataURLFromFile } from "../../util/files";
import { enableLocalControls } from "../../enable";
import { getNewContentModal } from "../editors/addElement";
import { addListenerById } from "./listeners";
import {
  ADD_ITEM_CANCEL_BUTTON_ID,
  ADD_ITEM_HEADING_ID,
  ADD_ITEM_IMAGE_ID,
  ADD_ITEM_PARAGRAPH_ID,
  CANCEL_FAVICON_UPDATE_ID,
  CONFIRM_FAVICON_UPDATE_ID,
  CURRENT_SOCIAL_IMAGE_ID,
  CURRENT_SOCIAL_IMAGE_PREVIEW_ID,
  CURRENT_TWITTER_IMAGE_ID,
  HIDDEN_CLASS,
  IMAGE_PREVIEW_FIGURE_ID_PREFIX,
  IMAGE_PREVIEW_ID_PREFIX,
  LOCAL_CONTROLS_ID,
  STRINGS,
  UPDATE_BODY_ALIGN_CONTAINER_ID,
  UPDATE_BODY_ALIGN_ID,
  UPDATE_FAVICON_ID,
  WIDTH_SLIDER_CONTAINER_ID,
  WIDTH_SLIDER_ID,
  WIDTH_SLIDER_VALUE_ID,
} from "../../constants";

export function onClickNewContentButton() {
  const newContentModal = getNewContentModal();
  insertElement(LOCAL_CONTROLS_ID, newContentModal, "beforeend");

  function clearAddItemModal() {
    newContentModal.remove();
  }

  const addElementEditorOptions = [
    { id: ADD_ITEM_HEADING_ID, callback: addNewHeadingEditor },
    { id: ADD_ITEM_PARAGRAPH_ID, callback: addNewParagraphEditor },
    { id: ADD_ITEM_IMAGE_ID, callback: addNewImageEditor },
  ];

  addElementEditorOptions.forEach((option) => {
    const callback = (_event) => {
      option.callback();
      clearAddItemModal();
    };
    addListenerById(option.id, callback, "click");
  });

  addListenerById(ADD_ITEM_CANCEL_BUTTON_ID, clearAddItemModal, "click");
}

export async function onClickSaveChanges(_event) {
  const localControls = document.getElementById(LOCAL_CONTROLS_ID);
  localControls.remove();
  const htmlSourceCode = `
            <!DOCTYPE html>
            <html lang="${document.documentElement.lang}"  id="html-element">
              <head>
                ${document.head.innerHTML}
              </head>
              <body
                style="
                  background-color: ${getCurrentStyle("backgroundColor")};
                  color: ${getCurrentStyle("color")};
                  text-align: ${document.body.style.textAlign};
                  align-items: ${document.body.style.alignItems};
                  /* 🚧 TODO do the other inline properties need to be here? */
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
  enableLocalControls();
}

export function onUpdateImgElementAlign(value) {
  if (value === "default") {
    return {};
  } else {
    let flexValue = value;
    flexValue =
      value === "left" ? "flex-start" : value === "right" ? "flex-end" : value;
    return { alignSelf: flexValue };
  }
}

export function getHandleStyleChange(property) {
  return (changeEvent) => {
    document.body.style[property] = changeEvent.target.value;
    GLOBALS.EDITING_STATE_DIRTY = true;
  };
}

export function onUpdateFaviconPicker(changeEvent) {
  const file = changeEvent.target.files[0];
  const validFile = isImageFile(file);

  const UPDATE_METHODS = {
    REMOVE: "removeEventListener",
    ADD: "addEventListener",
  };

  const imagePreviewImg = document.getElementById(
    `${IMAGE_PREVIEW_ID_PREFIX}${UPDATE_FAVICON_ID}`,
  );
  const imagePreviewFigure = document.getElementById(
    `${IMAGE_PREVIEW_FIGURE_ID_PREFIX}${UPDATE_FAVICON_ID}`,
  );

  const updateButtons = [
    {
      id: CANCEL_FAVICON_UPDATE_ID,
      onClick: (_clickEvent) => {
        updateHandler(false, UPDATE_METHODS.REMOVE);
      },
    },
    {
      id: CONFIRM_FAVICON_UPDATE_ID,
      onClick: (_clickEvent) => {
        updateHandler(false, UPDATE_METHODS.REMOVE);
        insertFavicon(file);
      },
    },
  ];

  const url = getDataURLFromFile(file);

  async function updateHandler(valid, method) {
    updateButtons.forEach((i) => {
      const button = document.getElementById(i.id);
      button.disabled = !valid;
      button[method]("click", i.onClick);
    });
    if (!valid) {
      changeEvent.target.value = null;
      imagePreviewImg.src = null;
      imagePreviewFigure.classList.add(HIDDEN_CLASS);
    } else {
      imagePreviewImg.src = await url;
      imagePreviewFigure.classList.remove(HIDDEN_CLASS);
    }
  }

  updateHandler(validFile, UPDATE_METHODS.ADD);

  if (!validFile) {
    alert(STRINGS.ERROR_IMAGE_ONLY);
    return null;
  }
}

export function onUpdateFullWidth(changeEvent) {
  const fullWidth = changeEvent.target.checked;
  document.getElementById(WIDTH_SLIDER_ID).disabled = fullWidth;
  document.getElementById(UPDATE_BODY_ALIGN_ID).disabled = fullWidth;
  document.getElementById(WIDTH_SLIDER_CONTAINER_ID).style.display = fullWidth
    ? "none"
    : "block";
  document.getElementById(UPDATE_BODY_ALIGN_CONTAINER_ID).style.display =
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

export function onUpdateSocialImage(inputEvent) {
  [
    { id: CURRENT_SOCIAL_IMAGE_ID, property: "content" },
    { id: CURRENT_TWITTER_IMAGE_ID, property: "content" },
    { id: CURRENT_SOCIAL_IMAGE_PREVIEW_ID, property: "src" },
  ].forEach(({ id, property }) => {
    const element = document.getElementById(id);
    element[property] = inputEvent.target.value;
  });
}

export function onUpdateWidth(inputEvent) {
  const value = `${inputEvent.target.value}px`;
  document.body.style.width = value;
  document.getElementById(WIDTH_SLIDER_VALUE_ID).innerHTML = value;
}
