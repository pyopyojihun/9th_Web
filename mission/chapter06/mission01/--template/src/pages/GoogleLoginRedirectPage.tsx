import { useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constans/key";

const GoogleLoginRedirectPage = () => {
  const { setRaw: setAccessToken } = useLocalStorage(
    LOCAL_STORAGE_KEY.accessToken
  );
  const { setRaw: setRefreshToken } = useLocalStorage(
    LOCAL_STORAGE_KEY.refreshToken
  );

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get(LOCAL_STORAGE_KEY.accessToken);
    const refreshToken = urlParams.get(LOCAL_STORAGE_KEY.refreshToken);

    if (accessToken) {
      setAccessToken(accessToken);
      if (refreshToken) setRefreshToken(refreshToken);

      // 소셜 로그인 후 복귀 경로 복원
      const back = sessionStorage.getItem("postLoginRedirect") || "/";
      sessionStorage.removeItem("postLoginRedirect");
      window.location.replace(back);
      return;
    }
    // 실패 시 기본 처리
    window.location.replace("/login");
  }, [setAccessToken, setRefreshToken]);

  return <div />;
};

export default GoogleLoginRedirectPage;
