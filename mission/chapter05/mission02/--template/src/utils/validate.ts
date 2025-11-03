// utils/validate.ts
export type UserSignInformation = {
    email: string;
    password: string;
  };
  
  // 반환 타입: 유효하지 않은 필드만 메시지 포함
  type SigninErrors = Partial<Record<keyof UserSignInformation, string>>;
  
  function validateUser(values: UserSignInformation): SigninErrors {
    const errors: SigninErrors = {};
  
    const emailRegex =
      /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
  
    // 실패 시 에러 메시지
    if (!emailRegex.test(values.email)) {
      errors.email = "올바른 이메일 형식이 아닙니다.";
    }
  
    if (!(values.password.length >= 8 && values.password.length < 20)) {
      errors.password = "비밀번호는 8~20글자 사이로 입력해주세요.";
    }
  
    return errors; // ← 반드시 반환
  }
  
  export function validateSignin(values: UserSignInformation): SigninErrors {
    return validateUser(values);
  }
  
