import {
  LOCAL_CONTROLS_CONTAINER_ID,
  LOCAL_CONTROLS_ID,
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
    container.style.setProperty("margin-top", "25rem");
  } else {
    localControls.style.setProperty("display", "none");
    localControlsMinimized.style.setProperty("display", "block");
    container.style.setProperty("margin-top", "4rem");
  }
}
