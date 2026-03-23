import {
  AlignOptions,
  EditorTypes,
  ElementTag,
  InsertPosition,
  TextAlignCssValues,
} from "../../types";
import {
  CURRENTLY_EDITING_FORMATTING_ID,
  EditableType,
  FlexAlignCssKeys,
  TextAlignCssKeys,
} from "../../util/constants";
import { ALIGNMENT_LABELS, EDITOR_LABELS } from "../../util/strings";
import {
  actionUpdateHeadingLevel,
  actionUpdateImageAlign,
  actionUpdateTextAlign,
} from "../events/actions";
import { insertElementWithinElement } from "../util/insertElementWithinElement";
import { getCurrentlyEditingElement, getEditableType } from "./util";
import { showAlert } from "../util/alert";
import { createFieldset } from "../util/createFieldset";
import { getSubpanel } from "./subpanel";

export function getFormattingPanel() {
  const formattingPanel = getSubpanel(CURRENTLY_EDITING_FORMATTING_ID);

  const alignmentWidget = getAlignmentWidget();
  if (!alignmentWidget) {
    showAlert("Error: Can't open formatting panel.");
    return formattingPanel;
  }
  insertElementWithinElement(
    formattingPanel,
    alignmentWidget,
    InsertPosition.AFTER_BEGIN,
  );

  const headingTypeWidget = getHeadingTypeWidget();
  if (headingTypeWidget) {
    insertElementWithinElement(
      formattingPanel,
      headingTypeWidget,
      InsertPosition.AFTER_BEGIN,
    );
  }

  return formattingPanel;
}

function getAlignmentWidget() {
  const currentlyEditing = getCurrentlyEditingElement();
  const isImage = currentlyEditing instanceof HTMLImageElement;

  let current: "LEFT" | "CENTER" | "RIGHT" | "DEFAULT" | null = null;
  if (isImage) {
    const alignSelf = currentlyEditing?.style?.alignSelf;
    current = FlexAlignCssKeys?.[alignSelf] ?? AlignOptions.DEFAULT;
  } else {
    const textAlign =
      currentlyEditing?.style?.textAlign || TextAlignCssValues.DEFAULT;
    current = TextAlignCssKeys?.[textAlign] ?? AlignOptions.DEFAULT;
  }

  const alignOptions = Object.values(AlignOptions).map((i) => ({
    value: i,
    label: ALIGNMENT_LABELS[i],
  }));

  const editableType = getEditableType();

  let listener: ((event: Event) => void) | null = null;
  if (editableType === EditableType.TEXT) {
    listener = actionUpdateTextAlign;
  }
  if (editableType === EditableType.IMAGE) {
    listener = actionUpdateImageAlign;
  }
  if (!listener) return;

  const editAlignElement = createFieldset({
    legendText: EDITOR_LABELS[EditorTypes.ALIGN],
    options: alignOptions,
    current,
    listener,
  });

  return editAlignElement;
}

function getHeadingTypeWidget() {
  const currentlyEditing = getCurrentlyEditingElement();
  const isHeading = currentlyEditing instanceof HTMLHeadingElement;
  if (!isHeading) return;

  const headerTags = [
    ElementTag.H1,
    ElementTag.H2,
    ElementTag.H3,
    ElementTag.H4,
    ElementTag.H5,
    ElementTag.H6,
  ];
  const options = headerTags.map((i) => ({ value: i, label: i.toUpperCase() }));

  const editHeadingTypeElement = createFieldset({
    legendText: EDITOR_LABELS[EditorTypes.HEADING_LEVEL],
    options,
    current: currentlyEditing.tagName.toLowerCase(),
    listener: actionUpdateHeadingLevel,
  });

  return editHeadingTypeElement;
}
