import React from 'react';
import {Navigate,Outlet,useLocation} from 'react-router-dom'
import { useAuth } from '../auth/AuthContext';

export default function ProtectRoute({requirePremium=false}: {requirePremium?:boolean}) {
    const {isAuthenticated, user} = useAuth();
    const location = useLocation();

   if (!isAuthenticated){
    return <Navigate to ="/login" replace state={{from:location}}/>;
   }
   if (requirePremium && !user?.premium){
    return <Navigate to ="/premium/subscribe" replace state={{from:location}}/>;
   }

    return <Outlet/>;
}