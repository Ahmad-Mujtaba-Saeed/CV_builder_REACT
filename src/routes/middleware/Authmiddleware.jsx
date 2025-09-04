import { useContext, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { UserContext } from '../../context/UserContext'
import Loader from '../../components/Loader/Loader'

const Authmiddleware = ({ children }) => {
  const location = useLocation()
  const { userData, loading } = useContext(UserContext)
  const accessToken = localStorage.getItem('access_token')

  // Debug logs
  useEffect(() => {
    console.log('Authmiddleware state:', { 
      loading, 
      hasUserData: !!userData,
      hasPlan: userData?.plan_id != null,
      accessToken: !!accessToken,
      currentPath: location.pathname
    })
  }, [loading, userData, accessToken, location.pathname])

  // Show loader while checking auth state
  if (loading) {
    console.log('Authmiddleware: Loading...')
    return <Loader />
  }

  // If we're still loading user data but not in loading state, show a fallback
  if (userData === undefined) {
    console.log('Authmiddleware: User data not loaded yet')
    return <div>Loading user data...</div>
  }

  // Redirect to login if no token
  if (!accessToken) {
    console.log('Authmiddleware: No access token, redirecting to login')
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // If we have no user data but have a token, there might be an issue
  if (!userData) {
    console.error('Authmiddleware: Access token exists but no user data')
    return <div>Error loading user data. Please try again.</div>
  }

  // Redirect to subscription if no plan (except when already on subscription page)
  if (userData.plan_id == null && !location.pathname.startsWith('/subscription')) {
    console.log('Authmiddleware: No plan detected, redirecting to subscription')
    return <Navigate to="/subscription" state={{ from: location }} replace />
  }

  console.log('Authmiddleware: User authenticated with plan')
  return children
}

export default Authmiddleware