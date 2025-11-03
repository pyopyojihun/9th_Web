// src/pages/LoginPage.tsx
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signin, getGoogleLoginUrl } from "../apis/auth";
import { useState } from "react";

const loginSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다!'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다.').max(20, '비밀번호는 20자 이하여야 합니다.'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    try {
      console.log('🔐 로그인 시도:', data.email);
      
      const response = await signin({
        email: data.email,
        password: data.password,
      });

      console.log('✅ 로그인 성공:', response);

      localStorage.setItem('user', JSON.stringify({
        email: data.email,
        name: response.data.name,
        id: response.data.id,
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      }));
      
      alert('로그인 성공!');
      
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error('❌ 로그인 실패:', error);
      
      if (error.response?.status === 401) {
        alert('이메일 또는 비밀번호가 일치하지 않습니다.');
      } else {
        alert('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Google OAuth 로그인 페이지로 리다이렉트
    window.location.href = getGoogleLoginUrl();
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="flex items-center justify-center w-[300px] gap-3">
        <button
          onClick={handleGoBack}
          className="text-2xl text-white hover:text-gray-400 transition"
        >
          ←
        </button>
        <h2 className="text-xl font-semibold text-white">로그인</h2>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <div>
          <input
            {...register('email')}
            className={`border w-[300px] p-[10px] focus:border-[#807bff] rounded-sm bg-gray-800 text-white
            ${errors.email && touchedFields.email ? "border-red-500 bg-red-900/20" : "border-gray-600"}`}
            type="email"
            placeholder="이메일"
            disabled={isLoading}
          />
          {errors.email && touchedFields.email && (
            <div className="text-red-500 text-sm mt-1">{errors.email.message}</div>
          )}
        </div>

        <div>
          <input
            {...register('password')}
            className={`border w-[300px] p-[10px] focus:border-[#807bff] rounded-sm bg-gray-800 text-white
            ${errors.password && touchedFields.password ? "border-red-500 bg-red-900/20" : "border-gray-600"}`}
            type="password"
            placeholder="비밀번호"
            disabled={isLoading}
          />
          {errors.password && touchedFields.password && (
            <div className="text-red-500 text-sm mt-1">{errors.password.message}</div>
          )}
        </div>

        <button
          type="submit"
          disabled={!isValid || isLoading}
          className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {isLoading ? '로그인 중...' : '로그인'}
        </button>

        {/* 구분선 */}
        <div className="flex items-center gap-2 my-2">
          <div className="flex-1 h-px bg-gray-600"></div>
          <span className="text-gray-400 text-sm">또는</span>
          <div className="flex-1 h-px bg-gray-600"></div>
        </div>

        {/* Google 로그인 버튼 */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full bg-white text-gray-700 py-3 rounded-md text-lg font-medium hover:bg-gray-100 transition-colors cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google로 로그인
        </button>
      </form>
    </div>
  );
};

export default LoginPage;