import { JWTPayload } from "../interfaces";

export const getToken = (): string | null => localStorage.getItem("token");

export const getUser = (): JWTPayload | null => {
  const user = localStorage.getItem("user");
  if (!user) return null;

  try {
    return JSON.parse(user) as JWTPayload;
  } catch {
    return null;
  }
};

export const logout = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};
