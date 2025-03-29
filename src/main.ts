import "./style.css";
import { localEditingMode } from "./local";

/* Check for local file */
const env: string = process.env.NODE_ENV ?? "";
const isLocal: boolean =
  window.location.protocol === "file:" ||
  env.slice(0, 3).toLowerCase() === "dev";
if (isLocal) localEditingMode();
