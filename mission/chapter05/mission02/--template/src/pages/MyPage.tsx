import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";

export default function MyPage() {
  const [name, setName] = useState("");

  useEffect(() => {
    (async () => {
      const me = await getMyInfo();
      setName(me.data?.name ?? "");
    })();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">마이페이지</h1>
      <p className="mt-2">안녕하세요, {name || "사용자"} 님!</p>
    </div>
  );
}

