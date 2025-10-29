import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import z from "zod";
import MovePage from "./MovePage";
import { postSignup } from "../apis/auth";
import { useState } from "react";
import seoro from "../assets/seoro.jpg";
import { useNavigate } from "react-router-dom";
const schema = z
  .object({
    email: z.string().email({ message: "올바른 이메일 형식이 아닙니다." }),
    password: z
      .string()
      .min(8, { message: "비밀번호는 8자 이상이어야 합니다." })
      .max(20, { message: "비밀번호는 20자 이하여야 합니다." }),
    passwordCheck: z
      .string()
      .min(8, { message: "비밀번호는 8자 이상이어야 합니다." })
      .max(20, { message: "비밀번호는 20자 이하여야 합니다." }),
    name: z.string().min(1, { message: "이름을 입력해주세요. " }),
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["passwordCheck"],
  });

type FormFields = z.infer<typeof schema>;

const SignupPage = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordCheck: "",
    },
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const Next = () => {
    setStep((prev) => prev + 1);
  };

  const EmailValid = !!errors.email || watch("email") === "";

  const PasswordValid =
    !!errors.password ||
    !!errors.passwordCheck ||
    watch("password") === "" ||
    watch("passwordCheck") === "";

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const { passwordCheck, ...rest } = data;
      const response = await postSignup(rest);
      alert("회원가입이 완료되었습니다.");
      console.log(response);

      navigate("/");
    } catch (error: any) {
      alert(error.message);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <div className="flex flex-col gap-3">
        <div className="flex items-center mb-5">
          <div>
            <MovePage />
          </div>

          <div className="flex-1 text-center font-semibold text-xl text-white">
            회원가입
          </div>

          <div className="flex-none w-6"></div>
        </div>

        {step === 1 && (
          <>
            <input
              {...register("email")}
              className={`border border-[#ccc] w-[300px] p-2 rounded-sm focus:border-[#807bff]
            ${errors.email ? "border-red-500 bg-red-200" : "border-gray-300"}`}
              type={"email"}
              placeholder="이메일"
            />
            {errors.email && (
              <div className={`text-red-500 text-sm`}>
                {errors.email.message}
              </div>
            )}

            <button
              type={"button"}
              onClick={Next}
              disabled={EmailValid}
              className="w-full bg-blue-600 text-white py-3 
            rounded-md text-lg font-medium transition-colors hover:bg-blue-700 cursor-pointer
            disabled:bg-gray-300"
            >
              다음
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="flex-1 text-center font-semibold text-black mb-2 bg-sky-300 rounded">
              {watch("email")}
            </div>
            <input
              {...register("password")}
              className={`border border-[#ccc] w-[300px] p-2 rounded-sm focus:border-[#807bff]
            ${
              errors.password ? "border-red-500 bg-red-200" : "border-gray-300"
            }`}
              type={"password"}
              placeholder="비밀번호"
            />

            {errors.password && (
              <div className={`text-red-500 text-sm`}>
                {errors.password.message}
              </div>
            )}

            <input
              {...register("passwordCheck")}
              className={`border border-[#ccc] w-[300px] p-2 rounded-sm focus:border-[#807bff]
            ${
              errors.passwordCheck
                ? "border-red-500 bg-red-200"
                : "border-gray-300"
            }`}
              type={"password"}
              placeholder="비밀번호 확인"
            />

            {errors.passwordCheck && (
              <div className={`text-red-500 text-sm`}>
                {errors.passwordCheck.message}
              </div>
            )}

            <button
              type={"button"}
              onClick={Next}
              disabled={PasswordValid}
              className="w-full bg-blue-600 text-white py-3 
            rounded-md text-lg font-medium transition-colors hover:bg-blue-700 cursor-pointer
            disabled:bg-gray-300"
            >
              다음
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <img
              className="object-cover rounded-full w-32 h-32 border-2 border-red-300 ml-20"
              src={seoro}
              alt="프로필"
            />
            <input
              {...register("name")}
              className={`border border-[#ccc] w-[300px] p-2 rounded-sm focus:border-[#807bff]
            ${errors.name ? "border-red-500 bg-red-200" : "border-gray-300"}`}
              type={"name"}
              placeholder="이름"
            />

            {errors.name && (
              <div className={`text-red-500 text-sm`}>
                {errors.name.message}
              </div>
            )}

            <button
              type={"button"}
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 
            rounded-md text-lg font-medium transition-colors hover:bg-blue-700 cursor-pointer
            disabled:bg-gray-300"
            >
              회원가입 완료
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SignupPage;
