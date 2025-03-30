export function getUniqueId(readableString: string = "element") {
  return `${readableString}-${Math.random().toString(10).slice(2, 12)}`;
}
