const DEFAULT_SCROLL_PARENT = 'BODY';

function isScrollParent(element: HTMLElement): boolean {
  try {
    const { overflow, overflowY, overflowX } = getComputedStyle(element);
    return /(auto|scroll)/.test(overflow + overflowX + overflowY);
  } catch (e) {
    return false;
  }
}

export function getScrollParent(element: HTMLElement): HTMLElement {
  if (!element || element.tagName === DEFAULT_SCROLL_PARENT) {
    return document.body;
  }
  if (isScrollParent(element)) {
    return element;
  }
  return getScrollParent(element.parentElement);
}

export default function getScrollParents(
  element: HTMLElement,
  scrollParents: HTMLElement[] = []
): HTMLElement[] {
  if (!element || element.tagName === DEFAULT_SCROLL_PARENT) {
    return [...scrollParents, document.body];
  }

  return getScrollParents(
    element.parentElement,
    isScrollParent(element) ? [...scrollParents, element] : scrollParents
  );
}
