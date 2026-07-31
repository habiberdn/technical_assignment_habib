import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token tidak valid atau kadaluwarsa, bisa memicu redirect jika bukan rute login
      if (window.location.pathname !== "/login") {
        console.warn("[API Interceptor] Sesi telah kadaluwarsa. Mengarahkan ke halaman login...");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
