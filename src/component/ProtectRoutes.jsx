import { Navigate, Outlet } from "react-router-dom"

export default function ProtectRoutes({user}){

  if(!user) {
    return <Navigate to='/login' replace state={{from:"protected",time:Date.now()}}/>
  }

  return <Outlet />
}