// import PropTypes from 'prop-types'
import React, { useState, useEffect } from "react"

import { UserContext } from "./context/userContext"
import { Route, Routes, Navigate } from "react-router-dom"
// import { connect } from "react-redux"
import axios from "axios"
import { ResumeProvider } from './context/ResumeContext';

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
  // const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // useEffect(() => {
  //   const accessToken = localStorage.getItem('access_token')
  //   if (!accessToken) {
  //     setLoading(false)
  //     return
  //   }

  //   const getUserData = async () => {
  //     try {
  //       const baseUrl = process.env.REACT_APP_BACKEND_BASE_URL
  //       const response = await axios.get(`${baseUrl}/api/user`, {
  //         headers: { Authorization: `Bearer ${accessToken}` }
  //       })
  //       setUserData(response.data)
  //       setError(null)
  //     } catch (err) {
  //       setError(err)
  //       localStorage.removeItem('access_token')
  //       setUserData(null)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   getUserData()
  // }, [])

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
            // <Authmiddleware>
              route.component
            // </Authmiddleware>
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
  )
}

export default App