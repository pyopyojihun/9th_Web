import type { PaginationDto } from "../types/common";
import type { ResponseLpDetailDto, ResponseLpListDto } from "../types/lp";
import axiosInstance from "./axios";
import { PAGINATION_ORDER } from "../enums/common";

export const getLpList=async(paginationDto:PaginationDto):Promise<ResponseLpListDto>=>{
    const{data}=await axiosInstance.get("/v1/lps",{
        params:paginationDto
    });
    return data;
}

export const getLpDetail = async (lpId: number): Promise<ResponseLpDetailDto> => {
    const { data } = await axiosInstance.get(`/v1/lps/${lpId}`);
    return data;
  };

  import type { ResponseLpCommentsDto } from "../types/lp";



export const getLpComments = async (
  lpId: number,
  params: { cursor?: number; order?: PAGINATION_ORDER; limit?: number }
): Promise<ResponseLpCommentsDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`, { params });
  return data;
};