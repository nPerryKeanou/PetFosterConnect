// src/api/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

const NO_REDIRECT_ROUTES = [
  "/auth/login",
  "/auth/register",
  "/auth/signin",
  "/auth/signup",
];

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";

    const isAuthRoute = NO_REDIRECT_ROUTES.some((route) =>
      requestUrl.includes(route)
    );

    if (isAuthRoute) {
      return Promise.reject(error);
    }

    const currentPath = window.location.pathname;
    
    if (status === 401) {
      localStorage.removeItem("token"); 

      if (currentPath !== "/inscription" && currentPath !== "/connexion") {
        window.location.replace("/inscription");
      }
    } else if (status === 403 && currentPath !== "/forbidden") {
      window.location.replace("/forbidden");
    }

    return Promise.reject(error);
  }
);

export default api;
