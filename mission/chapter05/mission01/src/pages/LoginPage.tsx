import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다!'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다.').max(20, '비밀번호는 20자 이하여야 합니다.'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: LoginFormData) => {
    console.log('로그인 데이터:', data);
    
    // localStorage에 사용자 정보 저장 (실제로는 API 응답에서 받아온 데이터 사용)
    localStorage.setItem('user', JSON.stringify({
      email: data.email,
      nickname: '사용자',
      token: 'dummy-token-for-testing' // 실제로는 서버에서 받은 토큰 사용
    }));
    
    alert('로그인 성공!');
    
    // 이전에 접근하려던 페이지로 리다이렉트, 없으면 홈으로
    const from = (location.state as any)?.from?.pathname || '/';
    navigate(from, { replace: true });
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
          />
          {errors.password && touchedFields.password && (
            <div className="text-red-500 text-sm mt-1">{errors.password.message}</div>
          )}
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          로그인
        </button>
      </form>
    </div>
  );
};

export default LoginPage;