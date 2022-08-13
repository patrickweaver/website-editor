export function getUniqueId(readableString) {
  return `${readableString}-${Math.random().toString().slice(2, 12)}`;
}
