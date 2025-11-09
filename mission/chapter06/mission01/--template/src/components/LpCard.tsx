import { useNavigate } from "react-router-dom";

type LpCardProps = {
  lp: {
    id: string | number;
    title: string;
    artist?: string | null;
    coverUrl?: string | null;
    createdAt?: string | Date | null;
    likes?: number | null;
  };
};

function fmtDate(d?: string | Date | null) {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(+date)) return "";
  return new Intl.DateTimeFormat("ko", { dateStyle: "medium" }).format(date);
}

export default function LpCard({ lp }: LpCardProps) {
  const nav = useNavigate();
  const goDetail = () => nav(`/lp/${lp.id}`);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={goDetail}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && goDetail()}
      className="group relative cursor-pointer select-none outline-none"
    >
      {/* 커버 이미지 */}
      <div className="aspect-square overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
        {lp.coverUrl ? (
          <img
            src={lp.coverUrl}
            alt={lp.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full grid place-items-center text-neutral-500">
            없음
          </div>
        )}
      </div>

      {/* 오버레이(그라데이션 + 메타) */}
      <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-x-2 bottom-2 flex items-end justify-between gap-2">
          <div className="min-w-0">
            <div className="truncate text-[13px] font-semibold text-white drop-shadow">
              {lp.title}
            </div>
            <div className="truncate text-[12px] text-neutral-200/90">
              {fmtDate(lp.createdAt) || (lp.artist ?? "")}
            </div>
          </div>
          <div className="shrink-0 rounded-md bg-black/40 px-2 py-0.5 text-[12px] text-pink-300 backdrop-blur">
            ♥ {lp.likes ?? 0}
          </div>
        </div>
      </div>
    </div>
  );
}
