// src/pages/SignupPage.tsx
import { useMemo, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import { postSignup } from "../apis/auth"; // 경로는 프로젝트에 맞게
import type { RequestSignupDto } from "../types/auth"; // { name:string; email:string; password:string } 형태라고 가정

/* ---------------- Zod 전체 스키마 ---------------- */
const schema = z
  .object({
    email: z.string().email({ message: "올바른 이메일 형식이 아닙니다." }),
    password: z
      .string()
      .min(8, { message: "8자 이상이어야 합니다." })
      .max(20, { message: "20자 이하여야 합니다." })
      .regex(/[A-Za-z]/, { message: "영문 최소 1자 포함" })
      .regex(/[0-9]/, { message: "숫자 최소 1자 포함" })
      .regex(/[!@#$%^&*()_\-+\[\]{};:'\",.<>/?\\|`~]/, {
        message: "특수문자 최소 1자 포함",
      }),
    passwordCheck: z.string().min(1, { message: "비밀번호 확인을 입력해 주세요." }),
    name: z.string().min(1, { message: "이름을 입력해 주세요." }),
    avatar: z.any().optional(), // 파일은 선택(이 엔드포인트로 전송하지 않음)
  })
  .refine((d) => d.password === d.passwordCheck, {
    path: ["passwordCheck"],
    message: "비밀번호가 일치하지 않습니다.",
  });

type FormFields = z.infer<typeof schema>;

/* -------- 단계별 부분 스키마(이동 시 해당 단계만 검증) -------- */
const emailOnly = z.object({ email: schema.shape.email });

const pwOnly = z
  .object({
    password: schema.shape.password,
    passwordCheck: schema.shape.passwordCheck,
  })
  .refine((d) => d.password === d.passwordCheck, {
    path: ["passwordCheck"],
    message: "비밀번호가 일치하지 않습니다.",
  });

const profileOnly = z.object({ name: schema.shape.name }); // avatar는 선택

export default function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<0 | 1 | 2>(0);

  const {
    register,
    handleSubmit,
    getValues,
    setError,
    clearErrors,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      email: "",
      password: "",
      passwordCheck: "",
      name: "",
      avatar: undefined,
    },
    resolver: zodResolver(schema), // 최종 제출 시 전체 검증
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  /* ---------------- 파일 미리보기 ---------------- */
  const avatarFile = watch("avatar") as FileList | undefined;
  const previewUrl = useMemo(() => {
    const f = avatarFile?.[0];
    return f ? URL.createObjectURL(f) : "";
  }, [avatarFile]);

  /* ---------------- 네비게이션 ---------------- */
  const goPrev = () => {
    if (step > 0) setStep((s) => ((s - 1) as typeof s));
    else window.history.length > 1 ? window.history.back() : null; // 첫 단계면 브라우저 뒤로가기
  };

  const goNext = () => {
    const v = getValues();

    if (step === 0) {
      const res = emailOnly.safeParse({ email: v.email });
      if (!res.success) {
        res.error.issues.forEach((i) =>
          setError(i.path[0] as any, { type: "manual", message: i.message }),
        );
        return;
      }
      clearErrors(["email"]);
      setStep(1);
      return;
    }

    if (step === 1) {
      const res = pwOnly.safeParse({
        password: v.password,
        passwordCheck: v.passwordCheck,
      });
      if (!res.success) {
        res.error.issues.forEach((i) =>
          setError(i.path[0] as any, { type: "manual", message: i.message }),
        );
        return;
      }
      clearErrors(["password", "passwordCheck"]);
      setStep(2);
      return;
    }

    // step === 2는 submit에서 처리
  };

  /* ---------------- 제출(마지막 단계) ---------------- */
  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      // ✅ API 타입에 맞게 DTO로 변환 (FormData 사용 X)
      const body: RequestSignupDto = {
        email: data.email,
        password: data.password,
        name: data.name,
      };

      await postSignup(body); // postSignup이 RequestSignupDto를 받도록 정의되어 있어야 함

      // 성공 시 홈으로 이동
      navigate("/", { replace: true });
    } catch (e: any) {
      // 서버 에러 메시지 매핑 (API 포맷에 맞게 수정)
      const msg = e?.response?.data?.message ?? "회원가입에 실패했습니다.";
      if (e?.response?.status === 409) {
        setError("email", { type: "server", message: "이미 사용 중인 이메일입니다." });
      } else {
        setError("password", { type: "server", message: msg });
      }
      // 에러를 여기서 소모하므로 isSubmitting은 자동으로 false로 돌아옵니다.
    }
  };

  return (
    <div className="min-h-dvh bg-black text-white flex flex-col">
      {/* 상단 바 */}
      <div className="sticky top-0 z-40 bg-neutral-900/95 backdrop-blur border-b border-neutral-800">
        <div className="h-14 max-w-3xl mx-auto w-full px-4 flex items-center gap-3">
          <button
            type="button"
            onClick={goPrev}
            className="p-1 rounded hover:bg-neutral-800"
            aria-label="뒤로가기"
            title="뒤로가기"
          >
            ←
          </button>
          <h1 className="mx-auto text-lg font-semibold">회원가입</h1>
          <div className="w-6" />
        </div>
      </div>

      {/* 본문 */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex justify-center">
        <div className="w-full max-w-md px-4 py-10 space-y-4">
          {/* 단계 인디케이터 */}
          <div className="flex gap-2 justify-center mb-4">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`h-1 w-16 rounded-full ${
                  step >= i ? "bg-pink-500" : "bg-neutral-700"
                }`}
              />
            ))}
          </div>

          {/* STEP 0: 이메일 */}
          {step === 0 && (
            <>
              <input
                {...register("email")}
                type="email"
                placeholder="이메일을 입력해 주세요"
                className={`w-full border rounded-md px-4 py-3 bg-neutral-900 text-white ${
                  errors.email
                    ? "border-red-500 focus:!border-red-500"
                    : "border-neutral-600 focus:border-pink-500"
                }`}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
              <button
                type="button"
                onClick={goNext}
                className="w-full bg-pink-600 hover:bg-pink-500 text-white font-medium rounded-md py-3"
              >
                다음
              </button>
            </>
          )}

          {/* STEP 1: 비밀번호/확인 */}
          {step === 1 && (
            <>
              <input
                {...register("password")}
                type="password"
                placeholder="비밀번호"
                className={`w-full border rounded-md px-4 py-3 bg-neutral-900 text-white ${
                  errors.password
                    ? "border-red-500 focus:!border-red-500"
                    : "border-neutral-600 focus:border-pink-500"
                }`}
                aria-invalid={!!errors.password}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}

              <input
                {...register("passwordCheck")}
                type="password"
                placeholder="비밀번호 확인"
                className={`w-full border rounded-md px-4 py-3 bg-neutral-900 text-white ${
                  errors.passwordCheck
                    ? "border-red-500 focus:!border-red-500"
                    : "border-neutral-600 focus:border-pink-500"
                }`}
                aria-invalid={!!errors.passwordCheck}
              />
              {errors.passwordCheck && (
                <p className="text-red-500 text-sm">{errors.passwordCheck.message}</p>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={goPrev}
                  className="flex-1 border border-neutral-600 hover:bg-neutral-800 rounded-md py-3"
                >
                  이전
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="flex-1 bg-pink-600 hover:bg-pink-500 text-white rounded-md py-3"
                >
                  다음
                </button>
              </div>
            </>
          )}

          {/* STEP 2: 이름 / 프로필 사진(선택) */}
          {step === 2 && (
            <>
              <input
                {...register("name")}
                type="text"
                placeholder="이름"
                className={`w-full border rounded-md px-4 py-3 bg-neutral-900 text-white ${
                  errors.name
                    ? "border-red-500 focus:!border-red-500"
                    : "border-neutral-600 focus:border-pink-500"
                }`}
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}

              <label className="block">
                <span className="block mb-2 text-sm text-neutral-300">
                  프로필 사진(선택)
                </span>
                <input
                  {...register("avatar")}
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0 file:text-sm
                    file:font-semibold file:bg-neutral-700 file:text-white
                    hover:file:bg-neutral-600"
                />
              </label>

              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="미리보기"
                  className="w-24 h-24 rounded-full object-cover border border-neutral-700"
                />
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={goPrev}
                  className="flex-1 border border-neutral-600 hover:bg-neutral-800 rounded-md py-3"
                >
                  이전
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-pink-600 hover:bg-pink-500 disabled:bg-neutral-700 text-white rounded-md py-3"
                >
                  완료
                </button>
              </div>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
