export function isDevEnv(): boolean {
  return window.location.hostname === "localhost";
}
