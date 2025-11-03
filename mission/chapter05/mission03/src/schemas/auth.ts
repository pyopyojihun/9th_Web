// 공통 응답 래퍼
export type CommonResponse<T> = {
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
};

// 회원가입
export type RequestSignupDTO = {
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  password: string;
};

export type ResponseSignupDTO = CommonResponse<{
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  // ✅ 실제 HTTP JSON은 Date 객체가 아니라 문자열(ISO)이라 string으로 맞춤
  createdAt: string;
  updatedAt: string;
}>;

// 로그인
export type RequestSigninDto = {
  email: string;
  password: string;
};

export type ResponseSigninDto = CommonResponse<{
  id: number;
  name: string;
  email: string;        // ✅ 콜백/로그인 응답에 email을 포함
  accessToken: string;
  refreshToken: string;
}>;

// 내 정보 조회
export type ResponseMyInfoDto = CommonResponse<{
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string;    // ✅ string으로 통일
  updatedAt: string;    // ✅ string으로 통일
}>;
