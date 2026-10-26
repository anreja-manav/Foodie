
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const BASE_URL = import.meta.env.VITE_API_URL;

export const isTokenExpiring = (bufferTime = 2 * 60 * 1000) => {
  const token = localStorage.getItem("accessToken");

  if (!token) return false;

  try {
    const decoded = jwtDecode(token);

    if (!decoded.exp) return true;

    return decoded.exp * 1000 - Date.now() < bufferTime;
  } catch {
    return true;
  }
};

export const refreshToken = async () => {
  const refresh = localStorage.getItem("refreshToken");

  if (!refresh) {
    throw new Error("Refresh token not found");
  }

  const res = await axios.post(
    `${BASE_URL}/accounts/token/refresh/`,
    { refresh },
    { withCredentials: true }
  );

  if (!res.data?.access) {
    throw new Error("Refresh response did not contain an access token");
  }

  localStorage.setItem("accessToken", res.data.access);

  if (res.data.refresh) {
    localStorage.setItem("refreshToken", res.data.refresh);
  }

  return res.data.access;
};
