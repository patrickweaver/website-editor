export function handleUpdateBodyTextSize(event: Event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;
  const value = parseInt(target.value);
  if (isNaN(value)) return;
  document.body.style.setProperty("font-size", `${value}%`);
}
