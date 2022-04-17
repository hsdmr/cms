
import { checkAuth } from "src/scripts/auth.js";
import { getSessionItem } from "src/scripts/session.js";

export const search = async (apiUrl, success) => {
  await checkAuth();
  const auth = getSessionItem("auth");

  const res = await fetch(apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: auth.access_token,
    },
  });

  const response = await res.json();

  if (res.ok) {
    toastr.success(success);
  } else {
    toastr.error(response.message);
  }

  return response;
};

export const create = async (apiUrl, success, body) => {
  await checkAuth();
  const auth = getSessionItem("auth");

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: auth.access_token,
    },
    body: JSON.stringify(body),
  });

  const response = await res.json();

  if (res.ok) {
    toastr.success(success);
  } else {
    toastr.error(response.message);
  }

  return response;
};

export const read = async (apiUrl, id, success = "") => {
  await checkAuth();
  const auth = getSessionItem("auth");

  const res = await fetch(apiUrl + `/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: auth.access_token,
    },
  });
  
  const response = await res.json();

  if (res.ok) {
    //toastr.success(success);
  } else {
    toastr.error(response.message);
  }

  return response;
};

export const update = async (apiUrl, id, success, body) => {
  await checkAuth();
  const auth = getSessionItem("auth");

  const res = await fetch(apiUrl + `/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: auth.access_token,
    },
    body: JSON.stringify(body),
  });

  const response = await res.json();

  if (res.ok) {
    toastr.success(success);
  } else {
    toastr.error(response.message);
  }

  return response;
};

export const destroy = async (apiUrl, id, success) => {
  await checkAuth();
  const auth = getSessionItem("auth");

  const res = await fetch(apiUrl + `/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: auth.access_token,
    },
  });

  if (res.ok) {
    toastr.success(success);
  } else {
    toastr.error(response.message);
  }
  
};
