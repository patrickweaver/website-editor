import { CONTROLS_SECTION_CLASS } from "../../constants";
import { createElement, HeaderTag } from "../util/createElement";
import { insertElementWithinElement } from "../util/insertElementWithinElement";

export function addControlsSection(
  headerText: string,
  children: HTMLElement[],
  headerTag: HeaderTag = HeaderTag.H3,
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
