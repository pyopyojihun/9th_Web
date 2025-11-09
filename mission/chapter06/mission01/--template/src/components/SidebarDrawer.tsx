import { NavLink } from "react-router-dom";
import { useEffect } from "react";

type Props = { isOpen: boolean; onClose: () => void };

export default function SidebarDrawer({ isOpen, onClose }: Props) {
  // ESC 키로 닫기
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <>
      {/* 오버레이: 바깥 클릭 닫힘 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* 드로어: 화면 위에 겹침(fixed) → 본문 레이아웃 영향 없음 */}
      <aside
        role="dialog"
        aria-modal="true"
        className={`fixed top-14 left-0 z-50 h-[calc(100dvh-56px)] w-72
                    bg-neutral-900 border-r border-neutral-800
                    transition-transform duration-200
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        onClick={(e) => e.stopPropagation()} // 내부 클릭은 닫힘 방지
      >
        <nav className="p-3 space-y-1 overflow-y-auto h-full">
          <SearchBox />
          <Section title="계정">
            <Item to="/my" label="마이페이지" onClose={onClose} />
          </Section>
          <Section title="탐색">
            <Item to="/premium/webtoon/1" label="프리미엄 웹툰" onClose={onClose} />
          </Section>
        </nav>
      </aside>
    </>
  );
}

function Item({
  to,
  label,
  onClose,
}: {
  to: string;
  label: string;
  onClose?: () => void;
}) {
  return (
    <NavLink
      to={to}
      end
      onClick={(e) => {
        e.stopPropagation();
        onClose?.(); // 항목 클릭 시 닫고 싶다면 유지
      }}
      className={({ isActive }) =>
        `block px-3 py-2 rounded-md text-sm ${
          isActive ? "bg-neutral-800 text-white" : "text-neutral-300 hover:bg-neutral-800"
        }`
      }
    >
      {label}
    </NavLink>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="px-3 pt-3 pb-1 text-xs text-neutral-500">{title}</div>
      {children}
    </div>
  );
}

function SearchBox() {
  return (
    <div className="p-2">
      <input
        placeholder="search   찾기"
        className="w-full rounded-md bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-500"
      />
    </div>
  );
}
