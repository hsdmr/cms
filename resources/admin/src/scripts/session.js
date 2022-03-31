export function getSessionItem(key, value) {
  return JSON.parse(sessionStorage.getItem(key));
}

export function setSessionItem(key, value) {
  sessionStorage.setItem(key, JSON.stringify(value));
  return JSON.parse(sessionStorage.getItem(key))
}

export function deleteSessionItem(key) {
  sessionStorage.removeItem(key);
  return true;
}

export function clearSession() {
  sessionStorage.clear();
  return true;
}