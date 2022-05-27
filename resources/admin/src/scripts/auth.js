import { api, route } from "src/scripts/links.js";
import { deleteSessionItem, getSessionItem, setSessionItem } from "src/scripts/session.js";
import { navigate } from "svelte-navigator";
import { tranlate } from "src/scripts/i18n.js";

export async function checkAuth() {
  const auth = getSessionItem("auth");
  let response = [];

  if (auth) {
    if (typeof auth.access_token !== "undefined") {
      const res = await fetch(api.check, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Authorization": auth.access_token
        },
      });

      if (res.ok) {
        return;
      }

      response = await res.json();
      if (typeof response.message !== "undefined") {
        deleteSessionItem('auth');
        toastr.error(tranlate('error.' + response.key));
      }
    }
  }

  navigate("/" + route.login);
}

export const registerUser = async (user, password) => {
  return fetch(api.login, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ user, password }),
  }).then((response) => {
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
  }).catch((err) => console.error(`Fetch problem: ${err.message}`));
};

export const getUserDetails = async (user, password) => {
  return fetch(api.login, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ user, password }),
  }).then((response) => {
    if (!response.ok) {
      console.error(`HTTP error: ${response.status}`);
      console.log(response);
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
  }).catch((err) => console.error(`Fetch problem: ${err.message}`));
};

export const deleteUserDetails = async (access_token) => {
  return fetch(api.logout, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Authorization": access_token
    },
  }).then((response) => {
    if (!response.ok) {
      console.error(`HTTP error: ${response.status}`);
    }
    return deleteSessionItem('auth');
  }).catch((err) => console.error(`Fetch problem: ${err.message}`));
};
