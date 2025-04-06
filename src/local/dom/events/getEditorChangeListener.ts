import {
  HIDDEN_CLASS,
  IMAGE_PREVIEW_FIGURE_ID_PREFIX,
  IMAGE_PREVIEW_ID_PREFIX,
  STRINGS,
} from "../../constants";
import { getDataURLFromFile, isImageFile } from "../../util/files";
import { _ElementTag } from "../util/createElement";
import { getButtonId, trimHTML } from "../../util/strings";

export function getEditorChangeListener(
  id: string,
  confirmButtonLabel: string,
) {
  return async function (event: Event) {
    const updateButtonId = getButtonId(confirmButtonLabel, id);
    const updateButton = document.getElementById(updateButtonId);
    if (!(updateButton instanceof HTMLButtonElement)) return;
    if (!(event.currentTarget instanceof HTMLInputElement)) return;
    const { type, files } = event.currentTarget;
    const tagName = event.currentTarget.tagName.toLowerCase();
    const isParagraphEditor = tagName === _ElementTag.TEXTAREA;
    const isImageEditor = tagName === _ElementTag.INPUT && type === "file";
    if (isParagraphEditor) {
      updateButton.disabled = !trimHTML(event.currentTarget.value);
    } else if (isImageEditor) {
      const imagePreviewImg = document.getElementById(
        `${IMAGE_PREVIEW_ID_PREFIX}${id}`,
      );
      if (!(imagePreviewImg instanceof HTMLImageElement)) return;
      const imagePreviewFigure = document.getElementById(
        `${IMAGE_PREVIEW_FIGURE_ID_PREFIX}${id}`,
      );
      if (!imagePreviewFigure) return;
      if (!files?.[0]) return;
      const validFile = isImageFile(files[0]);
      if (!validFile) {
        event.currentTarget.value = "";
        imagePreviewImg.src = "";
        imagePreviewFigure.classList.add(HIDDEN_CLASS);
        alert(STRINGS.ERROR_IMAGE_ONLY);
        return;
      }
      const url = await getDataURLFromFile(files[0]);
      imagePreviewImg.src = url;
      imagePreviewFigure.classList.remove(HIDDEN_CLASS);
    }
    updateButton.disabled = false;
  };
}
