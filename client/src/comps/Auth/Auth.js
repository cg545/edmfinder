import { useLocation, Navigate } from "react-router-dom"

export const setToken = (token) => {
  localStorage.setItem('edmfindertoken', token)
}

export const fetchToken = (token) => {
  return localStorage.getItem('edmfindertoken')
}

export function RequireToken({ children }) {

  let auth = fetchToken()
  let location = useLocation()

  if (!auth) {

    return <Navigate to='/login' state={{ from: location }} />;
  }

  return children;
}
