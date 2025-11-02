// src/pages/SignupPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signup } from '../api/auth';

// Step별 스키마 정의
const emailSchema = z.object({
  email: z.string().email('올바른 이메일 형식을 입력해주세요.'),
});

const passwordSchema = z.object({
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다.').max(20, '비밀번호는 20자 이하여야 합니다.'),
  passwordConfirm: z.string(),
}).refine((data) => data.password === data.passwordConfirm, {
  message: '비밀번호가 일치하지 않습니다.',
  path: ['passwordConfirm'],
});

const nicknameSchema = z.object({
  name: z.string().min(2, '이름은 2자 이상이어야 합니다.').max(10, '이름은 10자 이하여야 합니다.'),
});

type EmailFormData = z.infer<typeof emailSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;
type NicknameFormData = z.infer<typeof nicknameSchema>;

const SignupPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: 이메일 폼
  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    mode: 'onChange',
    defaultValues: { email: signupData.email },
  });

  // Step 2: 비밀번호 폼
  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    mode: 'onChange',
    defaultValues: { password: '', passwordConfirm: '' },
  });

  // Step 3: 이름 폼
  const nicknameForm = useForm<NicknameFormData>({
    resolver: zodResolver(nicknameSchema),
    mode: 'onChange',
    defaultValues: { name: signupData.name },
  });

  const handleEmailNext = (data: EmailFormData) => {
    setSignupData((prev) => ({ ...prev, email: data.email }));
    setStep(2);
  };

  const handlePasswordNext = (data: PasswordFormData) => {
    setSignupData((prev) => ({ ...prev, password: data.password }));
    setStep(3);
  };

  const handleSignupComplete = async (data: NicknameFormData) => {
    const finalData = { 
      ...signupData, 
      name: data.name 
    };
    
    setIsLoading(true);
    
    try {
      console.log('📝 회원가입 시도:', finalData);
      
      // 실제 API 호출
      const response = await signup(finalData);
      
      console.log('✅ 회원가입 성공:', response);
      
      alert('회원가입이 완료되었습니다! 로그인해주세요.');
      navigate('/login');
    } catch (error: any) {
      console.error('❌ 회원가입 실패:', error);
      
      if (error.response?.status === 409) {
        alert('이미 가입된 이메일입니다.');
      } else {
        alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    if (step === 1) {
      navigate('/');
    } else {
      setStep((prev) => (prev - 1) as 1 | 2 | 3);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 px-4">
      <div className="flex items-center justify-center w-full max-w-[400px] gap-3">
        <button
          onClick={handleGoBack}
          className="text-2xl text-white hover:text-gray-400 transition"
          disabled={isLoading}
        >
          ←
        </button>
        <h2 className="text-xl font-semibold text-white">
          회원가입 {step === 1 && '(1/3)'} {step === 2 && '(2/3)'} {step === 3 && '(3/3)'}
        </h2>
      </div>

      {/* Step 1: 이메일 입력 */}
      {step === 1 && (
        <form onSubmit={emailForm.handleSubmit(handleEmailNext)} className="flex flex-col gap-3 w-full max-w-[400px]">
          <div>
            <input
              {...emailForm.register('email')}
              type="email"
              placeholder="이메일을 입력해주세요"
              className={`border w-full p-3 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 ${
                emailForm.formState.errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-fuchsia-500'
              }`}
            />
            {emailForm.formState.errors.email && (
              <p className="text-red-500 text-sm mt-1">{emailForm.formState.errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!emailForm.formState.isValid}
            className="w-full bg-fuchsia-600 text-white py-3 rounded-md text-lg font-medium hover:bg-fuchsia-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            다음
          </button>
        </form>
      )}

      {/* Step 2: 비밀번호 입력 */}
      {step === 2 && (
        <form onSubmit={passwordForm.handleSubmit(handlePasswordNext)} className="flex flex-col gap-3 w-full max-w-[400px]">
          <div className="bg-gray-800 p-3 rounded-md mb-2">
            <p className="text-gray-400 text-sm">이메일</p>
            <p className="text-white">{signupData.email}</p>
          </div>

          <div>
            <div className="relative">
              <input
                {...passwordForm.register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="비밀번호 (8-20자)"
                className={`border w-full p-3 pr-12 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 ${
                  passwordForm.formState.errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-fuchsia-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {passwordForm.formState.errors.password && (
              <p className="text-red-500 text-sm mt-1">{passwordForm.formState.errors.password.message}</p>
            )}
          </div>

          <div>
            <div className="relative">
              <input
                {...passwordForm.register('passwordConfirm')}
                type={showPasswordConfirm ? 'text' : 'password'}
                placeholder="비밀번호 확인"
                className={`border w-full p-3 pr-12 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 ${
                  passwordForm.formState.errors.passwordConfirm ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-fuchsia-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPasswordConfirm ? '🙈' : '👁️'}
              </button>
            </div>
            {passwordForm.formState.errors.passwordConfirm && (
              <p className="text-red-500 text-sm mt-1">{passwordForm.formState.errors.passwordConfirm.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!passwordForm.formState.isValid}
            className="w-full bg-fuchsia-600 text-white py-3 rounded-md text-lg font-medium hover:bg-fuchsia-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            다음
          </button>
        </form>
      )}

      {/* Step 3: 이름 입력 */}
      {step === 3 && (
        <form onSubmit={nicknameForm.handleSubmit(handleSignupComplete)} className="flex flex-col gap-3 w-full max-w-[400px]">
          <div className="bg-gray-800 p-3 rounded-md mb-2">
            <p className="text-gray-400 text-sm">이메일</p>
            <p className="text-white">{signupData.email}</p>
          </div>

          <div className="flex flex-col items-center gap-4 mb-4">
            <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center">
              <span className="text-4xl">👤</span>
            </div>
            <p className="text-gray-400 text-sm">프로필 이미지 (선택사항)</p>
          </div>

          <div>
            <input
              {...nicknameForm.register('name')}
              type="text"
              placeholder="이름을 입력해주세요"
              disabled={isLoading}
              className={`border w-full p-3 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 ${
                nicknameForm.formState.errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-fuchsia-500'
              }`}
            />
            {nicknameForm.formState.errors.name && (
              <p className="text-red-500 text-sm mt-1">{nicknameForm.formState.errors.name.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!nicknameForm.formState.isValid || isLoading}
            className="w-full bg-fuchsia-600 text-white py-3 rounded-md text-lg font-medium hover:bg-fuchsia-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {isLoading ? '회원가입 중...' : '회원가입 완료'}
          </button>
        </form>
      )}
    </div>
  );
};

export default SignupPage;