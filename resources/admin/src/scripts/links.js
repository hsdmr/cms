let href = window.location.href;
let path = window.location.pathname;
let root;

if (path != '/') {
  root = href.split(path)[0]
}

export const APP_ROOT = APP_URL ?? root ?? href.slice(0, -1);

let apiUrl = APP_URL + '/v2';

export const api = {
  login: `${apiUrl}/login`,
  logout: `${apiUrl}/logout`,
  check: `${apiUrl}/check`,
  register: `${apiUrl}/register`,
  forgetPassword: `${apiUrl}/forget-password`,
  admin: `${apiUrl}/admin`,

  layout: `${apiUrl}/layout`,
  layoutConstants: `${apiUrl}/layout/constants`,
  option: `${apiUrl}/option`,
  user: `${apiUrl}/user`,
  role: `${apiUrl}/role`,
}

export const route = {
  login: `login`,
  register: `register`,
  forgetPassword: `forget-password`,
  admin: `admin`,
  home: `/`,
  new: `new`,
  trash: `trash`,

  options: `options`,
  roles: `roles`,
  users: `users`,
  layouts: `layouts`,
}