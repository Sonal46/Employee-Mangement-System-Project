import axios from "axios";

const defaultBaseURL = import.meta.env.PROD ? "/api" : "http://127.0.0.1:5000/api";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || defaultBaseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("payroll_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
