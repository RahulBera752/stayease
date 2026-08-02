import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Hardcoded to backend port 5000
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || "Something went wrong. Please try again.";
    return Promise.reject({ ...error, message });
  }
);

export default api;