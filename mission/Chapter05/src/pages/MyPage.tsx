import React, { useEffect, useState } from "react"
import { getMyInfo } from "../apis/auth";
import { ResponseMyInfoDto } from "../types/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function MyPage() {
    const nav = useNavigate();
    const { logout } = useAuth();
    const [data, setData] = useState<ResponseMyInfoDto | null>(null);

    useEffect(() => {
        const getData = async () => {
            const res = await getMyInfo();
            console.log(res);

            setData(res);
        }

        getData();
    }, []);

    const handleLogout = async () => {
        await logout();
        nav("/");
    }

    return (
        <div>
            {data?.data.name}
            {data?.data.email}

            <button
                className="cursor-pointer bg-blue-300 rounded-sm p-5 hover:scale-90"
                onClick={handleLogout}
            >
                로그아웃
            </button>
        </div>
    );
};
