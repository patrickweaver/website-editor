import {
  CANCEL_FAVICON_UPDATE_ID,
  CONFIRM_FAVICON_UPDATE_ID,
  HIDDEN_CLASS,
  IMAGE_PREVIEW_FIGURE_ID_PREFIX,
  IMAGE_PREVIEW_ID_PREFIX,
  STRINGS,
  UPDATE_FAVICON_ID,
} from "../../constants";
import { UpdateMethod } from "../../types";
import { showAlert } from "../../util/alert";
import { getDataURLFromFile, isImageFile } from "../../util/files";
import { insertFavicon } from "../insertFavicon";

export function handleUpdateFavicon(event: Event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;
  const file = target?.files?.[0];
  if (!file) {
    showAlert(STRINGS.ERROR_NO_IMAGE);
    return;
  }
  const validFile = isImageFile(file);
  if (!validFile) {
    showAlert(STRINGS.ERROR_IMAGE_ONLY);
    return;
  }

  const imagePreviewImgId = `${IMAGE_PREVIEW_ID_PREFIX}${UPDATE_FAVICON_ID}`;
  const imagePreviewImg = document.getElementById(imagePreviewImgId);
  if (!(imagePreviewImg instanceof HTMLImageElement)) return;
  const imagePreviewFigureId = `${IMAGE_PREVIEW_FIGURE_ID_PREFIX}${UPDATE_FAVICON_ID}`;
  const imagePreviewFigure = document.getElementById(imagePreviewFigureId);
  if (!(imagePreviewFigure instanceof HTMLElement)) return;

  const updateButtons = [
    {
      id: CANCEL_FAVICON_UPDATE_ID,
      onClick: (_event: Event) => {
        updateHandler(false, UpdateMethod.REMOVE);
      },
    },
    {
      id: CONFIRM_FAVICON_UPDATE_ID,
      onClick: (_event: Event) => {
        updateHandler(false, UpdateMethod.REMOVE);
        insertFavicon(file);
      },
    },
  ];

  const urlPromise = getDataURLFromFile(file);

  const updateHandler = async (valid: boolean, method: UpdateMethod) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;

    updateButtons.forEach((i) => {
      const button = document.getElementById(i.id);
      if (!(button instanceof HTMLButtonElement)) return;
      button.disabled = !valid;
      button[method]("click", i.onClick);
    });

    if (!valid) {
      target.value = "";
      imagePreviewImg.src = "";
      imagePreviewFigure.classList.add(HIDDEN_CLASS);
    } else {
      const url = await urlPromise;
      imagePreviewImg.src = url;
      imagePreviewFigure.classList.remove(HIDDEN_CLASS);
    }
  };

  updateHandler(validFile, UpdateMethod.ADD);
}
