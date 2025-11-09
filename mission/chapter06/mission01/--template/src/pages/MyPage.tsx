// src/pages/MyPage.tsx
import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import type { ResponseMyInfoDto } from "../types/auth";
import { LOCAL_STORAGE_KEY } from "../constans/key";
import { useNavigate } from "react-router-dom";

export default function MyPage() {
  const navigate = useNavigate();
  const [me, setMe] = useState<ResponseMyInfoDto["data"] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyInfo()
      .then((res) => setMe(res.data))
      .catch(() => setMe(null))
      .finally(() => setLoading(false));
  }, []);

  const logout = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
    navigate("/", { replace: true });
  };

  if (loading) return <div>불러오는 중...</div>;
  if (!me) return <div>내 정보를 불러오지 못했습니다.</div>;

  return (
    <div className="space-y-4">
      <div>안녕하세요, <b>{me.name}</b> 님</div>
      <div>이메일: {me.email}</div>
      {"isPremium" in me && (
        <div>프리미엄: {me.isPremium ? "예" : "아니오"}</div>
      )}
      <button
        onClick={logout}
        className="px-4 py-2 rounded bg-red-600 hover:bg-red-500"
      >
        로그아웃
      </button>
    </div>
  );
}
