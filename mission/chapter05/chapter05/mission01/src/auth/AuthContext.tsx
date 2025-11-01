import React, { createContext, useContext, useMemo, useState } from "react";

type User = { id: string; name: string; premium: boolean };
type AuthContextType={
    token:string|null;
    user: User|null;
    isAuthenticated:boolean;
    login:(token:string,user:User)=>void;
    logout:()=>void;
};

const AuthContext=createContext<AuthContextType|null>(null);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('access_token'));
    const [user, setUser] = useState<User | null>(() => {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    });
    const isAuthenticated=!!token;

    const login=(tk:string,u:User)=>{
        setToken(tk);
        setUser(u);
        localStorage.setItem('access_token',tk);
        localStorage.setItem('user',JSON.stringify(u));
    };
    const logout=()=>{
        setToken(null);
        setUser(null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');

    };
    const value=useMemo(()=>({token,user,isAuthenticated,login,logout}),[token,user,isAuthenticated]);
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
  };