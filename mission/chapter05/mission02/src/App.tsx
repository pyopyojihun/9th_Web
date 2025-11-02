import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import SignupPage from "./pages/SignupPage";
import HomeLayout from "./layouts/HomeLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedPage from "./pages/MyPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage />},
      { path: "login", element: <LoginPage />},
      { path: "signup", element: <SignupPage />},
      // 마이 페이지 (보호된 라우트)
      { 
        path: "mypage", 
        element: (
          <ProtectedRoute>
            <ProtectedPage />
          </ProtectedRoute>
        )
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;