import "./style.css";
import { localEditingMode } from "./local";
import { isDevEnv } from "./local/util/isDevEnv";

/* Check for local file or test environment */
const isLocal: boolean =
  window.location.protocol === "file:" ||
  isDevEnv() ||
  window.navigator.userAgent.includes("jsdom");

if (isLocal) localEditingMode();
