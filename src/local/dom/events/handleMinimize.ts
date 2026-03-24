import {
  LOCAL_CONTROLS_CONTAINER_ID,
  LOCAL_CONTROLS_ID,
  LOCAL_CONTROLS_MINIMIZED_BODY_CLASS,
  LOCAL_CONTROLS_MINIMIZED_ID,
} from "../../util/constants";

export function handleMinimize(_event: Event) {
  const localControls = document.getElementById(LOCAL_CONTROLS_ID);
  const localControlsMinimized = document.getElementById(
    LOCAL_CONTROLS_MINIMIZED_ID,
  );
  const container = document.getElementById(LOCAL_CONTROLS_CONTAINER_ID);

  if (
    !(localControls instanceof HTMLElement) ||
    !(localControlsMinimized instanceof HTMLElement) ||
    !(container instanceof HTMLElement)
  ) {
    return;
  }

  const currentlyMinimized = localControlsMinimized.style.display !== "none";

  if (currentlyMinimized) {
    localControls.style.setProperty("display", "block");
    localControlsMinimized.style.setProperty("display", "none");
    const classList = String(document.body.classList) ?? "";
    const updatedClassList = classList
      .split(" ")
      .filter((i) => i !== LOCAL_CONTROLS_MINIMIZED_BODY_CLASS)
      .join(" ");
    document.body.classList = updatedClassList;
  } else {
    localControls.style.setProperty("display", "none");
    localControlsMinimized.style.setProperty("display", "block");
    document.body.classList += ` ${LOCAL_CONTROLS_MINIMIZED_BODY_CLASS}`;
  }
}
