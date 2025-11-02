import React, { useEffect, useState } from "react";
import { ReactElement } from "react";
import { Outlet, useNavigate } from 'react-router-dom';
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/keys";

export default function HomeLayout(): ReactElement {
    const nav = useNavigate();
    const { getItem, removeItem } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
    const [isLogin, setIsLogin] = useState<boolean>(false);

    useEffect(() => {
        setIsLogin(Boolean(getItem()));
    }, [getItem]);

    const handleLogout = () => {
        removeItem();
        setIsLogin(false);
        nav("/");
    };

    return (
        <div className="h-dvh flex flex-col">
            <div className="flex w-full justify-between border-b border-gray-300">
                <button className="p-4 px-8" onClick={e => nav("/")}>홈</button>˝
                <nav className="flex p-4 gap-8">
                    {isLogin && (
                        <>
                            <button onClick={() => nav("/my")}>마이페이지</button>
                            <button onClick={handleLogout}>로그아웃</button>
                        </>
                    )}
                    {!isLogin && (
                        <>
                            <button onClick={() => nav("/login")}>로그인</button>
                            <button onClick={() => nav("/signup")}>회원가입</button>
                        </>
                    )}
                </nav>
            </div>
            <main className="flex-1" >
                <Outlet />
            </main>
        </div>
    );
};
