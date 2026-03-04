// src/api/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const requestUrl = config.url || "";
  
  // Vérifie si c'est une route qui nécessite un token
  const isAuthRoute = NO_REDIRECT_ROUTES.some((route) => requestUrl.includes(route));

  if (!token && !isAuthRoute) {
    // Si pas de token et pas une route d'auth, on redirige direct
    window.location.replace("/auth/signup"); 
    return Promise.reject("No token found, redirecting...");
  }

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
    console.log("Interceptor triggered", status, requestUrl, error.response);
    if (status === 401 && currentPath !== "/unauthorized") {
      window.location.replace("/unauthorized");
    } else if (status === 403 && currentPath !== "/forbidden") {
      window.location.replace("/forbidden");
    }

    return Promise.reject(error);
  }
);

export default api;
