// src/apis/axios.ts
import axios from "axios";
import { LOCAL_STORAGE_KEY } from "../constans/key";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL ?? "http://localhost:8000",
  withCredentials: false,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
  if (token) {
    // axios v1에서는 config.headers가 AxiosHeaders일 수도, 평범한 객체일 수도 있음
    const h = config.headers as any;
    if (h && typeof h.set === "function") {
      h.set("Authorization", `Bearer ${token}`);
    } else {
      config.headers = {
        ...(config.headers || {}),
        Authorization: `Bearer ${token}`,
      } as any;
    }
  }
  return config;
});

export default axiosInstance;
