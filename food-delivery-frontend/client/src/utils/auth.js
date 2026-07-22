import axios from "axios";
import { jwtDecode } from "jwt-decode";

const BASE_URL = import.meta.env.VITE_API_URL;

export const isTokenExpiring = (bufferTime = 2 * 60 * 1000) => {
    const token = localStorage.getItem("accessToken");

    if (!token) return true;

    try {
        const decoded = jwtDecode(token);

        const expiryTime = decoded.exp * 1000;
        const currentTime = Date.now();

        return (expiryTime - currentTime) < bufferTime;

    } catch (err) {
        return true;
    }
};

export const refreshToken = async () => {

    const refresh = localStorage.getItem("refreshToken");

    if (!refresh)
        throw new Error("Refresh token not found");

    try {

        const res = await axios.post(
            `${BASE_URL}/accounts/token/refresh/`,
            {
                refresh
            }
        );

        localStorage.setItem("accessToken", res.data.access);

        
        if (res.data.refresh) {
            localStorage.setItem(
                "refreshToken",
                res.data.refresh
            );
        }

        return res.data.access;

    } catch (err) {

        localStorage.clear();

        throw err;
    }

};