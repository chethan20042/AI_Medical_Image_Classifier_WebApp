import axios from "axios";


const api = axios.create({
  baseURL: "http://127.0.0.1:5000",
});


// ---------------------------------------------------------
// REQUEST INTERCEPTOR
// Automatically attach JWT
// ---------------------------------------------------------

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);


// ---------------------------------------------------------
// RESPONSE INTERCEPTOR
// Handle expired or invalid JWT
// ---------------------------------------------------------

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      const publicRoutes = [
        "/",
        "/login",
        "/register",
      ];

      const currentPath =
        window.location.pathname;

      if (
        !publicRoutes.includes(currentPath)
      ) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);


export default api;