import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import SidebarDrawer from "../components/SidebarDrawer";
import Footer from "../components/Footer";
import Fab from "../components/Fab";

export default function HomeLayout() {
  const [open, setOpen] = useState(false);

  // 드로어 열릴 때 바디 스크롤 잠금
  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", open);
  }, [open]);

  return (
    <div className="min-h-dvh flex flex-col bg-black text-white">
      <Navbar onToggleSidebar={() => setOpen(true)} />

      {/* 드로어 + 오버레이(본문 위에 겹침) */}
      <SidebarDrawer isOpen={open} onClose={() => setOpen(false)} />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-2 md:px-4 py-6">
          <Outlet />
        </div>
      </main>

      <Footer />
      <Fab to="/create" />
    </div>
  );
}
