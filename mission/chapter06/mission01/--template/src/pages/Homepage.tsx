import { useMemo, useState } from "react";
import type { InfiniteData } from "@tanstack/react-query";
import LpCard from "../components/LpCard";
import SkeletonCard from "../components/SkeletonCard";
import { PAGINATION_ORDER } from "../enums/common";
import useInfiniteLpList from "../hooks/queries/useInfiniteLpList";
import ErrorState from "../components/ErrorState";
import type { ResponseLpListDto } from "../types/lp";

export default function Homepage() {
  const [search] = useState("");
  const [sort, setSort] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);

  const {
    data,
    isPending,              // 초기 로딩
    isError,
    hasNextPage,
    isFetchingNextPage,     // 추가 로딩
    fetchNextPage,
    refetch,
  } = useInfiniteLpList({ search, order: sort });

  const toggleSort = () =>
    setSort((s) => (s === PAGINATION_ORDER.desc ? PAGINATION_ORDER.asc : PAGINATION_ORDER.desc));

  const pages = (data as InfiniteData<ResponseLpListDto> | undefined)?.pages ?? [];
  const list = useMemo(() => pages.flatMap((p) => p?.data?.data ?? []), [pages]);

  // 초기 로딩: 그리드 상단에 카드 스켈레톤
  if (isPending) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end px-1">
          <div className="inline-flex rounded-full border border-neutral-800 px-3 py-1.5 text-sm text-neutral-300">
            정렬 로딩…
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <ErrorState message="목록을 불러오지 못했습니다." onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 우측 상단 정렬 토글 */}
      <div className="flex justify-end">
        <div role="tablist" aria-label="정렬" className="inline-flex overflow-hidden rounded-full border border-neutral-700">
          <button
            type="button"
            role="tab"
            aria-selected={sort === PAGINATION_ORDER.asc}
            onClick={() => setSort(PAGINATION_ORDER.asc)}
            className={
              "px-3 py-1.5 text-sm " +
              (sort === PAGINATION_ORDER.asc ? "bg-neutral-100 text-black" : "bg-black text-white hover:bg-neutral-800")
            }
          >
            오래된순
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={sort === PAGINATION_ORDER.desc}
            onClick={() => setSort(PAGINATION_ORDER.desc)}
            className={
              "px-3 py-1.5 text-sm border-l border-neutral-700 " +
              (sort === PAGINATION_ORDER.desc ? "bg-neutral-100 text-black" : "bg-black text-white hover:bg-neutral-800")
            }
          >
            최신순
          </button>
          <button
            type="button"
            onClick={toggleSort}
            className="px-3 py-1.5 text-sm border-l border-neutral-700 bg-black text-white hover:bg-neutral-800"
            aria-label="정렬 토글"
            title="정렬 토글"
          >
            ↕︎
          </button>
        </div>
      </div>

      {/* 카드 그리드 */}
      {list.length === 0 ? (
        <div className="text-neutral-400">결과가 없습니다.</div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {list.map((lp: any) => (
              <LpCard
                key={lp.id}
                lp={{
                  id: lp.id,
                  title: lp.title,
                  createdAt: lp.createdAt as unknown as string,
                  coverUrl: lp.thumbnail ?? null,
                  likes: Array.isArray(lp.likes) ? lp.likes.length : 0,
                }}
              />
            ))}
            {/* 추가 로딩 시, 하단에 카드 스켈레톤 붙이기 */}
            {isFetchingNextPage &&
              Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={`more-${i}`} />)}
          </div>

          {/* 더 보기 트리거 */}
          <div className="flex justify-center py-6">
            {hasNextPage ? (
              <button
                type="button"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="rounded-md border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-800 disabled:opacity-60"
              >
                {isFetchingNextPage ? "불러오는 중…" : "더 보기"}
              </button>
            ) : (
              <span className="text-neutral-500 text-sm">모든 결과를 불러왔습니다.</span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
