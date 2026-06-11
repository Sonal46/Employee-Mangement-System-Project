const trimTrailingSlash = (value) => value.replace(/\/+$/, "");

export const splitEnvList = (value) =>
  (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export const getPublicBaseUrl = () => {
  const value =
    process.env.PUBLIC_URL ||
    process.env.SERVER_URL ||
    "";

  return value ? trimTrailingSlash(value) : "";
};

export const toPublicUrl = (path) => {
  if (!path) {
    return path;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const baseUrl = getPublicBaseUrl();
  if (!baseUrl) {
    return path;
  }

  return `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
};

