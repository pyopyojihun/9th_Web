// src/apis/auth.ts
import api from "./axios";
import type {
  ResquestSigninDto,
  RequestSignupDto,
  ResponseSigninDto,
  ResponseSingupDto,
  ResponseMyInfoDto,
} from "../types/auth";

export const postSignup = async (body: RequestSignupDto) => {
  const { data } = await api.post<ResponseSingupDto>("/v1/auth/signup", body);
  return data;
};

export const postSignin = async (body: ResquestSigninDto) => {
  const { data } = await api.post<ResponseSigninDto>("/v1/auth/signin", body, {
    withCredentials: true, // refresh 쿠키 받기
  });
  return data;
};

export const getMyInfo = async () => {
  const { data } = await api.get<ResponseMyInfoDto>("/v1/users/me");
  return data;
};

// Access Token 재발급 (쿠키 기반)
// 서버가  refreshToken을 요구한다면 아래 호출을:
// await api.post("/v1/auth/refresh", { refreshToken: getRefreshToken() })
// 형태로 바꿔줘.
export const refreshAccessToken = async () => {
  const { data } = await api.post<{ accessToken: string }>("/v1/auth/refresh", null, {
    withCredentials: true,
  });
  return data.accessToken;
};
export const startGoogleLogin = () => {
  window.location.href = `${import.meta.env.VITE_SERVER_API_URL}/v1/auth/google`;
};
