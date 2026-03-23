import { localEditingMode } from "../..";
import {
  CURRENTLY_EDITING_LINK_HANDLER_ID,
  CURRENTLY_EDITING_TOOLBAR_ID,
  LOCAL_CONTROLS_CONTAINER_ID,
} from "../../util/constants";
import { saveFile } from "../../util/files";
import { showAlert } from "../util/alert";

export function handleSaveChanges(_event: Event) {
  const uiIds = [
    LOCAL_CONTROLS_CONTAINER_ID,
    CURRENTLY_EDITING_LINK_HANDLER_ID,
    CURRENTLY_EDITING_TOOLBAR_ID,
  ];

  uiIds.forEach((i) => {
    const element = document.getElementById(i);
    element?.remove();
  });

  document.body.removeAttribute("class");

  const fullHtml = document.documentElement.outerHTML;
  const doctype = document.doctype
    ? `<!DOCTYPE ${[
        document.doctype.name,
        document.doctype.publicId && `PUBLIC "${document.doctype.publicId}"`,
        document.doctype.systemId && `"${document.doctype.systemId}"`,
      ]
        .filter(Boolean)
        .join(" ")}>`
    : "";

  saveFile(`${doctype}${fullHtml}`)
    .catch((error) => {
      if (error?.name !== "AbortError") {
        showAlert(error);
      }
    })
    .finally(() => {
      localEditingMode();
    });
}
