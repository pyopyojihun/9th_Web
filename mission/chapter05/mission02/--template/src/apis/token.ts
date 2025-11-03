// src/apis/token.ts
export const ACCESS_TOKEN_KEY = "accessToken";

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY) || null;
}

export function setAccessToken(token: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

// 백엔드가 httpOnly 쿠키로 refresh_token을 내려준다는 가정
// /v1/auth/refresh 로 새 accessToken 받아옴
export async function refreshAccessToken(baseURL: string) {
  const res = await fetch(`${baseURL}/v1/auth/refresh`, {
    method: "POST",
    credentials: "include", // 쿠키 포함
  });
  if (!res.ok) throw new Error("refresh failed");
  const data = await res.json();
  // 서버 응답 포맷에 맞게 수정 (예: { data: { accessToken } })
  const access = data?.data?.accessToken ?? data?.accessToken;
  if (!access) throw new Error("no accessToken in refresh response");
  setAccessToken(access);
  return access;
}

