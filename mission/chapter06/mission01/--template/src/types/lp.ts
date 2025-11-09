// src/types/lp.ts
import type { CursorBasedResponse, CommonResponse } from "./common";

export type Tag = {
  id: number;
  name: string;
};

export type Likes = {
  id: number;
  userId: number;
  lpId: number;
};

// 목록 응답 (기존 유지)
export type ResponseLpListDto = CursorBasedResponse<{
  data: {
    id: number;
    title: string;
    content: string;
    thumbnail: string;
    published: boolean;
    authorId: number;
    createdAt: Date;   
    updatedAt: Date;   
    tags: Tag[];
    likes: Likes[];
  }[];
}>;



export type LpAuthor = {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string; 
  updatedAt: string; 
};

export type LpDetail = {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  published: boolean;
  authorId: number;
  createdAt: string; 
  updatedAt: string; 
  tags: Tag[];
  likes: Likes[];
  author: LpAuthor;
};

export type ResponseLpDetailDto = CommonResponse<LpDetail>;


export type LpComment = {
  id: number;
  content: string;
  createdAt: string; // ISO string
  author: {
    id: number;
    name: string;
    avatar: string | null;
  };
};

export type ResponseLpCommentsDto = CommonResponse<{
  data: LpComment[];
  nextCursor?: number | null;
}>;
