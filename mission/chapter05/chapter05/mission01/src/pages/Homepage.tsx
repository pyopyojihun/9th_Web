import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Homepage() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div style={{ padding: "20px" }}>
      <h1>Home</h1>
      {isAuthenticated ? (
        <>
          <div>
            안녕하세요 ,{user?.name} (premium: {String(user?.premium)})
          </div>
          <button onClick={logout}>로그아웃</button>
        </>
      ) : (

        <div>
          <Link to="/login">로그인</Link>
        </div>
      )}
      <div style={{ marginTop: "20px" }}>
        <Link to="/premium/webtoon/1">프리미엄 웹툰 1번 보기</Link>
      </div>
    </div>
  );
}
