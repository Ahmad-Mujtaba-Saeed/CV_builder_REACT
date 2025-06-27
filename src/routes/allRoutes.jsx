import React from "react"
import { Navigate } from "react-router-dom"

import DemoPage from "../pages/DemoPage/DemoPage.jsx";
import UploadPage from "../pages/UploadPage/UploadPage.jsx";
import MainMenu from "../pages/MainMenu/MainMenu.jsx";
import CVBuilder from "../pages/CVBuilder/CVBuilder.jsx";
import BuildCVAI from "../pages/BuildCVAI/BuildCVAI.jsx";
import Login from "../pages/Authentication/Login";
// import Logout from "../pages/Authentication/Logout"
import Register from "../pages/Authentication/Register";
import ForgetPwd from "../pages/Authentication/ForgetPassword";
import OTP from "../pages/Authentication/OTPVarification";
import Logout from "../pages/Authentication/Logout.jsx";

import Payment from "../pages/Authentication/PaymentPage";
import UploadProfile from "../pages/Authentication/UploadProfile";
// // Inner Authentication
// import Login1 from "../pages/AuthenticationInner/Login"
// import Register1 from "../pages/AuthenticationInner/Register"
// import Recoverpw from "../pages/AuthenticationInner/Recoverpw"
// import LockScreen from "../pages/AuthenticationInner/auth-lock-screen"


const userRoutes = [
 
  { path: "/", component: <MainMenu /> },
  { path: "/upload", component: <UploadPage /> },
  { path: "/cv-builder", component: <CVBuilder /> },
  { path: "/build-CV-AI", component: <BuildCVAI />},
]

const authRoutes = [
  // { path: "/logout", component: <Logout /> },
  
  
  // // Authentication Inner
  { path: "/payment", component: <Payment /> },
  { path: "/login", component: <Login /> },
  { path: "/logout", component: <Logout /> },
  { path: "/register", component: <Register /> },
  { path: "/forgot-password", component: <ForgetPwd /> },
  { path: "/otp-varification", component: <OTP /> },
  { path: "/upload-profile", component: <UploadProfile /> },
  // { path: "/pages-login", component: <Login1 /> },
  // { path: "/pages-register", component: <Register1 /> },
  // { path: "/page-recoverpw", component: <Recoverpw /> },
  // { path: "/auth-lock-screen", component: <LockScreen /> },
]

export { userRoutes, authRoutes }