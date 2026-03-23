export function isDevEnv(): boolean {
  const { hostname, protocol } = window.location;

  if (protocol === "file:") return true;

  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "[::1]" ||
    hostname.endsWith(".local")
  );
}
