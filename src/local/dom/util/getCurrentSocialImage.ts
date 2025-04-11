import {
  CURRENT_SOCIAL_IMAGE_ALT_ID,
  CURRENT_SOCIAL_IMAGE_ID,
} from "../../constants";

export function getCurrentSocialImage() {
  const metaImageElement = document.getElementById(CURRENT_SOCIAL_IMAGE_ID);
  const metaAltElement = document.getElementById(CURRENT_SOCIAL_IMAGE_ALT_ID);
  if (
    !(metaImageElement instanceof HTMLMetaElement) ||
    !(metaAltElement instanceof HTMLMetaElement)
  )
    return { url: "", alt: "" };
  return { url: metaImageElement.content, alt: metaAltElement.content };
}
