import { GLOBALS } from "../../../../globals";
import { insertFavicon, getBodyBackgroundColor } from "..";
import { onUpdateBodyAlign } from "../align";
import { isImageFile, saveFile } from "../../files";
import { enableLocalControls } from "../../../enable";
import {
  CANCEL_FAVICON_UPDATE_ID,
  CONFIRM_FAVICON_UPDATE_ID,
  CURRENT_SOCIAL_IMAGE_ID,
  CURRENT_SOCIAL_IMAGE_PREVIEW_ID,
  CURRENT_TWITTER_IMAGE_ID,
  LOCAL_CONTROLS_ID,
  STRINGS,
  UPDATE_BODY_ALIGN_CONTAINER,
  UPDATE_BODY_ALIGN_ID,
  WIDTH_SLIDER_CONTAINER_ID,
  WIDTH_SLIDER_ID,
  WIDTH_SLIDER_VALUE_ID,
} from "../../../constants";

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

export function onUpdateBackgroundColor(changeEvent) {
  document.body.style.backgroundColor = changeEvent.target.value;
  GLOBALS.EDITING_STATE_DIRTY = true;
}

export function onUpdateFaviconPicker(changeEvent) {
  const file = changeEvent.target.files[0];
  const validFile = isImageFile(file);

  const UPDATE_METHODS = {
    REMOVE: "removeEventListener",
    ADD: "addEventListener",
  };

  const updateButtons = [
    {
      id: CANCEL_FAVICON_UPDATE_ID,
      onClick: (_clickEvent) => {
        updateHandler(true, UPDATE_METHODS.REMOVE);
      },
    },
    {
      id: CONFIRM_FAVICON_UPDATE_ID,
      onClick: (_clickEvent) => {
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

export function onUpdateFullWidth(changeEvent) {
  const fullWidth = changeEvent.target.checked;
  document.getElementById(WIDTH_SLIDER_ID).disabled = fullWidth;
  document.getElementById(UPDATE_BODY_ALIGN_ID).disabled = fullWidth;
  document.getElementById(WIDTH_SLIDER_CONTAINER_ID).style.display = fullWidth
    ? "none"
    : "block";
  document.getElementById(UPDATE_BODY_ALIGN_CONTAINER).style.display = fullWidth
    ? "none"
    : "block";
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
