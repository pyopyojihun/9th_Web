// src/components/Navbar.tsx
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-neutral-900/95 backdrop-blur border-b border-neutral-800">
      <div className="mx-auto max-w-7xl h-14 px-4 flex items-center justify-between">
        {/* 왼쪽 로고 */}
        <Link to="/" className="text-pink-500 font-bold tracking-tight text-lg">
          돌려돌려LP판
        </Link>

        {/* 오른쪽 액션 버튼 */}
        <nav className="flex items-center gap-2">
          <Link
            to="/login"
            className="px-3 py-1.5 rounded-md border border-neutral-600 text-neutral-100 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-500"
          >
            로그인
          </Link>
          <Link
            to="/signup"
            className="px-3 py-1.5 rounded-md bg-pink-500 text-white hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400"
            
          >
            회원가입
          </Link>
        </nav>
      </div>
    </header>
  );
}
