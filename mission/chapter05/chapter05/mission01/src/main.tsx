import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectRoute';

import Homepage from './pages/Homepage';
import LoginPage from './pages/LoginPage';
import PremiumSubscribe from './pages/PremiumSubscribe';
import PremiumWebtoon from './pages/PremiumWebtoon';

import './index.css';

const router = createBrowserRouter([
  { path: '/', element: <Homepage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/premium/subscribe', element: <PremiumSubscribe /> },

  {
    element: <ProtectedRoute requirePremium />,
    children: [
      { path: '/premium/webtoon/:id', element: <PremiumWebtoon /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
