// src/utils/validate.ts

export type UserSignInformation = {
  email: string;
  password: string;
};

export const validateSignin = (v: UserSignInformation) => {
  const errors: Partial<Record<keyof UserSignInformation, string>> = {};
  if (!v.email) errors.email = "이메일을 입력해 주세요.";
  else if (!/\S+@\S+\.\S+/.test(v.email)) errors.email = "올바른 이메일 형식이 아닙니다.";

  if (!v.password) errors.password = "비밀번호를 입력해 주세요.";
  return errors;
};
