// src/components/Navbar.tsx
import { Link, useNavigate } from "react-router-dom";
import { useAuthUser } from "../hooks/useAuthUser";

type Props = { onToggleSidebar?: () => void };

export default function Navbar({ onToggleSidebar }: Props) {
  const nav = useNavigate();
  const { user, loading, logout } = useAuthUser();

  const onLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-neutral-900 border-b border-neutral-800">
      <div className="mx-auto max-w-7xl h-14 px-4 flex items-center justify-between">
        {/* 왼쪽: 햄버거 + 로고 */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="메뉴 토글"
            onClick={onToggleSidebar}
            className="p-1.5 rounded-md hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-500"
          >
            {/* 받은 SVG (JSX 속성 camelCase로 수정됨) */}
            <svg width="24" height="24" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="4"
                d="M7.95 11.95h32m-32 12h32m-32 12h32"
              />
            </svg>
          </button>

          <Link to="/" className="text-pink-500 font-extrabold tracking-tight text-xl">
            돌려돌려LP판
          </Link>
        </div>

        {/* 오른쪽: 검색 + 환영문구/로그인·회원가입 */}
        <nav className="flex items-center gap-4">
          <button
            type="button"
            aria-label="검색"
            className="p-2 rounded-md hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-500"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
              <path
                d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-neutral-100"
              />
            </svg>
          </button>

          {loading ? (
            <div className="h-5 w-40 bg-neutral-800 rounded animate-pulse" />
          ) : user ? (
            <>
              <button
                onClick={() => nav("/my")}
                className="text-neutral-100 hover:text-white"
                title="마이페이지로 이동"
              >
                {user.name}님 반갑습니다.
              </button>
              <button
                onClick={onLogout}
                className="px-3 py-1.5 rounded-md border border-neutral-600 text-neutral-100 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-500"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-neutral-100 hover:text-white">로그인</Link>
              <Link to="/signup" className="px-3 py-1.5 rounded-md bg-pink-500 text-white hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400">회원가입</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
