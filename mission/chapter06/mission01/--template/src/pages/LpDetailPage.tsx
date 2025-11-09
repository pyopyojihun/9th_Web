// src/pages/LpDetailPage.tsx
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import ErrorState from "../components/ErrorState";
import { useAuthUser } from "../hooks/useAuthUser";
import { useEffect, useMemo, useState } from "react";
import CommentsSection from "../components/CommentsSection";

const fmt = (s?: string) =>
  s ? new Intl.DateTimeFormat("ko", { dateStyle: "medium" }).format(new Date(s)) : "";

export default function LpDetailPage() {
  const { lpid } = useParams<{ lpid: string }>();
  const nav = useNavigate();
  const location = useLocation();
  const { data, isPending, isError, refetch } = useGetLpDetail(lpid);
  const { user, loading: userLoading } = useAuthUser();
  const [liked, setLiked] = useState(false);

  // 비로그인 경고 모달
  const [showAuthModal, setShowAuthModal] = useState(false);

  // ✔ side-effect 용으로 useEffect 사용 (useMemo 아님)
  useEffect(() => {
    if (!userLoading && !user) {
      setShowAuthModal(true);
    }
  }, [userLoading, user]);

  // 모달 "확인" → /login (로그인 후 복귀를 위한 state.from 포함)
  const goLoginWithReturn = () => {
    nav("/login", { state: { from: location } });
  };

  if (isPending) {
    return (
      <div className="mx-auto max-w-3xl py-10 space-y-4">
        <div className="h-6 w-48 rounded bg-neutral-800 animate-pulse" />
        <div className="aspect-video w-full rounded-xl bg-neutral-800 animate-pulse" />
        <div className="h-4 w-3/4 rounded bg-neutral-800 animate-pulse" />
        <div className="h-4 w-2/3 rounded bg-neutral-800 animate-pulse" />
      </div>
    );
    }

  if (isError || !data?.data) {
    return (
      <div className="mx-auto max-w-3xl py-10">
        <ErrorState message="상세 정보를 불러오지 못했습니다." onRetry={() => refetch()} />
      </div>
    );
  }

  const lp = data.data;

  // 액션 핸들러 (UI만 연결, 실제 API 연동은 TODO)
  const onEdit = () => nav(`/lp/${lp.id}/edit`);
  const onDelete = () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    alert("삭제 API 연동(TODO)");
  };
  const onToggleLike = () => setLiked((v) => !v);
  const likeCount = (lp.likes?.length ?? 0) + (liked ? 1 : 0);

  return (
    <div className="mx-auto max-w-3xl relative">
      {/* 경고 모달 */}
      {showAuthModal && (
        <AuthRequireModal
          onConfirm={goLoginWithReturn}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {/* 상단 헤더 + 액션 바 */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 overflow-hidden rounded-full bg-neutral-700">
            {lp.author?.avatar && (
              <img
                src={lp.author.avatar}
                alt={lp.author.name}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <div className="leading-tight">
            <div className="text-sm font-medium">{lp.author?.name ?? "작성자"}</div>
            <div className="text-xs text-neutral-400">{fmt(lp.createdAt)}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleLike}
            className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-sm
              ${
                liked
                  ? "border-pink-500/40 bg-pink-500/15 text-pink-300"
                  : "border-neutral-700 bg-neutral-900 text-neutral-200 hover:bg-neutral-800"
              }`}
            aria-pressed={liked}
            title="좋아요"
          >
            <span aria-hidden>♥</span>
            <span>{likeCount}</span>
          </button>
          <button
            onClick={onEdit}
            className="rounded-md border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-200 hover:bg-neutral-800"
            title="수정"
          >
            수정
          </button>
          <button
            onClick={onDelete}
            className="rounded-md border border-red-600/40 bg-red-500/10 px-3 py-1.5 text-sm text-red-300 hover:bg-red-500/20"
            title="삭제"
          >
            삭제
          </button>
        </div>
      </div>

      {/* 제목 */}
      <h1 className="mb-3 text-2xl font-bold">{lp.title}</h1>

      {/* 썸네일 */}
      <div className="mb-6 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
        <img src={lp.thumbnail} alt={lp.title} className="h-auto w-full object-cover" />
      </div>

      {/* 본문 */}
      <p className="mb-6 whitespace-pre-wrap leading-7 text-neutral-200">{lp.content}</p>

      {/* 태그 */}
      {lp.tags?.length ? (
        <div className="mb-6 flex flex-wrap gap-2">
          {lp.tags.map((t) => (
            <span key={t.id} className="rounded-md bg-neutral-800 px-2 py-1 text-xs text-neutral-200">
              #{t.name}
            </span>
          ))}
        </div>
      ) : null}

      {/* 목록으로 */}
      <div className="mt-8">
        <Link to="/" className="text-sm text-pink-400 hover:underline">
          목록으로
        </Link>
      </div>

      {/* ✔ 댓글 섹션 (무한스크롤 + 스켈레톤 + 입력 UI) */}
      <CommentsSection lpId={lp.id} />
    </div>
  );
}

/** 비로그인 경고 모달(간단 버전) */
function AuthRequireModal({
  onConfirm,
  onClose,
}: {
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-xl border border-neutral-700 bg-neutral-900 p-6 text-white shadow-xl">
          <h3 className="mb-2 text-lg font-semibold">로그인이 필요합니다</h3>
          <p className="mb-4 text-sm text-neutral-300">
            이 페이지는 로그인 후 이용할 수 있어요. 로그인 페이지로 이동할까요?
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 rounded-md border border-neutral-700 bg-neutral-900 py-2 hover:bg-neutral-800"
            >
              취소
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 rounded-md bg-pink-600 py-2 hover:bg-pink-500"
            >
              로그인하기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
