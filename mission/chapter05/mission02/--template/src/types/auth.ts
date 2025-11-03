import type { CommonResponse } from "./common";

//회원가입관련
export type RequestSignupDto = {
    name: string;
    email: string;
    bio?: string;
    avatar?: string;
    password: string;
  };

export type ResponseSingupDto=CommonResponse<{
    id:number;
    name:string;
    email:string;
    bio:string|null;
    avatar:string|null;
    createdAt:Date;
    updateAt:Date;
}>

//로그인
export type ResquestSigninDto={
    email:string;
    password:string;

}

export type ResponseSigninDto=CommonResponse<{
    email:string;
    password:string;
    accessToken:string;
    refreshToken:string;
}>;

//내 정보 조회
export type ResponseMyInfoDto=CommonResponse<{
    isPremium: any;
    id:number;
    name:string;
    email:string;
    bio:string|null;
    avatar:string|null;
    createdAt:Date;
    updateAt:Date;
}>