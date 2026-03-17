import {
  ImageEditorButtonUpdateCallback,
  ImgElementProperty,
} from "../../types";
import { showAlert } from "../util/alert";
import { prepareImageForEditor } from "../util/prepareImageForEditor";
import { imgElementUpdateCleanup } from "./imgElementUpdateCleanup";

export const updateImageCallback: ImageEditorButtonUpdateCallback = async (
  args,
) => {
  const {
    editorElement: imagePicker,
    tagNameSelect: _tagNameSelect,
    alignSelectElement,
    altTextEditor,
    hrefEditor,
    originalElement,
    editorId: _editorId,
  } = args;
  if (
    !imagePicker ||
    !altTextEditor ||
    !hrefEditor ||
    !alignSelectElement ||
    !originalElement
  ) {
    showAlert("Missing required elements for image update");
    return undefined;
  }
  if (!(imagePicker instanceof HTMLInputElement)) {
    showAlert("Image editor element is not an input element");
    return undefined;
  }
  // TODO remove check
  if (!(originalElement instanceof HTMLImageElement)) return undefined;
  const updatedImageElement = await prepareImageForEditor({
    filePickerId: imagePicker.id,
    altText: altTextEditor?.value,
    href: hrefEditor?.value,
    alignSelectElement,
    originalElement,
  });
  if (!updatedImageElement) {
    showAlert("Invalid update");
    return;
  }
  return imgElementUpdateCleanup(
    updatedImageElement,
    originalElement,
    // 🚸 TODO check alignment dirty
    [ImgElementProperty.ALT, ImgElementProperty.SRC, ImgElementProperty.STYLE],
  );
};
