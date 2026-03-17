import { ElementTag } from "../../types";
import { CURRENTLY_EDITING_FORMATTING_ID } from "../../util/constants";
import { createElement } from "../util/createElement";

export function getFormattingPanel() {
    const formattingPanel = createElement({
        tag: ElementTag.DIV,
        id: CURRENTLY_EDITING_FORMATTING_ID
    })

    return formattingPanel
}