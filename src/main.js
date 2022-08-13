import "./style.css";
import { localEditingMode } from "./local";

/* Check for local file */
const env = process.env.NODE_ENV;
const isLocal =
  window.location.protocol === "file:" ||
  env.slice(0, 3).toLowerCase() === "dev";
if (isLocal) localEditingMode();
