// src/components/Sidebar.tsx
import { NavLink } from "react-router-dom";

type Props = { isOpen: boolean; onClose: () => void };

export default function Sidebar({ isOpen, onClose }: Props) {
  const Item = (to: string, label: string) => (
    <NavLink
      to={to}
      end
      onClick={onClose} // 모바일에서 항목 클릭 시 닫기
      className={({ isActive }) =>
        `block px-3 py-2 rounded-md text-sm ${
          isActive ? "bg-neutral-800 text-white" : "text-neutral-300 hover:bg-neutral-800"
        }`
      }
    >
      {label}
    </NavLink>
  );

  return (
    <aside
      aria-label="사이드바"
      className={[
        // 공통
        "transition-all duration-200 ease-in-out bg-neutral-900 border-r border-neutral-800",
        "h-[calc(100dvh-56px)] sticky md:top-14 top-14",
        // 모바일: 드로어
        "fixed md:static left-0 z-50",
        isOpen ? "translate-x-0" : "-translate-x-full", // 모바일 토글
        "w-64 md:translate-x-0",                         // 모바일 너비
        // 데스크톱: 너비 토글 (본문이 넓어지도록)
        isOpen ? "md:w-56" : "md:w-0 md:border-transparent",
        "overflow-hidden", // 닫힐 때 내용 감추기
      ].join(" ")}
    >
      <nav className="p-3 space-y-1">
        {Item("/", "찾기")}
        {Item("/my", "마이페이지")}
        <div className="pt-4 text-xs text-neutral-500 px-3">탐색</div>
        {Item("/premium/webtoon/1", "프리미엄 웹툰")}
      </nav>
    </aside>
  );
}
