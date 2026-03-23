import {
  CURRENTLY_EDITING_LINK_HANDLER_ID,
  CURRENTLY_EDITING_TOOLBAR_ID,
  LOCAL_CONTROLS_CONTAINER_ID,
} from "../../util/constants";
import { saveFile } from "../../util/files";

export function handleSaveChanges(_event: Event) {
  console.log("Save changes!");

  const uiIds = [
    LOCAL_CONTROLS_CONTAINER_ID,
    CURRENTLY_EDITING_LINK_HANDLER_ID,
    CURRENTLY_EDITING_TOOLBAR_ID,
  ];

  uiIds.forEach((i) => {
    const element = document.getElementById(i);
    element?.remove();
  });

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

  saveFile(`${doctype}${fullHtml}`);

  // TODO
}
