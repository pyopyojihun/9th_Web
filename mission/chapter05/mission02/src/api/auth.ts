// src/apis/auth.ts
import axiosInstance from './axios';
import type { 
  RequestSigninDto, 
  ResponseSigninDto,
  RequestSignupDTO,
  ResponseSignupDTO,
  ResponseMyInfoDto 
} from '../schemas/auth';

// 로그인
export const signin = async (data: RequestSigninDto): Promise<ResponseSigninDto> => {
  const response = await axiosInstance.post<ResponseSigninDto>('/auth/signin', data);
  return response.data;
};

// 회원가입
export const signup = async (data: RequestSignupDTO): Promise<ResponseSignupDTO> => {
  const response = await axiosInstance.post<ResponseSignupDTO>('/auth/signup', data);
  return response.data;
};

// 내 정보 조회 (인증 필요)
export const getMyInfo = async (): Promise<ResponseMyInfoDto> => {
  const response = await axiosInstance.get<ResponseMyInfoDto>('/auth/me');
  return response.data;
};

// 토큰 갱신
export const refreshToken = async (refreshToken: string) => {
  const response = await axiosInstance.post('/auth/refresh', {}, {
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });
  return response.data;
};