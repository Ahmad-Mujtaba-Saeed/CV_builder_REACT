// Update Authmiddleware.js
import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
// import { UserContext } from '../../context/userContext'
// import Loader from '../../components/Loader/Loader'

const Authmiddleware = ({ children }) => {
  // const { userData, loading } = useContext(UserContext)
  // const accessToken = localStorage.getItem('access_token')

  // if (loading) {
  //   return <Loader />
  // }

  // if (!accessToken) {
  //   return <Navigate to="/login" replace />
  // }

  // if (!userData || (userData.roles !== 'admin' && userData.roles !== 'creators')) {
  //   return <Navigate to="/login" replace />
  // }

  return children
}

export default Authmiddleware
