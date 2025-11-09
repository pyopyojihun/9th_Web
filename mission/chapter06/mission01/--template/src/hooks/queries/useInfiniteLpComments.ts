import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpComments } from "../../apis/lp";
import { PAGINATION_ORDER } from "../../enums/common";
import type { ResponseLpCommentsDto } from "../../types/lp";

export default function useInfiniteLpComments(
  lpId: number | string | undefined,
  order: PAGINATION_ORDER,
  limit = 10
) {
  return useInfiniteQuery<
    ResponseLpCommentsDto,
    Error,
    ResponseLpCommentsDto,
    [string, number | string | undefined, PAGINATION_ORDER],
    number | undefined
  >({
    queryKey: ["lpComments", lpId, order],      // ✅ 요구사항
    enabled: !!lpId,
    initialPageParam: undefined,
    queryFn: ({ pageParam }) => getLpComments(Number(lpId), { cursor: pageParam, order, limit }),
    getNextPageParam: (lastPage) => {
      const next = (lastPage?.data?.nextCursor ?? null) as number | null;
      return typeof next === "number" ? next : undefined; // 더 없으면 undefined
    },
    staleTime: 60_000 * 5,
    gcTime: 60_000 * 10,
  });
}
