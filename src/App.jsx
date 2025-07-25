// import PropTypes from 'prop-types'
import React, { useState, useEffect } from "react"

import { UserContext } from "./context/UserContext"
import { Route, Routes, Navigate } from "react-router-dom"
// import { connect } from "react-redux"
import axios from "./utils/axios"
import { ResumeProvider } from './context/ResumeContext';
import { FeedbackProvider } from './context/feedbackContext';
import { CurrentQuestionProvider } from './context/CurrentQuestionContext';

// Import components and routes
import { userRoutes, authRoutes } from "./routes/allRoutes"
import Authmiddleware from "./routes/middleware/Authmiddleware"
import DefaultLayout from "./components/DefaultLayout/DefaultLayout"
import Loader from "./components/Loader/Loader"
// import 'antd/dist/reset.css';
// import "./assets/scss/theme.scss"
// import fakeBackend from "./helpers/AuthType/fakeBackend"

// fakeBackend()

const App = () => {
  const [userData, setUserData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    const getUserData = async () => {
      try {
        const response = await axios.get(`/api/user`)
        setUserData(response.data)
        setError(null)
      } catch (err) {
        setError(err)
        setUserData(null)
      }
    }

    getUserData();
  }, [])

  if (loading) {
    return <Loader /> // Show loading spinner while checking auth
  }

  return (
    <>
      <UserContext.Provider value={{ userData, setUserData, error, setError }}>
        <FeedbackProvider>
          <CurrentQuestionProvider>
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
              {userRoutes.map((route, idx) => {
                if (route?.name === "dashboard") {
                  return (
                    <Route
                      key={idx}
                      path={route.path}
                      element={
                        <Authmiddleware>
                          <DefaultLayout>
                            {route.component}
                          </DefaultLayout>
                        </Authmiddleware>
                      }
                    />
                  );
                }
                return (
                  <Route
                    key={idx}
                    path={route.path}
                    element={
                      <Authmiddleware>
                        {route.component}
                      </Authmiddleware>
                    }
                  />
                );
              })}

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
          </CurrentQuestionProvider>
        </FeedbackProvider>
      </UserContext.Provider>
    </>
  )
}

export default App