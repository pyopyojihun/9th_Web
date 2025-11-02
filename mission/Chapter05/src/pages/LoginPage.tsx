import React, { useEffect } from "react";
import { ReactElement } from "react";
import useForm from "../hooks/useForm";
import { UserSigninInformation, validateSignin } from "../utils/validate";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage(): ReactElement {
    const nav = useNavigate();
    const { login, accessToken } = useAuth();
    const { values, errors, touched, getInputProps } = useForm<UserSigninInformation>({
        initialValue: {
            email: "",
            password: ""
        },
        validate: validateSignin
    });

    useEffect(() => {
        if (accessToken) {
            nav("/");
        }
    }, [nav, accessToken]);

    const handleSubmit = async () => {
        await login(values);
    };

    const handleGoogleLogin = async () => {
        window.location.href =
            import.meta.env.VITE_SERVER_API_URL + "/v1/auth/google/login";
    };

    const isDisabled =
        Object.values(errors || {}).some((error) => error.length > 0)
        || Object.values(values).some((value) => value === "");

    return (
        <div className="flex flex-col items-center justify-center h-full gap-4" >
            <div className="grid grid-cols-3 items-center">
                <button className="justify-self-start" onClick={() => nav("/")}>
                    {`<`}
                </button>
                <h1 className="justify-self-center text-lg font-bold">로그인</h1>
                <div />
            </div>

            <div className="flex flex-col gap-3">
                <div className="flex justify-center">
                    <button className="border border-gray-300 rounded-sm px-28 py-2 font-semibold">구글 로그인</button>
                </div>
                <div className="relative flex items-center py-5">
                    <div className="flex-grow border-t border-gray-800"></div>
                    <span className="flex-shrink mx-4 text-gray-700">OR</span>
                    <div className="flex-grow border-t border-gray-800"></div>
                </div>

                <div className="flex flex-col gap-3">
                    <input
                        {...getInputProps("email")}
                        name="email"
                        className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
                    ${errors?.email && touched?.email ? "border-red-500 bg-red-200" : "border-gray-300"}`}
                        type={"email"}
                        placeholder={"이메일"} />
                    {errors?.email && touched?.email && (
                        <div className="text-red-500 text-sm">{errors.email}</div>
                    )}
                    <input
                        {...getInputProps("password")}
                        className="border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm"
                        type={"password"}
                        placeholder={"비밀번호"}
                    />
                    {errors?.password && touched?.password && (
                        <div className="text-red-500 text-sm">{errors.password}</div>
                    )}
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isDisabled}
                        className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300"
                    >
                        로그인
                    </button>
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300"
                    >
                        <div className="flex items-center justify-center gap-4">
                            <span>구글 로그인</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};
