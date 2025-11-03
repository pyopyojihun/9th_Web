import { Link, Outlet } from "react-router-dom";

const HomeLayout = () => {
  return (
    <div className="flex flex-col h-dvh">
      <nav className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 shadow">
        <div className="text-2xl font-bold text-white bg-blue-500 rounded px-2 py-1">
          돌려돌려 내인생
        </div>
        <div className="space-x-5">
          <Link
            to="/login"
            className="px-4 py-2 bg-blue-500 rounded text-white hover:bg-blue-600 transition-all duration-300 font-semibold
            hover:text-black"
          >
            로그인
          </Link>

          <Link
            to="/signup"
            className="px-4 py-2 bg-blue-500 rounded text-white hover:bg-blue-600 transition-all duration-300 font-semibold
            hover:text-black"
          >
            회원가입
          </Link>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
      <footer></footer>
    </div>
  );
};

export default HomeLayout;
