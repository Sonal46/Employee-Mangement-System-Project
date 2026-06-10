const defaultApiUrl = "http://127.0.0.1:5000/api";

const normalizeApiUrl = (value) => {
  const raw = (value || defaultApiUrl).trim().replace(/\/+$/, "");

  if (raw.endsWith("/api")) {
    return raw;
  }

  return `${raw}/api`;
};

export const API_URL = normalizeApiUrl(import.meta.env.VITE_API_URL);

export const API_ORIGIN = (() => {
  try {
    return new URL(API_URL).origin;
  } catch {
    return API_URL.replace(/\/api$/, "");
  }
})();

export const resolveBackendUrl = (path = "") => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_ORIGIN}${normalizedPath}`;
};
