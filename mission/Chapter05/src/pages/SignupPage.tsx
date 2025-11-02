import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { postSignup } from "../apis/auth";
import { Eye, EyeOff } from "lucide-react";

const emailSchema = z.object({
    email: z.string().email({ message: "올바른 이메일 형식이 아닙니다." }),
});
type EmailFields = z.infer<typeof emailSchema>;

const passwordSchema = z
    .object({
        password: z
            .string()
            .min(6, { message: "비밀번호는 6자 이상이어야 합니다." })
            .max(20, { message: "비밀번호는 20자 이하이어야 합니다." }),
        passwordCheck: z.string(),
    })
    .refine((data) => data.password === data.passwordCheck, {
        path: ["passwordCheck"],
        message: "비밀번호가 일치하지 않습니다.",
    });
type PasswordFields = z.infer<typeof passwordSchema>;

const nicknameSchema = z.object({
    name: z.string().min(1, { message: "닉네임을 입력해주세요." }),
});
type NicknameFields = z.infer<typeof nicknameSchema>;

type SignupPayload = {
    email: string;
    password: string;
    name: string;
};

function EmailStep({
    onNext,
}: {
    onNext: (data: EmailFields) => void;
}) {
    const form = useForm<EmailFields>({
        resolver: zodResolver(emailSchema),
        mode: "onBlur",
    });

    return (
        <form
            onSubmit={form.handleSubmit(onNext)}
            className="flex flex-col gap-3 w-full max-w-md"
        >
            <label className="text-sm font-medium">이메일</label>
            <input
                {...form.register("email")}
                className={`border w-full p-2 rounded-sm ${form.formState.errors.email
                        ? "border-red-500 bg-red-100"
                        : "border-gray-300"
                    }`}
                type="email"
                placeholder="이메일을 입력하세요"
            />
            {form.formState.errors.email && (
                <div className="text-red-500 text-sm">
                    {form.formState.errors.email.message}
                </div>
            )}

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium disabled:bg-gray-300"
                disabled={!form.formState.isValid}
            >
                다음
            </button>
        </form>
    );
}

function PasswordStep({
    onNext,
    onPrev,
}: {
    onNext: (data: PasswordFields) => void;
    onPrev: () => void;
}) {
    const form = useForm<PasswordFields>({
        resolver: zodResolver(passwordSchema),
        mode: "onBlur",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showCheck, setShowCheck] = useState(false);

    return (
        <form
            onSubmit={form.handleSubmit(onNext)}
            className="flex flex-col gap-3 w-full max-w-md"
        >
            <label className="text-sm font-medium">비밀번호</label>
            <div className="relative">
                <input
                    {...form.register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="비밀번호(6~20자)"
                    className={`border w-full p-2 pr-10 rounded-sm ${form.formState.errors.password
                            ? "border-red-500 bg-red-100"
                            : "border-gray-300"
                        }`}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-2 text-gray-600"
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
            {form.formState.errors.password && (
                <div className="text-red-500 text-sm">
                    {form.formState.errors.password.message}
                </div>
            )}

            <label className="text-sm font-medium">비밀번호 확인</label>
            <div className="relative">
                <input
                    {...form.register("passwordCheck")}
                    type={showCheck ? "text" : "password"}
                    placeholder="비밀번호 확인"
                    className={`border w-full p-2 pr-10 rounded-sm ${form.formState.errors.passwordCheck
                            ? "border-red-500 bg-red-100"
                            : "border-gray-300"
                        }`}
                />
                <button
                    type="button"
                    onClick={() => setShowCheck(!showCheck)}
                    className="absolute right-2 top-2 text-gray-600"
                >
                    {showCheck ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
            {form.formState.errors.passwordCheck && (
                <div className="text-red-500 text-sm">
                    {form.formState.errors.passwordCheck.message}
                </div>
            )}

            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={onPrev}
                    className="flex-1 border border-gray-300 py-2 rounded"
                >
                    이전
                </button>
                <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded disabled:bg-gray-300"
                    disabled={!form.formState.isValid}
                >
                    다음
                </button>
            </div>
        </form>
    );
}

function NicknameStep({
    onPrev,
    onSubmit,
    email,
}: {
    onPrev: () => void;
    onSubmit: (data: NicknameFields) => void;
    email: string;
}) {
    const form = useForm<NicknameFields>({
        resolver: zodResolver(nicknameSchema),
        mode: "onBlur",
    });

    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-3 w-full max-w-md"
        >
            <div className="p-3 rounded bg-gray-100 text-sm text-gray-700">
                <div>이메일: {email}</div>
            </div>

            <label className="text-sm font-medium">닉네임</label>
            <input
                {...form.register("name")}
                className={`border w-full p-2 rounded-sm ${form.formState.errors.name
                        ? "border-red-500 bg-red-100"
                        : "border-gray-300"
                    }`}
                type="text"
                placeholder="닉네임을 입력하세요"
            />
            {form.formState.errors.name && (
                <div className="text-red-500 text-sm">
                    {form.formState.errors.name.message}
                </div>
            )}

            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={onPrev}
                    className="flex-1 border border-gray-300 py-2 rounded"
                >
                    이전
                </button>
                <button
                    type="submit"
                    className="flex-1 bg-green-600 text-white py-2 rounded disabled:bg-gray-300"
                    disabled={!form.formState.isValid}
                >
                    회원가입 완료
                </button>
            </div>
        </form>
    );
}

export default function SignupPage() {
    const nav = useNavigate();
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [collected, setCollected] = useState<Partial<SignupPayload>>({});

    const handleEmailNext = (data: EmailFields) => {
        setCollected((prev) => ({ ...prev, email: data.email }));
        setStep(2);
    };

    const handlePasswordNext = (data: PasswordFields) => {
        setCollected((prev) => ({ ...prev, password: data.password }));
        setStep(3);
    };

    const handleNameSubmit = async (data: NicknameFields) => {
        const payload: SignupPayload = {
            email: collected.email!,
            password: collected.password!,
            name: data.name,
        };

        try {
            const res = await postSignup(payload);

            alert("회원가입이 완료되었습니다!");
            nav("/");
        } catch (e) {
            alert("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center p-6">
            <div className="grid grid-cols-3 items-center w-full max-w-md mb-6">
                <button className="justify-self-start" onClick={() => nav("/")}>
                    {"<"}
                </button>
                <h1 className="justify-self-center text-lg font-bold">회원가입</h1>
                <div />
            </div>

            {/* 단계 표시 */}
            <div className="flex gap-2 mb-4">
                {[1, 2, 3].map((s) => (
                    <div
                        key={s}
                        className={`w-3 h-3 rounded-full ${step === s ? "bg-blue-600" : "bg-gray-300"
                            }`}
                    />
                ))}
            </div>

            {step === 1 && <EmailStep onNext={handleEmailNext} />}
            {step === 2 && (
                <PasswordStep onNext={handlePasswordNext} onPrev={() => setStep(1)} />
            )}
            {step === 3 && (
                <NicknameStep
                    onSubmit={handleNameSubmit}
                    onPrev={() => setStep(2)}
                    email={collected.email!}
                />
            )}
        </div>
    );
}
