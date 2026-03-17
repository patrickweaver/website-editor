import { GLOBALS } from "../../../globals";
import { addLinkAroundSelection } from "../util/addLinkAroundSelection";
import {
  EDIT_BUTTONS_CLASS,
  EDIT_CONTAINER_CLASS,
  EDITOR_SUB_CONTAINER_CLASS,
  EDITOR_TYPES,
  IMAGE_PICKER_ID_READABLE_STRING,
  TEXT_EDITOR_ID_READABLE_STRING,
} from "../../util/constants";
import {
  EditorButton,
  EditorButtonUpdateCallback,
  EventType,
  ImgElementProperty,
  InsertPosition,
  TextElementProperty,
  ElementTag,
} from "../../types";
import { showAlert } from "../util/alert";
import { getUniqueId } from "../../util/random";
import { createElement } from "../util/createElement";
import { createImageEditor } from "../util/createImageEditor";
import { createTextEditor } from "../util/createTextEditor";
import { prepareImageForEditor } from "../util/prepareImageForEditor";
import { prepareTextForEditor } from "../util/prepareTextForEditor";
import {
  getButtonId,
  getEditorContainerId,
  renderWhitespaceForHTML,
  slugify,
  trimHTML,
} from "../../util/stringUtils";
import { insertElementWithinElement } from "../util/insertElementWithinElement";
import {
  BUTTON_CANCEL,
  BUTTON_DELETE,
  BUTTON_LINK,
  BUTTON_SAVE,
  BUTTON_UPDATE,
  CONFIRM_DELETE,
} from "../../util/strings";

export function makeElementEventListener(editorType: string) {
  return function (event: Event, isExistingElement: boolean = true) {
    const element = event.currentTarget;
    if (
      !(element instanceof HTMLHeadingElement) &&
      !(element instanceof HTMLParagraphElement) &&
      !(element instanceof HTMLImageElement)
    ) {
      showAlert("Invalid element");
      return;
    }

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

    const deleteButton: EditorButton = {
      label: BUTTON_DELETE,
      initiallyDisabled: false,
      updateElement: async ({
        editorElement,
        originalElement,
      }: {
        editorElement?: HTMLParagraphElement | HTMLInputElement;
        originalElement?:
          | HTMLImageElement
          | HTMLParagraphElement
          | HTMLHeadingElement;
      }) => {
        const result = window.confirm(CONFIRM_DELETE);
        if (!result) return;
        editorElement?.remove();
        originalElement?.remove();
        return true;
      },
    };

    const cancelButton: EditorButton = {
      label: BUTTON_CANCEL,
      initiallyDisabled: false,
      updateElement: async ({}) => true,
    };

    const linkButton: EditorButton = {
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

    const updateButtonLabel = isExistingElement ? BUTTON_UPDATE : BUTTON_SAVE;

    const updateTextCallback: EditorButtonUpdateCallback = async ({
      editorElement,
      tagNameSelect,
      alignSelectElement,
      altTextEditor: _altTextEditor,
      originalElement,
      editorId: _editorId,
    }: {
      editorElement?: HTMLInputElement | HTMLTextAreaElement;
      tagNameSelect?: HTMLSelectElement;
      alignSelectElement?: HTMLFieldSetElement;
      altTextEditor?: HTMLInputElement;
      originalElement?: HTMLHeadingElement | HTMLParagraphElement;
      editorId?: string;
    }) => {
      if (!editorElement || !alignSelectElement || !originalElement)
        return undefined;
      const tagName = tagNameSelect?.value ?? ElementTag.P;
      const updatedTextElement = prepareTextForEditor({
        editorId: editorElement.id,
        tagName: tagName as ElementTag,
        alignSelectElement,
        text: renderWhitespaceForHTML(
          editorElement?.value ?? editorElement?.innerHTML ?? "",
        ),
      });
      return elementUpdateCleanup(updatedTextElement, originalElement, [
        TextElementProperty.INNER_HTML,
        TextElementProperty.STYLE,
        TextElementProperty.TAG_NAME,
      ]);
    };

    const updateImageCallback: EditorButtonUpdateCallback = async ({
      editorElement: imagePicker,
      tagNameSelect: _tagNameSelect,
      alignSelectElement,
      altTextEditor,
      hrefEditor,
      originalElement,
      editorId: _editorId,
    }: {
      editorElement?: HTMLInputElement | HTMLTextAreaElement;
      tagNameSelect?: HTMLSelectElement;
      alignSelectElement?: HTMLFieldSetElement;
      altTextEditor?: HTMLInputElement;
      hrefEditor?: HTMLInputElement;
      originalElement?:
        | HTMLImageElement
        | HTMLParagraphElement
        | HTMLHeadingElement;
      editorId?: string;
    }) => {
      if (
        !imagePicker ||
        !altTextEditor ||
        !hrefEditor ||
        !alignSelectElement ||
        !originalElement
      ) {
        console.log("Missing required elements for image update");
        return undefined;
      }
      // TODO remove check
      if (!(originalElement instanceof HTMLImageElement)) return undefined;
      const updatedImageElement = await prepareImageForEditor({
        filePickerId: imagePicker.id,
        altText: altTextEditor?.value,
        href: hrefEditor?.value,
        alignSelectElement,
        originalElement,
      });
      if (!updatedImageElement) {
        showAlert("Invalid update");
        return;
      }
      return imgElementUpdateCleanup(
        updatedImageElement,
        originalElement,
        // 🚸 TODO check alignment dirty
        [
          ImgElementProperty.ALT,
          ImgElementProperty.SRC,
          ImgElementProperty.STYLE,
        ],
      );
    };

    function elementUpdateCleanup(
      updatedElement: HTMLElement,
      originalElement: HTMLElement,
      propertyArray: TextElementProperty[],
    ) {
      if (!updatedElement) return false;
      const _editingStateDirty = propertyArray.some((p) => {
        const updatedValue = updatedElement?.[p];
        const originalValue = originalElement?.[p];
        // 🚸 TODO only check relevant sub properties for style
        // https://github.com/patrickweaver/website-editor/issues/87
        return updatedValue !== originalValue;
      });
      originalElement.remove();
      GLOBALS.EDITING_STATE_DIRTY =
        GLOBALS.EDITING_STATE_DIRTY || _editingStateDirty;
      return true;
    }

    function imgElementUpdateCleanup(
      updatedElement: HTMLImageElement,
      originalElement: HTMLImageElement,
      propertyArray: ImgElementProperty[],
    ) {
      if (!updatedElement) return false;
      const _editingStateDirty = propertyArray.some((p) => {
        const updatedValue = updatedElement?.[p];
        const originalValue = originalElement?.[p];
        // 🚸 TODO only check relevant sub properties for style
        // https://github.com/patrickweaver/website-editor/issues/87
        return updatedValue !== originalValue;
      });
      // TODO need to remove the original anchor tag also.
      originalElement.remove();
      GLOBALS.EDITING_STATE_DIRTY =
        GLOBALS.EDITING_STATE_DIRTY || _editingStateDirty;
      return true;
    }

    const updateTextButton: EditorButton = {
      label: updateButtonLabel,
      initiallyDisabled: false,
      updateElement: updateTextCallback,
    };

    const updateImageButton: EditorButton = {
      label: updateButtonLabel,
      initiallyDisabled: true,
      updateElement: updateImageCallback,
    };

    const defaultButtons: Array<EditorButton> = [deleteButton];
    if (isExistingElement) {
      defaultButtons.unshift(cancelButton);
    }

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
    element.style.display = "none";

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
        insertElementWithinElement(editorContainerElement, editorSubContainer);
      }
    });

    editor.focus();
    // editor.select();
  };
}
