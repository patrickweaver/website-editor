import {
  CURRENT_SOCIAL_IMAGE_ID,
  CURRENT_SOCIAL_IMAGE_PREVIEW_ID,
  CURRENT_TWITTER_IMAGE_ID,
} from "../../constants";
import { ImgElementProperty, MetaProperty } from "../../types";

export function handleUpdateSocialImage(event: Event) {
  const items = [
    { id: CURRENT_SOCIAL_IMAGE_ID, property: MetaProperty.CONTENT },
    { id: CURRENT_TWITTER_IMAGE_ID, property: MetaProperty.CONTENT },
    { id: CURRENT_SOCIAL_IMAGE_PREVIEW_ID, property: ImgElementProperty.SRC },
  ];
  items.forEach((item) => {
    const element = document.getElementById(item.id);
    const isMetaElementAndContent =
      element instanceof HTMLMetaElement &&
      item.property === MetaProperty.CONTENT;
    const isImageElement = element instanceof HTMLImageElement;
    if (isMetaElementAndContent) {
      if (event.target instanceof HTMLInputElement)
        element[item.property] = event?.target?.value;
    }
    if (isImageElement) {
      if (event.target instanceof HTMLInputElement) {
        if (item.property === ImgElementProperty.SRC) {
          element[item.property] = event.target.value;
        }
      }
    }
  });
}
