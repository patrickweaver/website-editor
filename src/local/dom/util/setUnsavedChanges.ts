import { ElementTag, InsertPosition } from "../../types";
import {
  LOCAL_CONTROLS_CONTAINER_ID,
  UNSAVED_CHANGES_BANNER_ID,
  UNSAVED_CHANGES_BODY_CLASS,
} from "../../util/constants";
import { LC_UNSAVED_CHANGES_BANNER } from "../../util/strings";
import { createElement } from "./createElement";
import { insertElementWithinElement } from "./insertElementWithinElement";

export function setUnsavedChanges() {
  if (!document.body.classList.contains(UNSAVED_CHANGES_BODY_CLASS)) {
    document.body.classList += ` ${UNSAVED_CHANGES_BODY_CLASS}`;
  }
  const localControlsContainer = document.getElementById(
    LOCAL_CONTROLS_CONTAINER_ID,
  );

  if (!localControlsContainer) return;

  const banner = createElement({
    id: UNSAVED_CHANGES_BANNER_ID,
    tag: ElementTag.DIV,
    innerHTML: LC_UNSAVED_CHANGES_BANNER,
  });

  insertElementWithinElement(
    localControlsContainer,
    banner,
    InsertPosition.AFTER_BEGIN,
  );
}
