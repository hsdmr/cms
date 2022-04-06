
import { checkAuth } from "src/scripts/auth.js";
import { getSessionItem } from "src/scripts/session.js";

export const create = async (apiUrl, body) => {
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
  }
  );
  const response = await res.text();

  if (res.ok) {
    return response;
  } else {
    throw new Error(response);
  }
};

export const read = async (apiUrl, id) => {
  await checkAuth();
  const auth = getSessionItem("auth");

  const res = await fetch(apiUrl + `/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: auth.access_token,
    },
  }
  );
  const response = await res.text();

  if (res.ok) {
    return response;
  } else {
    throw new Error(response);
  }
};

export const update = async (apiUrl, id, body) => {
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
  }
  );
  const response = await res.text();

  if (res.ok) {
    return response;
  } else {
    throw new Error(response);
  }
};
