import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // Use the base URL from your .env file
  withCredentials: true,  // Ensure cookies are included with requests if needed
});

// Add Authorization header with the token (if available) to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");  // Get token from localStorage
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;  // Add token to Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export function makeRequest(url, options = {}) {
  if (options.method === "DELETE" && options.data) {
    return api.delete(url, { data: options.data })
      .then(res => res.data)
      .catch(error => Promise.reject(error?.response?.data?.message ?? "Something went wrong"));
  }

  return api(url, options)
    .then(res => res.data)
    .catch(error => Promise.reject(error?.response?.data?.message ?? "Something went wrong"));
}
