import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import { type ResponseMyInfoDto } from "../types/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<ResponseMyInfoDto>([]);
  useEffect(() => {
    const getData = async () => {
      const response = await getMyInfo();
      console.log(response);

      setData(response);
    };

    getData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  return (
    <div>
      <h1
        className="font-bold text-3xl bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200
      bg-clip-text text-transparent"
      >
        {data.data?.name}님 환영합니다
      </h1>
      <img
        src={data.data?.avatar ?? undefined}
        alt="프로필 이미지"
        className="size-80 rounded-full mt-5 mb-5"
      ></img>
      <button
        onClick={handleLogout}
        className="cursor-pointer bg-blue-600
      p-2 rounded-2xl text-white hover:bg-blue-500 transition-all"
      >
        로그아웃
      </button>
    </div>
  );
};

export default MyPage;
