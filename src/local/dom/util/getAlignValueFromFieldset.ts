export function getAlignValueFromFieldset(
  alignSelectElement: HTMLFieldSetElement,
) {
  const selectedAlign = Array.from(alignSelectElement.children)
    .map((container) => Array.from(container.children)[0])
    .filter((element) => {
      return (element as HTMLInputElement)?.checked;
    })[0];
  return (selectedAlign as HTMLInputElement)?.value;
}
