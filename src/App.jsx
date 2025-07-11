// import PropTypes from 'prop-types'
import React, { useState, useEffect } from "react"

import { UserContext } from "./context/userContext"
import { Route, Routes, Navigate } from "react-router-dom"
// import { connect } from "react-redux"
import axios from "./utils/axios"
import { ResumeProvider } from './context/ResumeContext';
import { FeedbackProvider } from './context/feedbackContext';

// Import components and routes
import { userRoutes, authRoutes } from "./routes/allRoutes"
import Authmiddleware from "./routes/middleware/Authmiddleware"
// import VerticalLayout from "./components/VerticalLayout/"
// import HorizontalLayout from "./components/HorizontalLayout/"
// import NonAuthLayout from "./components/NonAuthLayout"
import Loader from "./components/Loader/Loader"
// import "./assets/scss/theme.scss"
// import fakeBackend from "./helpers/AuthType/fakeBackend"

// fakeBackend()

const App = () => {
  const [userData, setUserData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token')
    if (!accessToken) {
      return
    }

    const getUserData = async () => {
      try {
        const response = await axios.get(`/api/user`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
        setUserData(response.data)
        setError(null)
      } catch (err) {
        setError(err)
        localStorage.removeItem('access_token')
        setUserData(null)
      }
    }

    getUserData();
  }, [])

  // function getLayout() {
  //   let layoutCls = VerticalLayout
  //   switch (props.layout.layoutType) {
  //     case "horizontal":
  //       layoutCls = HorizontalLayout
  //       break
  //     default:
  //       layoutCls = VerticalLayout
  //       break
  //   }
  //   return layoutCls
  // }

  // const Layout = getLayout()

  // if (loading) {
  //   return <Loader /> // Show loading spinner while checking auth
  // }

  return (
    <>
    <UserContext.Provider value={{ userData, setUserData, error, setError }}>
      <FeedbackProvider>
    <ResumeProvider>
    <Routes>
      {/* Public routes */}
      {authRoutes.map((route, idx) => (
        <Route
            key={idx}
          path={route.path}
            // element={<NonAuthLayout>{route.component}</NonAuthLayout>}
          element={route.component}
        />
      ))}

      {/* Protected routes */}
      {userRoutes.map((route, idx) => (
        <Route
            key={idx}
          path={route.path}
          element={
            <Authmiddleware>
              {route.component}
            </Authmiddleware>
          }
        />
      ))}

        {/* Catch-all route for unauthorized access */}
        {/* <Route
          path="*"
          element={<Navigate to={userData ? "/dashboard" : "/login"} />}
        /> */}
      <Route
        path="*"
          element={<Navigate to={"/"} />}
      />
    </Routes>
    </ResumeProvider>
    </FeedbackProvider>
    </UserContext.Provider>
    </>
  )
}

export default App