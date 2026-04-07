import axios from "axios";

export const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL ?? "";

export const api = axios.create({
  baseURL: apiBaseUrl,
});

export function resolveApiUrl(path?: string | null) {
  if (!path) {
    return "";
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  if (!apiBaseUrl) {
    return path;
  }

  return new URL(path, apiBaseUrl).toString();
}
