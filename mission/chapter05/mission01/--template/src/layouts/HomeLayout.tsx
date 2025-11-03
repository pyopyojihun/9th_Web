// src/layouts/HomeLayout.tsx
import { Outlet, Link } from "react-router-dom";

export default function HomeLayout() {
  return (
    <div className="min-h-dvh flex flex-col bg-black text-white">
      <nav className="h-14 border-b border-neutral-800 flex items-center px-4 gap-4">
        <Link to="/">홈</Link>
        <Link to="/login">로그인</Link>
        <Link to="/signup">회원가입</Link>
        <Link to="/my">마이페이지(보호)</Link>
        <Link to="/premium/webtoon/1">프리미엄 웹툰(보호)</Link>
      </nav>
      <main className="flex-1 px-4 py-8">
        <Outlet />
      </main>
      <footer className="h-12 border-t border-neutral-800 flex items-center px-4">
        푸터
      </footer>
    </div>
  );
}
