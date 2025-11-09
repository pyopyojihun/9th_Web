// src/pages/SignupPage.tsx
import { useMemo, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { postSignup } from "../apis/auth";
import type { RequestSignupDto } from "../types/auth";

/* 전체 스키마 */
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
    avatar: z.any().optional(),
  })
  .refine((d) => d.password === d.passwordCheck, {
    path: ["passwordCheck"],
    message: "비밀번호가 일치하지 않습니다.",
  });

type FormFields = z.infer<typeof schema>;

/* 단계별 부분 스키마 */
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
    resolver: zodResolver(schema), // 최종 제출시에만 전체 검사
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  // 파일 미리보기
  const avatarFile = watch("avatar") as FileList | undefined;
  const previewUrl = useMemo(() => {
    const f = avatarFile?.[0];
    return f ? URL.createObjectURL(f) : "";
  }, [avatarFile]);

  const goPrev = () => {
    if (step > 0) setStep((s) => ((s - 1) as typeof s));
    else window.history.length > 1 ? window.history.back() : null;
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
  };

  // Enter 방지: 중간 단계에선 goNext, 마지막만 submit
  const onKeyDownBlockSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (step === 0 || step === 1) goNext();
    }
  };

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const body: RequestSignupDto = {
        email: data.email,
        password: data.password,
        name: data.name,
      };
      await postSignup(body);
      navigate("/", { replace: true });
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? "회원가입에 실패했습니다.";
      if (e?.response?.status === 409) {
        setError("email", { type: "server", message: "이미 사용 중인 이메일입니다." });
      } else {
        setError("password", { type: "server", message: msg });
      }
    }
  };

  return (
    <div className="min-h-dvh bg-black text-white flex flex-col">
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

      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex justify-center">
        <div className="w-full max-w-md px-4 py-10 space-y-4">
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

          {step === 0 && (
            <>
              <input
                {...register("email")}
                type="email"
                onKeyDown={onKeyDownBlockSubmit}
                placeholder="이메일"
                className={`w-full border rounded-md px-4 py-3 bg-neutral-900 text-white ${
                  errors.email ? "border-red-500" : "border-neutral-600 focus:border-pink-500"
                }`}
                aria-invalid={!!errors.email}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              <button
                type="button"
                onClick={goNext}
                className="w-full bg-pink-600 hover:bg-pink-500 text-white font-medium rounded-md py-3"
              >
                다음
              </button>
            </>
          )}

          {step === 1 && (
            <>
              <input
                {...register("password")}
                type="password"
                onKeyDown={onKeyDownBlockSubmit}
                placeholder="비밀번호"
                className={`w-full border rounded-md px-4 py-3 bg-neutral-900 text-white ${
                  errors.password ? "border-red-500" : "border-neutral-600 focus:border-pink-500"
                }`}
                aria-invalid={!!errors.password}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}

              <input
                {...register("passwordCheck")}
                type="password"
                onKeyDown={onKeyDownBlockSubmit}
                placeholder="비밀번호 확인"
                className={`w-full border rounded-md px-4 py-3 bg-neutral-900 text-white ${
                  errors.passwordCheck
                    ? "border-red-500"
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

          {step === 2 && (
            <>
              <input
                {...register("name")}
                type="text"
                onKeyDown={onKeyDownBlockSubmit}
                placeholder="이름"
                className={`w-full border rounded-md px-4 py-3 bg-neutral-900 text-white ${
                  errors.name ? "border-red-500" : "border-neutral-600 focus:border-pink-500"
                }`}
                aria-invalid={!!errors.name}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

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
