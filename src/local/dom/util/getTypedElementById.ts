export function getTypedElementById<T extends HTMLElement>(
  id: string,
  ElementType: { new (): T },
): T | null {
  const element = document.getElementById(id);
  if (!(element instanceof ElementType)) return null;
  return element;
}
