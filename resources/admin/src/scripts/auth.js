import { api } from "src/scripts/links.js";
import { deleteSessionItem } from "src/scripts/session.js";
import { setSessionItem } from "./session";

export const registerUser = async (user, password) => {
  return fetch(api.login, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ user, password }),
  })
    .then((response) => {
      if (!response.ok) {
        console.error(`HTTP error: ${response.status}`);
      }
      return response.json();
    }).then((user) => {
      if (typeof user.message !== 'undefined') {
        deleteSessionItem('auth');
        return user;
      }
      if (typeof user.access_token !== 'undefined') {
        deleteSessionItem('auth');
        return setSessionItem('auth', user);
      }
    })
    .catch((err) => console.error(`Fetch problem: ${err.message}`));
};

export const getUserDetails = async (user, password) => {
  return fetch(api.login, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ user, password }),
  })
    .then((response) => {
      if (!response.ok) {
        console.error(`HTTP error: ${response.status}`);
      }
      return response.json();
    }).then((user) => {
      if (typeof user.message !== 'undefined') {
        deleteSessionItem('auth');
        return user;
      }
      if (typeof user.access_token !== 'undefined') {
        deleteSessionItem('auth');
        return setSessionItem('auth', user);
      }
    })
    .catch((err) => console.error(`Fetch problem: ${err.message}`));
};

export const checkUserDetails = async (access_token) => {
  return fetch(api.check, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "authorization": access_token
    },
  })
    .then((response) => {
      if (!response.ok) {
        console.error(`HTTP error: ${response.status}`);
      }
      return response.json();
    }).then((user) => {
      if (typeof user.message !== 'undefined') {
        deleteSessionItem('auth');
        return user;
      }
      if (typeof user.access_token !== 'undefined') {
        deleteSessionItem('auth');
        return setSessionItem('auth', user);
      }
    })
    .catch((err) => console.error(`Fetch problem: ${err.message}`));
};

export const deleteUserDetails = async (access_token) => {
  return fetch(api.logout, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "authorization": access_token
    },
  })
    .then((response) => {
      if (!response.ok) {
        console.error(`HTTP error: ${response.status}`);
      }
      return deleteSessionItem('auth');
    })
    .catch((err) => console.error(`Fetch problem: ${err.message}`));
};
