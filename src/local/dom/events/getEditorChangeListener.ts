import {
  HIDDEN_CLASS,
  IMAGE_PREVIEW_FIGURE_ID_PREFIX,
  IMAGE_PREVIEW_ID_PREFIX,
  STRINGS,
} from "../../constants";
import { getDataURLFromFile, isImageFile } from "../../util/files";
import { ElementTag } from "../../types";
import { getButtonId, trimHTML } from "../../util/strings";

export function getEditorChangeListener(
  id: string,
  confirmButtonLabel: string,
) {
  return async function (event: Event) {
    const updateButtonId = getButtonId(confirmButtonLabel, id);
    const updateButton = document.getElementById(updateButtonId);
    if (!(updateButton instanceof HTMLButtonElement)) return;
    const target = event.currentTarget;
    const isInput = target instanceof HTMLInputElement;
    const isFieldset = target instanceof HTMLFieldSetElement;
    if (!(isInput || isFieldset)) return;
    const { type } = target;
    const tagName = target.tagName.toLowerCase();
    const isParagraphEditor =
      tagName === ElementTag.TEXTAREA && target instanceof HTMLTextAreaElement;
    const isImageChangeEvent = tagName === ElementTag.INPUT && type === "file";
    if (isParagraphEditor) {
      updateButton.disabled = !trimHTML(target.value);
    } else if (isImageChangeEvent) {
      const imagePreviewImg = document.getElementById(
        `${IMAGE_PREVIEW_ID_PREFIX}${id}`,
      );
      if (!(imagePreviewImg instanceof HTMLImageElement)) return;
      const imagePreviewFigure = document.getElementById(
        `${IMAGE_PREVIEW_FIGURE_ID_PREFIX}${id}`,
      );
      if (!imagePreviewFigure) return;
      if (isInput) {
        const { files } = target;
        if (!files?.[0]) return;
        const validFile = isImageFile(files[0]);
        if (!validFile) {
          target.value = "";
          imagePreviewImg.src = "";
          imagePreviewFigure.classList.add(HIDDEN_CLASS);
          alert(STRINGS.ERROR_IMAGE_ONLY);
          return;
        }
        const url = await getDataURLFromFile(files[0]);
        imagePreviewImg.src = url;
        imagePreviewFigure.classList.remove(HIDDEN_CLASS);
      }
    }
    updateButton.disabled = false;
  };
}
