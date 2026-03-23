import "./style.css";
import { localEditingMode } from "./local";
import { isDevEnv } from "./local/util/isDevEnv";

/* Check for local file */
const isLocal: boolean = window.location.protocol === "file:" || isDevEnv();

if (isLocal) localEditingMode();
