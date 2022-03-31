let href = window.location.href;
let path = window.location.pathname;
let root;

if (path != '/') {
  root = href.split(path)[0]
}

export const APP_ROOT = root ?? href.slice(0, -1);

let apiUrl = 'http://localhost:8000/v2';

export const api = {
  login: `${apiUrl}/login`,
  logout: `${apiUrl}/logout`,
  check: `${apiUrl}/check`,
  register: `${apiUrl}/register`,
  forgetPassword: `${apiUrl}/forget-password`,
  admin: `${apiUrl}/admin`,
  
  user: `${apiUrl}/user`,
  user_id: `${apiUrl}/user`,
}

export const route = {
  login: `login`,
  register: `register`,
  forgetPassword: `forget-password`,
  admin: `admin`,
  home: `/`,
  
  users: `users`,
  user_id: `user/{user_id}`,

  layouts: `layouts`,
}