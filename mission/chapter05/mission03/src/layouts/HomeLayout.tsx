// src/layouts/HomeLayout.tsx
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function HomeLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<{ email: string; name?: string } | null>(null);

  useEffect(() => {
    // localStorage에서 사용자 정보 확인
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (error) {
        console.error('사용자 정보 파싱 오류:', error);
      }
    } else {
      setUser(null);
    }
  }, [location.pathname]); // location이 변경될 때마다 사용자 정보 체크

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    alert('로그아웃되었습니다.');
    navigate('/');
  };

  return (
    <div className="min-h-dvh bg-black text-white flex flex-col">
      {/* 상단 네비게이션 */}
      <nav className="flex justify-between items-center px-6 h-14 border-b border-neutral-800">
        <h1 
          onClick={() => navigate('/')}
          className="text-fuchsia-500 font-extrabold tracking-tight text-lg cursor-pointer hover:text-fuchsia-400 transition"
        >
          Welcome to Zoey's Page
        </h1>
        
        <div className="flex gap-2 items-center">
          {user ? (
            <>
              <span className="text-sm text-gray-400 mr-2">
                {user.name || user.email}님
              </span>
              <button
                onClick={() => navigate('/mypage')}
                className="px-3 py-1 text-sm rounded-md border border-fuchsia-600 text-fuchsia-400 hover:bg-fuchsia-600 hover:text-white transition"
              >
                👤 마이 페이지
              </button>
              <button
                onClick={handleLogout}
                className="px-3 py-1 text-sm rounded-md border border-neutral-600 hover:bg-neutral-800 transition"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="px-3 py-1 text-sm rounded-md border border-neutral-600 hover:bg-neutral-800 transition"
              >
                로그인
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-3 py-1 text-sm rounded-md bg-fuchsia-600 hover:bg-fuchsia-500 text-white transition"
              >
                회원가입
              </button>
            </>
          )}
        </div>
      </nav>

      {/* 중앙 Outlet */}
      <main className="flex-1 flex items-center justify-center">
        <div className="flex items-center justify-center w-full h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}