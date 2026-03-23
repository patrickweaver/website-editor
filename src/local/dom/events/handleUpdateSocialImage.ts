import {
  CURRENT_SOCIAL_IMAGE_ALT_ID,
  CURRENT_SOCIAL_IMAGE_ID,
  CURRENT_SOCIAL_IMAGE_PREVIEW_ID,
  CURRENT_TWITTER_IMAGE_ALT_ID,
  CURRENT_TWITTER_IMAGE_ID,
} from "../../util/constants";
import {
  ElementTag,
  ImgElementProperty,
  InsertPosition,
  MetaProperty,
} from "../../types";
import { createElement } from "../util/createElement";
import { insertElementToDOM } from "../util/insertElementToDOM";
import { getUniqueId } from "../../util/random";
import { setUnsavedChanges } from "../util/setUnsavedChanges";

function handleUpdateSocialImageProperty(
  event: Event,
  property: ImgElementProperty.SRC | ImgElementProperty.ALT,
) {
  const propertyItems: {
    [key in ImgElementProperty.SRC | ImgElementProperty.ALT]: {
      id: string;
      property: MetaProperty | ImgElementProperty;
    }[];
  } = {
    [ImgElementProperty.SRC]: [
      { id: CURRENT_SOCIAL_IMAGE_ID, property: MetaProperty.CONTENT },
      { id: CURRENT_TWITTER_IMAGE_ID, property: MetaProperty.CONTENT },
      { id: CURRENT_SOCIAL_IMAGE_PREVIEW_ID, property: ImgElementProperty.SRC },
    ],
    [ImgElementProperty.ALT]: [
      { id: CURRENT_SOCIAL_IMAGE_ALT_ID, property: MetaProperty.CONTENT },
      { id: CURRENT_TWITTER_IMAGE_ALT_ID, property: MetaProperty.CONTENT },
      { id: CURRENT_SOCIAL_IMAGE_PREVIEW_ID, property: ImgElementProperty.ALT },
    ],
  };

  const currentPreviewImageOrPlaceholder = document.getElementById(
    CURRENT_SOCIAL_IMAGE_PREVIEW_ID,
  );
  if (currentPreviewImageOrPlaceholder instanceof HTMLDivElement) {
    const placeholderId = getUniqueId();
    currentPreviewImageOrPlaceholder.id = placeholderId;
    const newPreviewImage = createElement({
      tag: ElementTag.IMG,
      id: CURRENT_SOCIAL_IMAGE_PREVIEW_ID,
    });
    insertElementToDOM(
      placeholderId,
      newPreviewImage,
      InsertPosition.AFTER_END,
    );
    currentPreviewImageOrPlaceholder.remove();
  }

  const items = propertyItems[property];
  items.forEach((item) => {
    const element = document.getElementById(item.id);
    const isMetaElementAndContent =
      element instanceof HTMLMetaElement &&
      item.property === MetaProperty.CONTENT;
    const isImageElement = element instanceof HTMLImageElement;
    if (isMetaElementAndContent) {
      if (
        event.target instanceof HTMLInputElement &&
        item.property === MetaProperty.CONTENT
      ) {
        element[item.property] = event?.target?.value;
      }
    }
    if (isImageElement) {
      if (event.target instanceof HTMLInputElement) {
        if (item.property === property) {
          element[item.property] = event.target.value;
        }
      }
    }
  });
  setUnsavedChanges();
}

export function handleUpdateSocialImageSrc(event: Event) {
  handleUpdateSocialImageProperty(event, ImgElementProperty.SRC);
}

export function handleUpdateSocialImageAlt(event: Event) {
  handleUpdateSocialImageProperty(event, ImgElementProperty.ALT);
}
