import axios from "axios";

// Toggle to keep UI working without a real backend.
export const USE_MOCK = true;

const api = axios.create({
  baseURL: "/",
  timeout: 15_000,
  headers: {
    "X-RosterIQ-Client": "frontend"
  }
});

// Placeholder for auth / logging interceptors.
api.interceptors.request.use(
  (config) => {
    // Example (later): attach auth token
    // const token = getAuthToken();
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Central place for future error translation / logging.
    return Promise.reject(error);
  }
);

export default api;

