// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
// import { createBrowserRouter, RouterProvider } from 'react-router-dom'
// import {AdminLogin} from './pages/admin/AdminLogin.jsx'
// import { LandlordSignUp } from './pages/landlord/LandlordSignUp.jsx'
// import { LandlordLogin } from './pages/landlord/LandlordLogin.jsx'
// import AdminForgotPassword from './pages/admin/AdminForgotPassword.jsx'
// import AdminOtpLogin from './pages/admin/AdminOtpLogin.jsx'
// import AdminChangePassword from './pages/admin/AdminChangePassword.jsx'
// import {LandlordChangePassword} from './pages/landlord/LandlordChangePassword.jsx'
// import {LandlordForgotPassword} from './pages/landlord/LandlordForgotPassword.jsx'
// import {LandlordOtpLogin} from './pages/landlord/LandlordOtpLogin.jsx'
// import { TenantOtpLogin } from './pages/tenants/TenantOtpLogin.jsx'
// import {Login} from './pages/tenants/Login.jsx'
// import {SignUp} from './pages/tenants/SignUp.jsx'
// import {TenantChangePassword} from './pages/tenants/TenantChangePassword.jsx'
// import {TenantForgotPassword} from './pages/tenants/TenantForgotPassword.jsx'
// import PGLocationSelector from './components/PGLocationSelector.jsx'



// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />
//   }, 
//   {
//     path: "/admin/login",
//     element: <AdminLogin/>
//   },
//   {
//     path: "/admin/forgot-password",
//     element: <AdminForgotPassword/>
//   },
//   {
//     path: "/admin/otp",
//     element: <AdminOtpLogin/>
//   },
//   {
//     path: "/admin/reset-password",
//     element: <AdminChangePassword/>
//   },
//   {
//     path: "/landlord/signup",
//     element: <LandlordSignUp/>
//   },
//   {
//     path: "/landlord/login",
//     element: <LandlordLogin/>
//   },
//   {
//     path: "/landlord/forgot-password",
//     element: <LandlordForgotPassword/>
//   },
//   {
//     path: "/landlord/otp",
//     element: <LandlordOtpLogin/>
//   },
//   {
//     path: "/landlord/reset-password",
//     element: <LandlordChangePassword/>
//   },
//   {
//     path: "/tenant/signup",
//     element: <SignUp/>
//   },
//   {
//     path: "/tenant/login",
//     element: <Login/>
//   },
//   {
//     path: "/tenant/forgot-password",
//     element: <TenantForgotPassword/>
//   },
//   {
//     path: "/tenant/otp",
//     element: <TenantOtpLogin/>
//   },
//   {
//     path: "/tenant/reset-password",
//     element: <TenantChangePassword/>
//   },
//   {
//     path:"/pglocationselector",
//     element: <PGLocationSelector/>
//   }
 
// ])
// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <RouterProvider router={router}/>
//   </StrictMode>,
// )

import React, { Children } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import  Dashboard  from './pages/tenants/Dashboard.jsx';
import  SearchPG  from './pages/tenants/SearchPG';
import  MyBookings  from './pages/tenants/My Booking.jsx';
import  Messages  from './pages/tenants/Messages';
import  Favorites  from './pages/tenants/Favorites';
import  Settings  from './pages/tenants/Settings';
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import { Login } from './pages/tenants/Login.jsx';
import { SignUp } from './pages/tenants/SignUp.jsx';
import { TenantChangePassword } from './pages/tenants/TenantChangePassword.jsx';
import {TenantOtpLogin} from './pages/tenants/TenantOtpLogin.jsx'
import {TenantForgotPassword} from './pages/tenants/TenantForgotPassword.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children : [
      {
        path: "/tenant-dashboard",
        element: <Dashboard/>
      },
      {
        path: "/tenant-dashboard/search pg",
        element: <SearchPG/>
      },
      {
        path: "/tenant-dashboard/messages",
        element: <Messages/>
      },
      {
        path: "/tenant-dashboard/favorites",
        element: <Favorites/>
      },
      {
        path: "/tenant-dashboard/my bookings",
        element: <MyBookings/>
      },
      {
        path: "/tenant-dashboard/settings",
        element: <Settings/>
      },
      
     
    ]
  },
  {
    path:"/tenant/login",
    element: <Login/>
  },
  {
    path:"/tenant/signup",
    element: <SignUp/>
  },
  {
    path:"/tenant/reset-password",
    element: <TenantChangePassword/>
  },
  {
    path:"/tenant/forgot-password",
    element: <TenantForgotPassword/>
  },
  {
    path:"/tenant/otp",
    element: <TenantOtpLogin/>
  }
])


createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);