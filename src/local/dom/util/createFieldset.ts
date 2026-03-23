import {
  EditorTypes,
  ElementTag,
  EventType,
  InsertPosition,
} from "../../types";
import { INPUT_TYPES } from "../../util/constants";
import { getUniqueId } from "../../util/random";
import { createElement } from "./createElement";
import { createLabel } from "./createLabel";
import { insertElementWithinElement } from "./insertElementWithinElement";

export function createFieldset({
  legendText,
  options,
  current,
  listener,
}: {
  legendText: string;
  options: { value: string; label: string }[];
  current: string;
  listener: (event: Event) => void;
}) {
  const editAlignElement = createElement({
    tag: ElementTag.FIELDSET,
    id: getUniqueId(),
  });

  const alignLegend = createElement({
    tag: ElementTag.LEGEND,
    innerHTML: legendText,
  });
  insertElementWithinElement(
    editAlignElement,
    alignLegend,
    InsertPosition.BEFORE_END,
  );

  let foundCurrent = false;
  options.forEach(({ value, label }) => {
    const container = createElement({ id: "cont", giveUniqueId: true });
    if (!options.map((i) => i.value).includes(value)) return;
    const input = createElement({
      tag: ElementTag.INPUT,
      id: getUniqueId(),
      type: INPUT_TYPES.RADIO,
      name: editAlignElement.id,
      value: value,
    });
    if (!foundCurrent && current === value) {
      input.checked = true;
      foundCurrent = true;
    }
    const labelElement = createLabel(input.id, EditorTypes.OPTION, label);
    insertElementWithinElement(
      container,
      labelElement,
      InsertPosition.AFTER_BEGIN,
    );
    insertElementWithinElement(container, input, InsertPosition.AFTER_BEGIN);
    insertElementWithinElement(
      editAlignElement,
      container,
      InsertPosition.AFTER_BEGIN,
    );
  });

  editAlignElement.addEventListener(EventType.CHANGE, listener);

  if (!foundCurrent) {
    const input = editAlignElement.children[0].children[0];
    if (!(input instanceof HTMLInputElement)) return null;
    input.checked = true;
  }

  return editAlignElement;
}
