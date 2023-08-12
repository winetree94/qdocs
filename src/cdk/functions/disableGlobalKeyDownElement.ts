export const disableGlobalKeyDownElement = (
  element: HTMLElement | Element,
): boolean => {
  if (['INPUT', 'TEXTAREA'].includes(element.tagName)) {
    return true;
  }

  if (element.getAttribute('data-enables-text-edit') === 'true') {
    return true;
  }

  return false;
};
