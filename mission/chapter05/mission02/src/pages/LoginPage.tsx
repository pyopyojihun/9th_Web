// src/pages/LoginPage.tsx
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signin } from "../api/auth";
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
      
      // 실제 API 호출
      const response = await signin({
        email: data.email,
        password: data.password,
      });

      console.log('✅ 로그인 성공:', response);

      // localStorage에 사용자 정보 저장 (액세스 토큰과 리프레시 토큰 포함)
      localStorage.setItem('user', JSON.stringify({
        email: data.email,
        name: response.data.name,
        id: response.data.id,
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      }));
      
      alert('로그인 성공!');
      
      // 이전에 접근하려던 페이지로 리다이렉트, 없으면 홈으로
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
      </form>
    </div>
  );
};

export default LoginPage;