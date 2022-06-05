import { saveFile } from "../util/files";
import { getBodyBackgroundColor } from "../util/dom";
import { enableLocalControls } from "./enable";
import { LOCAL_CONTROLS_ID } from "../constants";

export async function handleSaveChanges(_event) {
  const localControls = document.getElementById(LOCAL_CONTROLS_ID);
  localControls.remove();
  const htmlSourceCode = `
            <!DOCTYPE html>
            <html lang="${document.documentElement.lang}"  id="html-element">
              <head>
                ${document.head.innerHTML}
              </head>
              <body
                style="
                  background-color: ${getBodyBackgroundColor()};
                  text-align: ${document.body.style.textAlign};
                  align-items: ${document.body.style.alignItems};
                ">
                ${document.body.innerHTML}
              </body>
            </html>
          `;
  try {
    await saveFile(htmlSourceCode);
  } catch (error) {
    if (error?.message === "The user aborted a request.") {
      // Error is just cancel button
    } else {
      alert(error?.message ?? "Error saving file.");
    }
  }
  enableLocalControls();
}
