export function scrollToElement(id: string) {
  const element = document.getElementById(id);
  if (!element) return;
  const elementTop = element.getBoundingClientRect().top;
  if (elementTop < 0) {
    const { scrollTop } = document.documentElement;
    const scrollTo = elementTop + scrollTop - 20;
    window.scrollTo(0, scrollTo < 0 ? 0 : scrollTo);
  }
}
