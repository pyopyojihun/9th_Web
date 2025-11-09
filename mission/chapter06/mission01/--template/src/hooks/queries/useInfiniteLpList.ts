// src/hooks/queries/useInfiniteLpList.ts
import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";
import type { PaginationDto } from "../../types/common";
import type { ResponseLpListDto } from "../../types/lp";

/**
 * 무한 스크롤용 LP 목록 훅
 * queryKey: ['lps', order]
 * pageParam(=cursor)은 number | undefined 로 고정
 */
export default function useInfiniteLpList({
  search,
  order,
  limit,
}: Pick<PaginationDto, "search" | "order" | "limit">) {
  return useInfiniteQuery<
    ResponseLpListDto,          // TQueryFnData
    Error,                      // TError
    ResponseLpListDto,          // TData
    [string, typeof order],     // TQueryKey
    number | undefined          // TPageParam  ✅ 여기서 pageParam 타입 고정
  >({
    queryKey: ["lps", order],
    initialPageParam: undefined, // ✅ number | undefined
    queryFn: ({ pageParam }) =>
      getLpList({ cursor: pageParam, search, order, limit }), // ✅ cursor: number | undefined
    getNextPageParam: (lastPage) => {
      // 백엔드 응답에서 next cursor를 number로 꺼내서 반환
      const next =
        (lastPage as any)?.data?.nextCursor ??
        (lastPage as any)?.data?.cursor?.next ??
        null;

      return typeof next === "number" ? next : undefined; // ✅ number만 반환(없으면 undefined)
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
