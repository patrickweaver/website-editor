export function getUniqueId(readableString: string = "element") {
  return `${readableString}-${Math.random().toString(36).slice(2, 12)}`;
}
