import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:3009/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (err) => Promise.reject(err)
);

axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response) {
      const path = window.location.pathname;

      const isAuthRoute =
        path.startsWith("/login") || path.startsWith("/signup");

      if (err.response.status === 401 && !isAuthRoute) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";
      }

      if (err.response.status === 500) {
        console.error("Server error:", err.response.data);
      }
    } else if (err.code === "ECONNABORTED") {
      return Promise.reject({
        message: "Request timed out. Please try again.",
      });
    }

    return Promise.reject(err);
  }
);