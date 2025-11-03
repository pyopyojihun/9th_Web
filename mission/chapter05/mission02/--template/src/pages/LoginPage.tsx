import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { postSignin } from "../apis/auth";
import { setAccessToken } from "../apis/token";
import useForm from "../hooks/useForm";
import { validateSignin, type UserSignInformation } from "../utils/validate";
import axios from "axios";


export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const fromPath =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? "/my";

  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { values, errors, touched, getInputProps } = useForm<UserSignInformation>({
    initialValue: { email: "", password: "" },
    validate: validateSignin,
  });

  // 구글 콜백 토큰 회수
  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");
    if (token) {
      setAccessToken(token);
      // 주소 정리 후 이동
      window.history.replaceState({}, "", "/my");
      navigate("/my", { replace: true });
    }
  }, [navigate]);

  const isDisabled =
    loading ||
    Object.values(errors ?? {}).some((e) => (e ?? "").length > 0) ||
    Object.values(values).some((v) => v === "");

  const handleSubmit = async () => {
    if (loading) return;
    setServerError(null);
    try {
      setLoading(true);
      const res = await postSignin(values);
      const token = res?.data?.accessToken;
      if (!token) throw new Error("서버 응답에 accessToken이 없습니다.");
      setAccessToken(token);
      navigate(fromPath, { replace: true });
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? (err.response?.data as any)?.message ?? err.message
        : (err as Error).message;
      setServerError(msg || "로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const base = import.meta.env.VITE_SERVER_API_URL;
    window.location.href = `${base}/v1/auth/google`;
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isDisabled) handleSubmit();
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="flex flex-col gap-3">
        <input
          {...getInputProps("email")}
          type="email"
          onKeyDown={onKeyDown}
          className={`border w-[300px] p-[10px] rounded-sm focus:border-[#807bff] ${
            errors?.email && touched?.email ? "border-red-500 bg-red-200" : "border-gray-300"
          }`}
          placeholder="이메일"
          autoComplete="email"
        />
        {errors?.email && touched?.email && (
          <div className="text-red-500 text-sm">{errors.email}</div>
        )}

        <input
          {...getInputProps("password")}
          type="password"
          onKeyDown={onKeyDown}
          className={`border w-[300px] p-[10px] rounded-sm focus:border-[#807bff] ${
            errors?.password && touched?.password ? "border-red-500 bg-red-200" : "border-gray-300"
          }`}
          placeholder="비밀번호"
          autoComplete="current-password"
        />
        {errors?.password && touched?.password && (
          <div className="text-red-500 text-sm">{errors.password}</div>
        )}

        {serverError && <div className="text-red-600 text-sm">{serverError}</div>}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isDisabled}
          className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>

        <div className="my-3 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-300" />
          <span className="text-xs text-gray-500">또는</span>
          <div className="h-px flex-1 bg-gray-300" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full border border-gray-300 bg-white text-gray-800 py-3 rounded-md text-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          aria-label="Google로 로그인"
        >
          {/* 간단한 G 아이콘 GPT의 능력은.. 어디까지인가..*/}
          <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.9 31.7 29.3 35 24 35c-7.2 0-13-5.8-13-13S16.8 9 24 9c3.1 0 6 1.1 8.2 3l5.7-5.7C34.4 3.6 29.5 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.2-.1-2.4-.4-3.5z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.8 15.9 19 13 24 13c3.1 0 6 1.1 8.2 3l5.7-5.7C34.4 6.6 29.5 5 24 5 15.4 5 8.3 9.9 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 43c5.2 0 9.9-1.7 13.5-4.7l-6.2-5.1C29.2 34.8 26.8 35.6 24 35c-5.3 0-9.8-3.4-11.4-8l-6.5 5C8.1 38.6 15.4 43 24 43z"/>
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.3 3.8-4.7 6.5-9.3 6.5-5.3 0-9.8-3.4-11.4-8l-6.5 5C10.1 38.6 17.4 43 26 43c11 0 21-8 21-22 0-1.2-.1-2.4-.4-3.5z"/>
          </svg>
          Google로 로그인
        </button>
      </div>
    </div>
  );
}

