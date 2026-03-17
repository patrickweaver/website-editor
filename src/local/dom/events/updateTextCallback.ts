import {
  ElementTag,
  TextEditorButtonUpdateCallback,
  TextElementProperty,
} from "../../types";
import { prepareTextForEditor } from "../util/prepareTextForEditor";
import { elementUpdateCleanup } from "./elementUpdateCleanup";

export const updateTextCallback: TextEditorButtonUpdateCallback = async (
  args,
) => {
  const {
    editorElement,
    tagNameSelect,
    alignSelectElement,
    altTextEditor: _altTextEditor,
    originalElement,
    editorId: _editorId,
  } = args;
  if (!editorElement || !alignSelectElement || !originalElement)
    return undefined;
  const tagName = tagNameSelect?.value ?? ElementTag.P;
  const updatedTextElement = prepareTextForEditor({
    editorId: editorElement.id,
    tagName: tagName as ElementTag,
    alignSelectElement,
    text: editorElement?.innerHTML ?? "",
  });
  return elementUpdateCleanup(updatedTextElement, originalElement, [
    TextElementProperty.INNER_HTML,
    TextElementProperty.STYLE,
    TextElementProperty.TAG_NAME,
  ]);
};
