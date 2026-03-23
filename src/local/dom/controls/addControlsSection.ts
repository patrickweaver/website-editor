import { CONTROLS_SECTION_CLASS } from "../../util/constants";
import { ElementTag } from "../../types";
import { createElement } from "../util/createElement";
import { insertElementWithinElement } from "../util/insertElementWithinElement";

export function addControlsSection(
  headerText: string,
  children: HTMLElement[],
  headerTag: ElementTag = ElementTag.H4,
  id: string | null = null,
) {
  const section = createElement({
    classList: [CONTROLS_SECTION_CLASS],
  });
  if (id) section.id = id;
  const header = createElement({ tag: headerTag, innerHTML: headerText });
  [header, ...children].forEach((element) => {
    insertElementWithinElement(section, element);
  });
  return section;
}
