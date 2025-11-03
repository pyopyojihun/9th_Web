// src/App.tsx
import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomeLayout from "./layouts/HomeLayout";
import HomePage from "./pages/Homepage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MyPage from "./pages/MyPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import PremiumWebtoonPage from "./pages/PremiumWebtoonPage";
import PremiumGate from "./components/PremiumGate";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },

      {
        path: "my",
        element: (
          <ProtectedRoute>
            <MyPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "premium/webtoon/:id",
        element: (
          <ProtectedRoute requirePremium>
            <PremiumWebtoonPage />
            <>프리미엄을 구입해주세요!</>
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
