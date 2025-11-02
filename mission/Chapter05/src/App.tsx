import React from "react";
import { createBrowserRouter, RouterProvider, RouteObject } from "react-router-dom";
import HomeLayout from "./layouts/HomeLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import SignupPage from "./pages/SignupPage";
import MyPage from "./pages/MyPage";
import { AuthProvider } from "./context/AuthContext";
import ProtectedLayout from "./layouts/ProtectedLayout";
import GoogleLoginRedirectPage from "./pages/GoogleLoginRedirectPage";

const publicRoutes: RouteObject[] = [
    {
        path: "/",
        element: <HomeLayout />,
        errorElement: <NotFoundPage />,
        children: [
            { index: true, element: <HomePage /> },
            { path: "login", element: <LoginPage /> },
            { path: "signup", element: <SignupPage /> },
            { path: "v1/auth/google/callback", element: <GoogleLoginRedirectPage /> }
        ]
    }
];

const protectedRoutes: RouteObject[] = [
    {
        path: "/",
        element: <ProtectedLayout />,
        errorElement: <NotFoundPage />,
        children: [
            {
                path: "my",
                element: <MyPage />
            },
        ]
    }
];

const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);

export default function App() {
    return (
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    );
}