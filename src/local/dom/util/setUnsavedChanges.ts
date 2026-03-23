import { ElementTag, InsertPosition } from "../../types";
import {
  LOCAL_CONTROLS_CONTAINER_ID,
  UNSAVED_CHANGES_BANNER_ID,
} from "../../util/constants";
import { LC_UNSAVED_CHANGES_BANNER } from "../../util/strings";
import { createElement } from "./createElement";
import { insertElementWithinElement } from "./insertElementWithinElement";

export function setUnsavedChanges() {
  document.body.classList += " unsaved-changes";
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
