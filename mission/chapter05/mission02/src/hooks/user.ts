export interface UserSignInformation {
  email: string;
  password: string;
}

export interface UserSignUpInformation extends UserSignInformation {
  nickname: string;
  profileImage?: string;
}

export interface User {
  email: string;
  nickname: string;
  profileImage?: string;
  token?: string;
}