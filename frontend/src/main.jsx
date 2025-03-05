import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import {AdminLogin} from './pages/admin/AdminLogin.jsx'
import { LandlordSignUp } from './pages/landlord/LandlordSignUp.jsx'
import { LandlordLogin } from './pages/landlord/LandlordLogin.jsx'
import AdminForgotPassword from './pages/admin/AdminForgotPassword.jsx'
import AdminOtpLogin from './pages/admin/AdminOtpLogin.jsx'
import AdminChangePassword from './pages/admin/AdminChangePassword.jsx'
import {LandlordChangePassword} from './pages/landlord/LandlordChangePassword.jsx'
import {LandlordForgotPassword} from './pages/landlord/LandlordForgotPassword.jsx'
import {LandlordOtpLogin} from './pages/landlord/LandlordOtpLogin.jsx'
import { TenantOtpLogin } from './pages/tenants/TenantOtpLogin.jsx'
import {Login} from './pages/tenants/Login.jsx'
import {SignUp} from './pages/tenants/SignUp.jsx'
import {TenantChangePassword} from './pages/tenants/TenantChangePassword.jsx'
import {TenantForgotPassword} from './pages/tenants/TenantForgotPassword.jsx'
import PGLocationSelector from './components/PGLocationSelector.jsx'



const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  }, 
  {
    path: "/admin/login",
    element: <AdminLogin/>
  },
  {
    path: "/admin/forgot-password",
    element: <AdminForgotPassword/>
  },
  {
    path: "/admin/otp",
    element: <AdminOtpLogin/>
  },
  {
    path: "/admin/reset-password",
    element: <AdminChangePassword/>
  },
  {
    path: "/landlord/signup",
    element: <LandlordSignUp/>
  },
  {
    path: "/landlord/login",
    element: <LandlordLogin/>
  },
  {
    path: "/landlord/forgot-password",
    element: <LandlordForgotPassword/>
  },
  {
    path: "/landlord/otp",
    element: <LandlordOtpLogin/>
  },
  {
    path: "/landlord/reset-password",
    element: <LandlordChangePassword/>
  },
  {
    path: "/tenant/signup",
    element: <SignUp/>
  },
  {
    path: "/tenant/login",
    element: <Login/>
  },
  {
    path: "/tenant/forgot-password",
    element: <TenantForgotPassword/>
  },
  {
    path: "/tenant/otp",
    element: <TenantOtpLogin/>
  },
  {
    path: "/tenant/reset-password",
    element: <TenantChangePassword/>
  },
  {
    path:"/pglocationselector",
    element: <PGLocationSelector/>
  }
 
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
