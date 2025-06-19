import React from "react"
import { Navigate } from "react-router-dom"

import DemoPage from "../pages/DemoPage/DemoPage.jsx"
import UploadPage from "../pages/UploadPage/UploadPage.jsx"
import CVBuilder from "../pages/CVBuilder/CVBuilder.jsx"
// import Login from "../pages/Authentication/Login"
// import Logout from "../pages/Authentication/Logout"
// import Register from "../pages/Authentication/Register"
// import ForgetPwd from "../pages/Authentication/ForgetPassword"

// // Inner Authentication
// import Login1 from "../pages/AuthenticationInner/Login"
// import Register1 from "../pages/AuthenticationInner/Register"
// import Recoverpw from "../pages/AuthenticationInner/Recoverpw"
// import LockScreen from "../pages/AuthenticationInner/auth-lock-screen"


const userRoutes = [
 
  { path: "/", component: <UploadPage /> },
  { path: "/cv-builder", component: <CVBuilder /> },
]

const authRoutes = [
  // { path: "/logout", component: <Logout /> },
  // { path: "/login", component: <Login /> },
  // { path: "/forgot-password", component: <ForgetPwd /> },
  // { path: "/register", component: <Register /> },


  // // Authentication Inner
  // { path: "/pages-login", component: <Login1 /> },
  // { path: "/pages-register", component: <Register1 /> },
  // { path: "/page-recoverpw", component: <Recoverpw /> },
  // { path: "/auth-lock-screen", component: <LockScreen /> },
]

export { userRoutes, authRoutes }