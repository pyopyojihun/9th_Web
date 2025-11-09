export default function SkeletonCard() {
    return (
      <div className="relative">
        {/* 카드와 동일 비율/모서리 */}
        <div className="aspect-square w-full rounded-xl bg-neutral-800 animate-pulse" />
        {/* 메타 자리(제목/업로드일/좋아요 위치) */}
        <div className="absolute inset-x-0 bottom-0 p-3">
          <div className="h-3 w-3/4 rounded bg-neutral-700/80 mb-2" />
          <div className="h-2 w-1/2 rounded bg-neutral-700/70" />
        </div>
      </div>
    );
  }
  