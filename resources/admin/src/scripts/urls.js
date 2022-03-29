let href = window.location.href;
let path = window.location.pathname;
let root;

if (path != '/') {
  root = href.split(path)[0]
}

export const APP_ROOT = root ?? href.slice(0, -1);

let apiUrl = 'http://localhost:8080/v2';

export const urls = {
  login: `${apiUrl}/login`,
  register: `${apiUrl}/register`,
  forgetPassword: `${apiUrl}/forget-password`,
  admin: `${apiUrl}/admin`,
  
  user: `${apiUrl}/user`,
  user_id: `${apiUrl}/user`,
}