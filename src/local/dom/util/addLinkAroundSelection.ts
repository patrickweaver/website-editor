import {
  ERROR_INVALID_SELECTION,
  ERROR_NO_SELECTION,
  ERROR_NO_URL,
  PROMPT_LINK_URL,
} from "../../util/strings";
import { ElementTag } from "../../types";

export function addLinkAroundSelection(selectableInput: HTMLParagraphElement) {
  const currentHtml = selectableInput.innerHTML;

  const selection = window.getSelection();

  const selectionEmpty =
    !selection || selection.rangeCount === 0 || selection.isCollapsed;
  if (selectionEmpty) {
    alert(ERROR_NO_SELECTION);
    return currentHtml;
  }
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
    return currentHtml;
  }

  const range = selection.getRangeAt(0);

  const selecitonOutsideParent = !selectableInput.contains(
    range.commonAncestorContainer,
  );
  if (selecitonOutsideParent) {
    alert(ERROR_INVALID_SELECTION);
    return currentHtml;
  }
  if (!selectableInput.contains(range.commonAncestorContainer)) {
    return currentHtml;
  }

  if (isPartiallyOverlappingAnchor(range, selectableInput)) {
    alert("Error: Selection overlaps an existing link.");
    return currentHtml;
  }

  const fragment = range.extractContents();
  stripNestedAnchors(fragment);

  const href = window.prompt(PROMPT_LINK_URL);
  if (!href) {
    alert(ERROR_NO_URL);
    return currentHtml;
  }

  const anchor = document.createElement(ElementTag.A);
  anchor.href = href;
  anchor.target = "_blank";
  anchor.appendChild(fragment);

  range.insertNode(anchor);
  selectableInput.normalize();

  selection.removeAllRanges();
  const newRange = document.createRange();
  newRange.selectNodeContents(anchor);
  selection.addRange(newRange);
  return selectableInput.innerHTML;
}

function stripNestedAnchors(fragment: DocumentFragment): void {
  const anchors = fragment.querySelectorAll("a");
  for (const anchor of anchors) {
    const parent = anchor.parentNode!;
    while (anchor.firstChild) {
      parent.insertBefore(anchor.firstChild, anchor);
    }
    parent.removeChild(anchor);
  }
}

function isPartiallyOverlappingAnchor(
  range: Range,
  container: HTMLElement,
): boolean {
  const anchors = container.querySelectorAll(ElementTag.A);

  for (const anchor of anchors) {
    if (!range.intersectsNode(anchor)) continue;

    const anchorRange = document.createRange();
    anchorRange.selectNodeContents(anchor);

    const startsAtOrBefore =
      range.compareBoundaryPoints(Range.START_TO_START, anchorRange) <= 0;
    const endsAtOrAfter =
      range.compareBoundaryPoints(Range.END_TO_END, anchorRange) >= 0;

    if (!(startsAtOrBefore && endsAtOrAfter)) {
      return true;
    }
  }

  return false;
}
