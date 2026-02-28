const BASE_URL = "http://localhost:8080";

export const apiFetch = async (url, options = {}) => {

  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: "Bearer " + token }),
    ...options.headers
  };

  const response = await fetch(BASE_URL + url, {
    ...options,
    headers
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "API Error");
  }

  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    return response.json();
  } else {
    return response.text();
  }
};