import { useMemo, useState } from "react";
import type { InfiniteData } from "@tanstack/react-query";
import useInfiniteLpComments from "../hooks/queries/useInfiniteLpComments";
import type { ResponseLpCommentsDto } from "../types/lp";
import { PAGINATION_ORDER } from "../enums/common";

function CommentSkeleton() {
  return (
    <div className="flex gap-3 py-3">
      <div className="h-9 w-9 rounded-full bg-neutral-800 animate-pulse" />
      <div className="flex-1">
        <div className="h-3 w-32 rounded bg-neutral-800 animate-pulse mb-2" />
        <div className="h-3 w-3/4 rounded bg-neutral-800 animate-pulse mb-1" />
        <div className="h-3 w-2/3 rounded bg-neutral-800 animate-pulse" />
      </div>
    </div>
  );
}

export default function CommentsSection({ lpId }: { lpId: number | string }) {
  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);
  const {
    data,
    isPending,              // 초기 로딩 → 상단 스켈레톤
    isFetchingNextPage,     // 추가 로딩 → 하단 스켈레톤
    hasNextPage,
    fetchNextPage,
  } = useInfiniteLpComments(lpId, order);

  const pages = (data as InfiniteData<ResponseLpCommentsDto> | undefined)?.pages ?? [];
  const comments = useMemo(() => pages.flatMap((p) => p?.data?.data ?? []), [pages]);

  // 댓글 입력(디자인/유효성 안내만)
  const [input, setInput] = useState("");
  const maxLen = 300;
  const tooLong = input.length > maxLen;
  const isEmpty = input.trim().length === 0;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 디자인만: 실제 API 연동 없음
    if (isEmpty || tooLong) return;
    // 여기에 나중에 createComment API 연결
    setInput("");
    // 알림/토스트가 있다면 안내 메시지 출력 예정
  };

  return (
    <section className="mt-10">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">댓글</h2>
        <div role="tablist" aria-label="정렬" className="inline-flex rounded-full border border-neutral-700 overflow-hidden">
          <button
            type="button"
            role="tab"
            aria-selected={order === PAGINATION_ORDER.desc}
            onClick={() => setOrder(PAGINATION_ORDER.desc)}
            className={
              "px-3 py-1.5 text-xs " +
              (order === PAGINATION_ORDER.desc ? "bg-neutral-100 text-black" : "bg-black text-white hover:bg-neutral-800")
            }
          >
            최신순
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={order === PAGINATION_ORDER.asc}
            onClick={() => setOrder(PAGINATION_ORDER.asc)}
            className={
              "px-3 py-1.5 text-xs border-l border-neutral-700 " +
              (order === PAGINATION_ORDER.asc ? "bg-neutral-100 text-black" : "bg-black text-white hover:bg-neutral-800")
            }
          >
            오래된순
          </button>
        </div>
      </div>

      {/* 댓글 작성 (디자인/유효성 안내) */}
      <form onSubmit={onSubmit} className="mb-4 rounded-xl border border-neutral-800 p-4 bg-neutral-900">
        <label className="block text-sm text-neutral-300 mb-2">댓글 쓰기</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
          placeholder="내용을 입력하세요 (최대 300자)"
          className={`w-full resize-none rounded-md border px-3 py-2 bg-black text-white outline-none
            ${tooLong ? "border-red-500" : "border-neutral-700 focus:border-pink-500"}`}
        />
        <div className="mt-2 flex items-center justify-between text-xs">
          <div className={tooLong ? "text-red-400" : "text-neutral-400"}>
            {input.length}/{maxLen}자
          </div>
          <button
            type="submit"
            disabled={isEmpty || tooLong}
            className="rounded-md bg-pink-600 px-3 py-1.5 text-xs text-white hover:bg-pink-500 disabled:bg-neutral-700 disabled:text-neutral-400"
          >
            댓글 등록
          </button>
        </div>
        {isEmpty && (
          <p className="mt-1 text-xs text-neutral-500">댓글 내용을 입력해 주세요.</p>
        )}
        {tooLong && (
          <p className="mt-1 text-xs text-red-400">최대 {maxLen}자까지 입력할 수 있습니다.</p>
        )}
      </form>

      {/* 초기 로딩 스켈레톤(상단) */}
      {isPending &&
        Array.from({ length: 4 }).map((_, i) => <CommentSkeleton key={`top-skel-${i}`} />)
      }

      {/* 댓글 목록 */}
      {comments.length > 0 && (
        <ul className="divide-y divide-neutral-800">
          {comments.map((c) => (
            <li key={c.id} className="py-3 flex gap-3">
              <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-neutral-800">
                {c.author?.avatar && (
                  <img src={c.author.avatar} alt={c.author.name} className="h-full w-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">{c.author?.name ?? "익명"}</div>
                  <div className="text-xs text-neutral-500">
                    {new Date(c.createdAt).toLocaleString("ko")}
                  </div>
                </div>
                <p className="mt-1 text-sm text-neutral-200 whitespace-pre-wrap">
                  {c.content}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* 추가 로딩 스켈레톤(하단) */}
      {isFetchingNextPage &&
        Array.from({ length: 2 }).map((_, i) => <CommentSkeleton key={`bottom-skel-${i}`} />)
      }

      {/* 더 보기 트리거 */}
      <div className="flex justify-center py-4">
        {hasNextPage ? (
          <button
            type="button"
            onClick={() => fetchNextPage()}
            className="rounded-md border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-white hover:bg-neutral-800"
          >
            댓글 더 보기
          </button>
        ) : (
          <span className="text-neutral-500 text-xs">모든 댓글을 불러왔습니다.</span>
        )}
      </div>
    </section>
  );
}
