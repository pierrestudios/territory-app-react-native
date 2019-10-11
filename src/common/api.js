import getSiteSetting from "./settings";
import UTILS from "./utils";
import reLogin from "./reLogin";

export default (url, data, type = "GET", headerData = undefined) => {
  const API_URL = getSiteSetting("apiPath");

  if (!API_URL) {
    return Promise.reject('"Server Url" is not set');
  }

  return fetch(UTILS.addSlashToUrl(API_URL) + url, {
    method: type,
    headers: {
      ...headerData,
      "Content-Type": "application/json"
    },
    body: data ? JSON.stringify(data) : undefined // Fix for Edge "TypeMismatchError"
  })
    .then(async res => {
      // console.log('res', res);
      if (
        !res.ok &&
        (res.status === 401 ||
          (!!res.statusText &&
            (res.statusText.match("Token") ||
              res.statusText.match("Unauthorized"))))
      ) {
        await reLogin();
        return Promise.reject(res.statusText);
      }

      if (!res.ok) {
        return res
          .json()
          .then(json => {
            return Promise.reject(json.error);
          })
          .catch(E => {
            return Promise.reject(E || res.statusText);
          });
      }

      return res.json();
    })
    .then(Response => {
      if ("error" in Response) {
        if (Response.error && typeof Response.error === "string") {
          return Promise.reject(Response.error);
        }

        if (
          typeof Response.error === "object" &&
          "email" in Response.error &&
          !!Response.error.email.length
        ) {
          return Promise.reject(Response.error.email[0]);
        }

        if (
          typeof Response.error === "object" &&
          "password" in Response.error &&
          !!Response.error.password.length
        ) {
          return Promise.reject(Response.error.password[0]);
        }
      }

      return Response;
    })
    .then(json => {
      if (json.token) return { data: { token: json.token } };
      return json;
    })
    .then(json => json.data)
    .catch(e => {
      console.log("Api > catch() Error", e);

      return Promise.reject(e);
    });
};

export const FileUpload = (url, formData, headerData) =>
  fetch("/api/" + url, {
    method: "POST",
    headers: {
      ...headerData
    },
    body: formData
  }).then(Response => Response.json());
