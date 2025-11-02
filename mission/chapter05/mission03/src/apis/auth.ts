import axiosInstance from './axios';
import type {
  RequestSigninDto,
  ResponseSigninDto,
  RequestSignupDTO,
  ResponseSignupDTO,
  ResponseMyInfoDto,
} from '../schemas/auth';

// 로그인
export const signin = async (data: RequestSigninDto): Promise<ResponseSigninDto> => {
  const res = await axiosInstance.post<ResponseSigninDto>('/auth/signin', data);
  return res.data; // CommonResponse 반환
};

// 회원가입
export const signup = async (data: RequestSignupDTO): Promise<ResponseSignupDTO> => {
  const res = await axiosInstance.post<ResponseSignupDTO>('/auth/signup', data);
  return res.data; // CommonResponse 반환
};

// 내 정보 조회 (인증 필요)
export const getMyInfo = async (): Promise<ResponseMyInfoDto> => {
  const res = await axiosInstance.get<ResponseMyInfoDto>('/auth/me');
  return res.data; // CommonResponse 반환
};

// 토큰 갱신
export const refreshToken = async (refresh: string) => {
  const res = await axiosInstance.post('/auth/refresh', {}, {
    headers: { Authorization: `Bearer ${refresh}` },
  });
  return res.data;
};

// Google OAuth: 로그인 URL
export const getGoogleLoginUrl = (): string => {
  const base =
    (axiosInstance as any).defaults?.baseURL ||
    (import.meta as any)?.env?.VITE_API_BASE_URL ||
    '';
  const sanitized = (base || '').replace(/\/+$/, '');
  // 백엔드 라우트에 맞게 조정 (/auth/google 시작 엔드포인트)
  return `${sanitized}/auth/google`;
};

// Google OAuth: 콜백 코드 교환 (CommonResponse 반환)
export const handleGoogleCallback = async (code: string): Promise<ResponseSigninDto> => {
  const res = await axiosInstance.post<ResponseSigninDto>('/auth/google/callback', { code });
  return res.data; // CommonResponse 반환
};
