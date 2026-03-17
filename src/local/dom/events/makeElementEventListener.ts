import { addLinkAroundSelection } from "../util/addLinkAroundSelection";
import {
  CURRENTLY_EDITING_ID,
  CURRENTLY_EDITING_TOOLBAR_ID,
  EDIT_BUTTONS_CLASS,
  EDIT_CONTAINER_CLASS,
  EDIT_UI_CONTAINER_CLASS,
  EDITOR_SUB_CONTAINER_CLASS,
  EDITOR_TYPES,
  IMAGE_PICKER_ID_READABLE_STRING,
  TEXT_EDITOR_ID_READABLE_STRING,
} from "../../util/constants";
import {
  EditorButtonConfig,
  EventType,
  InsertPosition,
  ElementTag,
} from "../../types";
import { showAlert } from "../util/alert";
import { getUniqueId } from "../../util/random";
import { createElement } from "../util/createElement";
import { createImageEditor } from "../util/createImageEditor";
import { createTextEditor } from "../util/createTextEditor";
import {
  getButtonId,
  getEditorContainerId,
  slugify,
  trimHTML,
} from "../../util/stringUtils";
import { insertElementWithinElement } from "../util/insertElementWithinElement";
import { BUTTON_LINK, BUTTON_SAVE } from "../../util/strings";
import { insertElementToDOM } from "../util/insertElementToDOM";
import { updateTextCallback } from "./updateTextCallback";
import { updateImageCallback } from "./updateImageCallback";
import { cancelEditAction } from "./actions";
import { getButtons } from "../ui/buttons";

export function makeElementEventListener(editorType: string) {
  return function (event: Event) {
    const element = event.currentTarget;
    if (
      !(
        element instanceof HTMLHeadingElement ||
        element instanceof HTMLParagraphElement ||
        element instanceof HTMLImageElement
      )
    ) {
      showAlert("Invalid element for editor");
      return;
    }

    if (element.id === CURRENTLY_EDITING_ID) {
      return;
    }

    const id = CURRENTLY_EDITING_ID;
    // TODO, this doesn't restore.
    const currentlyEditing = cancelEditAction();
    if (currentlyEditing) {
      // SKIP
    } else {
      // TODO
      let tagName: ElementTag = element.tagName.toLowerCase() as ElementTag;
      let originalContent: string = "";
      let altTextContent: string = "";
      const isParagraph = element instanceof HTMLParagraphElement;
      const isHeading = element instanceof HTMLHeadingElement;
      if (isParagraph || isHeading) {
        originalContent = trimHTML(element.innerHTML);
      }
      if (element instanceof HTMLImageElement) {
        altTextContent = element.alt;
      }

      const linkButton: EditorButtonConfig = {
        label: BUTTON_LINK,
        initiallyDisabled: false,
        updateElement: async ({ editorId }: { editorId?: string }) => {
          // TODO unnecessary check
          if (!editorId) return undefined;
          const elementWithSelection = document.getElementById(editorId);
          if (!(elementWithSelection instanceof HTMLParagraphElement)) return;
          elementWithSelection.innerHTML =
            addLinkAroundSelection(elementWithSelection);
        },
      };

      const updateButtonLabel = BUTTON_SAVE;

      const updateTextButton: EditorButtonConfig = {
        label: updateButtonLabel,
        initiallyDisabled: false,
        updateElement: updateTextCallback,
      };

      const updateImageButton: EditorButtonConfig = {
        label: updateButtonLabel,
        initiallyDisabled: true,
        updateElement: updateImageCallback,
      };

      const defaultButtons: Array<EditorButtonConfig> = [];

      let types = {
        [EDITOR_TYPES.TEXT]: {
          idReadableString: TEXT_EDITOR_ID_READABLE_STRING,
          controls: [...defaultButtons, linkButton, updateTextButton],
          createEditor: createTextEditor,
        },
        [EDITOR_TYPES.IMAGE]: {
          idReadableString: IMAGE_PICKER_ID_READABLE_STRING,
          controls: [...defaultButtons, updateImageButton],
          createEditor: createImageEditor,
        },
      };
      types[EDITOR_TYPES.HEADING] = types.text;
      types[EDITOR_TYPES.PARAGRAPH] = types.text;
      const type = types[editorType];

      const editorId = getUniqueId(type.idReadableString);

      const editElements = type.createEditor({
        id: editorId,
        confirmButtonLabel: updateButtonLabel,
        content: originalContent,
        tagName,
        altTextContent,
        hrefContent: "",
        // TODO
        style: element.style as unknown as { [key: string]: string },
      });

      if (!editElements) return;

      const {
        editor,
        editorLabel,
        tagPicker,
        tagPickerLabel,
        altEditor,
        altEditorLabel,
        alignSelect,
        imagePreview,
        hrefEditor,
        hrefEditorLabel,
      } = editElements;

      let buttonsContainerElement = createElement({
        classList: [EDIT_BUTTONS_CLASS],
      });

      let editorContainerElement = createElement({
        classList: [EDIT_CONTAINER_CLASS],
        id: getEditorContainerId(editorId),
      });

      const originalDisplay = element.style.display;
      // element.style.display = "none";

      type.controls.forEach((i) => {
        let buttonElement = createElement({
          tag: ElementTag.BUTTON,
          classList: [`${slugify(i.label)}-button`],
        });
        buttonElement.id = getButtonId(i.label, editorId);
        buttonElement.disabled = i.initiallyDisabled;
        buttonElement.innerHTML = i.label;
        insertElementWithinElement(buttonsContainerElement, buttonElement);
        buttonElement.addEventListener(
          EventType.CLICK,
          async function (_event: Event) {
            if (!i || !i.updateElement) return;
            const success = await i.updateElement({
              editorElement: editor,
              tagNameSelect: tagPicker ?? undefined,
              alignSelectElement: alignSelect,
              altTextEditor: altEditor ?? undefined,
              hrefEditor: hrefEditor ?? undefined,
              originalElement: element,
              editorId,
            });
            if (success) {
              editorContainerElement.remove();
              element.style.display = originalDisplay;
            }
          },
        );
      });

      // TODO insertAdjancentElement
      element.insertAdjacentElement(
        InsertPosition.BEFORE_BEGIN,
        editorContainerElement,
      );
      // Reverse so labels are placed above inputs except for editor
      const editElementsArray = [
        [editor, editorLabel],
        [tagPickerLabel, tagPicker],
        [alignSelect],
        [imagePreview],
        [altEditorLabel, altEditor],
        [hrefEditorLabel, hrefEditor],
        [buttonsContainerElement],
      ];

      // TODO any
      editElementsArray.forEach((editorGroup: any) => {
        if (!editorGroup) return;
        const editorSubContainer = createElement({
          classList: [EDITOR_SUB_CONTAINER_CLASS],
        });
        let count = 0;
        editorGroup.forEach((editorElement: HTMLElement | undefined) => {
          if (!editorElement) return;
          insertElementWithinElement(editorSubContainer, editorElement);
          count += 1;
        });
        if (count > 0) {
          insertElementWithinElement(
            editorContainerElement,
            editorSubContainer,
          );
        }
      });

      editor.focus();
      // editor.select();
    }

    // V2:

    element.contentEditable = "true";

    element.id = id;
    const originalHtml = element.innerHTML;
    const originalHtmlEscaped = encodeURIComponent(originalHtml);
    element.setAttribute("data-original-html", originalHtmlEscaped);

    const toolbar = createElement({
      classList: [EDIT_UI_CONTAINER_CLASS],
      id: CURRENTLY_EDITING_TOOLBAR_ID,
    });

    const updateButtonLabel = BUTTON_SAVE;

    const linkButton: EditorButtonConfig = {
      label: BUTTON_LINK,
      initiallyDisabled: false,
      updateElement: async ({ editorId }: { editorId?: string }) => {
        // TODO unnecessary check
        if (!editorId) return undefined;
        const elementWithSelection = document.getElementById(editorId);
        if (!(elementWithSelection instanceof HTMLParagraphElement)) return;
        elementWithSelection.innerHTML =
          addLinkAroundSelection(elementWithSelection);
      },
    };

    const _updateTextButton: EditorButtonConfig = {
      label: updateButtonLabel,
      initiallyDisabled: false,
      updateElement: updateTextCallback,
    };

    const _updateImageButton: EditorButtonConfig = {
      label: updateButtonLabel,
      initiallyDisabled: true,
      updateElement: updateImageCallback,
    };

    const defaultButtons: Array<EditorButtonConfig> = [];

    let types = {
      [EDITOR_TYPES.TEXT]: {
        idReadableString: TEXT_EDITOR_ID_READABLE_STRING,
        controls: [...defaultButtons, linkButton, _updateTextButton],
        createEditor: createTextEditor,
      },
      [EDITOR_TYPES.IMAGE]: {
        idReadableString: IMAGE_PICKER_ID_READABLE_STRING,
        controls: [...defaultButtons, _updateImageButton],
        createEditor: createImageEditor,
      },
    };
    types[EDITOR_TYPES.HEADING] = types.text;
    types[EDITOR_TYPES.PARAGRAPH] = types.text;
    const type = types[editorType];

    const buttonsContainerElement = getButtons();

    // TODO Not for new elements
    insertElementWithinElement(toolbar, buttonsContainerElement);

    console.log(element.id);
    insertElementToDOM(element.id, toolbar, InsertPosition.AFTER_END);

    element.focus();
  };
}
