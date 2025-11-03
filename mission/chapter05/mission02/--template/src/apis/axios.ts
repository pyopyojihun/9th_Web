// src/apis/axios.ts
import axios from "axios";
import type { AxiosRequestHeaders } from "axios";
import { getAccessToken, setAccessToken, clearAccessToken, refreshAccessToken } from "./token";

const baseURL = import.meta.env.VITE_SERVER_API_URL as string;

const api = axios.create({
  baseURL,
  withCredentials: true, // refresh_token 쿠키용
});

// 요청 인터셉터: accessToken 있으면 Authorization 붙이기
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    const h = (config.headers ?? {}) as AxiosRequestHeaders;
    h.Authorization = `Bearer ${token}`;
    // 필요한 경우 Content-Type 기본 지정
    if (!h["Content-Type"]) h["Content-Type"] = "application/json";
    config.headers = h;
  }
  return config;
});

// 응답 인터셉터: 401이면 1회에 한해 refresh → 재시도
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const status = error?.response?.status;

    // 이미 한번 시도한 요청이면 무한루프 방지
    if (status === 401 && original && !original._retry) {
      original._retry = true;
      try {
        const newAccess = await refreshAccessToken(baseURL);
        // 새로운 토큰을 헤더에 다시 삽입하고 재시도
        const h = (original.headers ?? {}) as AxiosRequestHeaders;
        h.Authorization = `Bearer ${newAccess}`;
        original.headers = h;
        setAccessToken(newAccess);
        return api(original);
      } catch (e) {
        // 리프레시 실패 → 토큰 제거 후 로그인으로 유도
        clearAccessToken();
        // 원하면 여기서 location.replace('/login') 등 처리 가능
      }
    }
    return Promise.reject(error);
  },
);

export default api;
