export function localStorageGetItem(key: string): any {
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

export function localStorageRemoveItem(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    //
  }
}

export function localStorageSetItem(key: string, value: any): void {
  try {
    return window.localStorage.setItem(key, value);
  } catch (error) {
    //
  }
}

export function inspectElement(inspectedElement: HTMLElement) {
  const element = {
    classes: [...inspectedElement.classList].filter(Boolean),
  };

  return element;
}

export function toggleClassList(
  inspectedElement: HTMLElement,
  name: string,
  active: boolean
) {
  inspectedElement.classList.toggle(name, active);
}

export function setClassList(inspectedElement: HTMLElement, classList: string) {
  inspectedElement.className = classList;
}

export type InspectedElement = ReturnType<typeof inspectElement>;

export function injectCSS(css: string) {
  if (typeof window === "undefined") {
    return;
  }
  const tailwindId = "__tailwindcss";

  let style = document.getElementById(tailwindId);

  if (style === null) {
    style = document.createElement("style");
    style.id = tailwindId;
    document.head.append(style);
  }

  style.textContent = css;
}
