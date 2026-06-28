const VERSION = 1;
const PREFIX = "censusops";

function getKey(key) {
  return `${PREFIX}:v${VERSION}:${key}`;
}

export function loadStoredValue(key, fallback) {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(getKey(key));
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function saveStoredValue(key, value) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(getKey(key), JSON.stringify(value));
}

export function clearStoredValue(key) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(getKey(key));
}
