import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const apiUrl = import.meta.env.VITE_API_URL;

// Helper to get headers safely
const getHeaders = (isMultipart = false) => {
    const token = localStorage.getItem("accessToken");
    const headers = {
        'Content-Type': isMultipart ? 'multipart/form-data' : 'application/json',
    };
    
    // CRITICAL FIX: Only add token if it's a real string
    if (token && token !== "undefined" && token !== "null") {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

// Get
export const fetchDataFromApi = async (url) => {
    try {
        const { data } = await axios.get(`${apiUrl}${url}`, { headers: getHeaders() });
        return data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Post
export const postData = async (url, formData) => {
    try {
        const response = await axios.post(`${apiUrl}${url}`, formData, { headers: getHeaders() });
        return response.data; 
    } catch (error) {
        console.error('API Error:', error.response?.data || error.message);
        return error.response?.data; // Return server error (e.g., "Invalid OTP")
    }
};

// Update (PATCH)
export const editData = async (url, updatedData) => {
    try {
        const response = await axios.patch(`${apiUrl}${url}`, updatedData, { headers: getHeaders() });
        return response.data; // Return just the data for easier handling
    } catch (error) {
        console.error('Edit Error:', error.response?.data);
        return error.response?.data; // Return server error
    }
};

// Upload Image (PUT)
export const uploadImage = async (url, updatedData) => {
    try {
        const response = await axios.put(`${apiUrl}${url}`, updatedData, { headers: getHeaders(true) });
        return response.data;
    } catch (error) {
        return error.response?.data || error;
    }
};

// Delete
export const deleteData = async (url) => {
    try {
        const response = await axios.delete(`${apiUrl}${url}`, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        return error.response?.data || error;
    }
};