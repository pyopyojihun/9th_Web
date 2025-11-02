// src/apis/axios.ts
import axios, { 
  type AxiosInstance, 
  type InternalAxiosRequestConfig,
  type AxiosError 
} from 'axios';

// Axios 인스턴스 생성
const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8000/v1', // 실제 서버 주소로 변경
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: 모든 요청에 액세스 토큰 자동 추가
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userStr = localStorage.getItem('user');
    
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.accessToken) {
          config.headers.Authorization = `Bearer ${user.accessToken}`;
        }
      } catch (error) {
        console.error('토큰 파싱 에러:', error);
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 토큰 만료 시 자동 갱신
axiosInstance.interceptors.response.use(
  (response) => {
    // 성공 응답은 그대로 반환
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { 
      _retry?: boolean 
    };

    // 401 에러이고, 아직 재시도하지 않은 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const userStr = localStorage.getItem('user');
        
        if (!userStr) {
          // 사용자 정보가 없으면 로그인 페이지로
          window.location.href = '/login';
          return Promise.reject(error);
        }

        const user = JSON.parse(userStr);
        
        if (!user.refreshToken) {
          // 리프레시 토큰이 없으면 로그인 페이지로
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(error);
        }

        console.log('🔄 액세스 토큰 만료. 리프레시 토큰으로 재발급 시도...');

        // 리프레시 토큰으로 새 액세스 토큰 발급
        const response = await axios.post(
          'http://localhost:8000/v1/auth/refresh',
          {},
          {
            headers: {
              Authorization: `Bearer ${user.refreshToken}`,
            },
          }
        );

        const { accessToken, refreshToken } = response.data.data;

        // 새 토큰 저장
        const updatedUser = {
          ...user,
          accessToken,
          refreshToken,
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        console.log('✅ 토큰 재발급 성공!');

        // 원래 요청에 새 토큰 적용
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // 원래 요청 재시도
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('❌ 토큰 재발급 실패:', refreshError);
        
        // 리프레시 토큰도 만료된 경우 로그아웃 처리
        localStorage.removeItem('user');
        window.location.href = '/login';
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;