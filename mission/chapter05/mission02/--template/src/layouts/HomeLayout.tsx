// src/layouts/HomeLayout.tsx
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
 // 경로 별칭 없으면 "../components/Navbar"

export default function HomeLayout() {
  return (
    <div className="min-h-dvh flex flex-col bg-black text-white">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6">
        {/* 자식 페이지는 여기서 렌더 */}
        <Outlet />
      </main>

      <footer className="border-t border-neutral-800 py-4 text-sm text-neutral-400">
        <div className="mx-auto max-w-7xl px-4">푸터</div>
      </footer>
    </div>
  );
}
