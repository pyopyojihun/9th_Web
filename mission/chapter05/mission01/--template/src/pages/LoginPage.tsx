// src/pages/LoginPage.tsx (버튼 하나만 추가해도 OK)
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { postSignin } from "../apis/auth";
import { LOCAL_STORAGE_KEY } from "../constans/key";
import useForm from "../hooks/useForm";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { validateSignin, type UserSignInformation } from "../utils/validate";
import { setAccessToken } from "../apis/token";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fromPath =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ??
    "/my";

  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { setItem: saveToken } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

  const { values, errors, touched, getInputProps } =
    useForm<UserSignInformation>({
      initialValue: { email: "", password: "" },
      validate: validateSignin,
    });

  const isDisabled =
    loading ||
    Object.values(errors ?? {}).some((e) => (e ?? "").length > 0) ||
    Object.values(values).some((v) => v === "");

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setServerError(null);
      const res = await postSignin(values);
      const token = res?.data?.accessToken;
      if (!token) throw new Error("accessToken 없음");
      setAccessToken(token);
      try { saveToken(token); } catch {}
      navigate(fromPath, { replace: true });
    } catch (e: any) {
      setServerError(e?.message || "로그인 실패");
    } finally {
      setLoading(false);
    }
  };

  // ✅ 구글로 바로 리다이렉트(쿠키 기반 refresh 가정)
  const handleGoogle = () => {
    const base = import.meta.env.VITE_SERVER_API_URL; // 예: http://localhost:8000
    // 서버가 /v1/auth/google에서 OAuth 시작하도록 구현되어 있음(UMC 템플릿)
    window.location.href = `${base}/v1/auth/google`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="flex flex-col gap-3">
        {/* 기존 이메일/비번 로그인 */}
        <input
          {...getInputProps("email")}
          type="email"
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
          className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300"
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>

        {/* ✅ 구글 로그인 버튼 */}
        <button
          type="button"
          onClick={handleGoogle}
          className="w-full bg-red-500 text-white py-3 rounded-md text-lg font-medium hover:bg-red-600 transition-colors"
        >
          Google로 로그인
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
