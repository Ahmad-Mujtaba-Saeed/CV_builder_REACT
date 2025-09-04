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
import LinkVacancy from "../pages/Authentication/LinkVacancy";
import Success from "../pages/Authentication/Success";
import LockScreen from "../pages/Authentication/LockScreen.jsx";
import WelcomeBack from "../pages/Authentication/WelcomeBack.jsx";
import InterviewQuestions from "../pages/dashboard/InterviewQuestions/InterviewQuestions.jsx";
import PracticeQuestion from "../pages/dashboard/PracticeQuestion/PracticeQuestion.jsx";
import QuestionFeedback from "../pages/dashboard/QuestionFeedback/QuestionFeedback.jsx";
import ManageCategories from "../pages/dashboard/ManageCategories/ManageCategories.jsx";
import DashboardLanding from "../pages/dashboard/DashboardLanding/DashboardLanding.jsx";
import JobSearchPage from "../pages/JobSearch/JobSearchPage";
import PlanManagement from "../pages/dashboard/PlanMangement/PlanMangement";
import PaymentSuccess from "../pages/PaymentResponse/Success.jsx";
import PaymentCancelled from "../pages/PaymentResponse/Cancelled.jsx";
import Subscription from "../pages/Subscription/Subscription";
import ProfileSettings from "../pages/dashboard/ProfileSettings/ProfileSettings";

// // Inner Authentication
// import Login1 from "../pages/AuthenticationInner/Login"
// import Register1 from "../pages/AuthenticationInner/Register"
// import Recoverpw from "../pages/AuthenticationInner/Recoverpw"
// import LockScreen from "../pages/AuthenticationInner/auth-lock-screen"


const userRoutes = [
 
  { path: "/", component: <MainMenu /> },

  
  { path: "/dashboard", component: <DashboardLanding /> , name: "dashboard"},
  { path: "/dashboard/categories", component: <ManageCategories /> , name: "dashboard"},
  { path: "/dashboard/question-feedback", component: <QuestionFeedback /> , name: "dashboard" },
  { path: "/dashboard/practice-question/:id", component: <PracticeQuestion /> , name: "normal" },
  { path: "/dashboard/interview-questions", component: <InterviewQuestions />  , name: "dashboard"},
  { path: "/dashboard/job-search", component: <JobSearchPage />  , name: "dashboard"},
  { path: "/dashboard/plan-management", component: <PlanManagement /> , name: "dashboard"},
  { path: "/dashboard/profile-settings", component: <ProfileSettings /> , name: "dashboard"},
  
  
  
  { path: "/subscription", component: <Subscription /> , name: "normal"},
  { path: "/upload", component: <UploadPage /> },
  { path: "/cv-builder", component: <CVBuilder /> },
  { path: "/build-CV-AI", component: <BuildCVAI />},
  { path: "/link-vacancy", component: <LinkVacancy />},
  { path: "/success", component: <Success />},
  { path: "/lock", component: <LockScreen />},
  { path: "/welcome-back", component: <WelcomeBack />},
  { path: "/payment-success", component: <PaymentSuccess />},
  { path: "/payment-cancelled", component: <PaymentCancelled />},
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