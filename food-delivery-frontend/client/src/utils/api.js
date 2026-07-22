import axios from "axios";
import { isTokenExpiring, refreshToken } from "./auth";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

const publicRoutes = [
    "/accounts/login/",
    "/accounts/register/",
    "/accounts/token/refresh/",
    "/accounts/send-otp/",
    "/accounts/verify-otp/",
    "/accounts/forgot-password/",
];

api.interceptors.request.use(
    async (config) => {
        const url = config.url || "";

        const isPublicRoute =
            publicRoutes.some(route => url.includes(route)) ||
            /\/accounts\/\d+\/verify_otp\/?$/.test(url) ||
            /\/accounts\/\d+\/regenerate_otp\/?$/.test(url) ||
            /\/accounts\/forgot_password\/\d+\/confirm\/?$/.test(url);

        if (isPublicRoute) {
            return config;
        };

        let token = localStorage.getItem("accessToken");

        if (token && isTokenExpiring()) {

            try {

                token = await refreshToken();

            } catch (err) {

                window.location.href = "/login";

                return Promise.reject(err);

            }

        }

        if (token) {

            config.headers.Authorization = `Bearer ${token}`;

        }

        return config;

    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(

    (response) => response,

    async (error) => {

        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {

            originalRequest._retry = true;

            try {

                const token = await refreshToken();

                originalRequest.headers.Authorization =
                    `Bearer ${token}`;

                return api(originalRequest);

            } catch (err) {

                localStorage.clear();

                window.location.href = "/login";

                return Promise.reject(err);

            }

        }

        return Promise.reject(error);

    }

);





// Get
export const fetchDataFromApi = async (url) => {
    try {
        const { data } = await api.get(url);
        return data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Post
export const postData = async (url, formData) => {
    try {
        const response = await api.post(url, formData);
        return response.data; 
    } catch (error) {
        console.error('API Error:', error.response?.data || error.message);
        return error.response?.data;
    }
};

// Update (PATCH)
export const editData = async (url, updatedData) => {
    try {
        const response = await api.patch(url, updatedData);
        return response.data;
    } catch (error) {
        console.error('Edit Error:', error.response?.data);
        return error.response?.data;
    }
};

// Upload Image (PUT)
export const uploadImage = async (url, updatedData) => {
    try {
        const response = await api.put(url, updatedData);
        return response.data;
    } catch (error) {
        return error.response?.data || error;
    }
};

// Delete
export const deleteData = async (url) => {
    try {
        const response = await api.delete(url);
        return response.data;
    } catch (error) {
        return error.response?.data || error;
    }
};