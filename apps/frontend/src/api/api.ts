// src/api/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    const currentPath = window.location.pathname;

    if (status === 401 && currentPath !== "/unauthorized") {
      window.location.replace("/unauthorized");
    } else if (status === 403 && currentPath !== "/forbidden") {
      window.location.replace("/forbidden");
    }

    return Promise.reject(error);
  }
);

export default api;
