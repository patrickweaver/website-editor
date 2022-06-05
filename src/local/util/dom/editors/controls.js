import { LOCAL_CONTROLS_HTML } from "../../../templates";
import { createElement } from "..";
import { LOCAL_CONTROLS_ID } from "../../../constants";

export const localControls = createElement({
  id: LOCAL_CONTROLS_ID,
  innerHTML: LOCAL_CONTROLS_HTML,
});
