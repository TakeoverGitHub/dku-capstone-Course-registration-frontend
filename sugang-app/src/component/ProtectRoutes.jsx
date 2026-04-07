import { Navigate, Outlet } from "react-router-dom"

// 로그인해서 유저 정보가 있으면 정상작동, 없으면 로그인 페이지로 튕겨내기
export default function ProtectRoutes({user}){

  if(!user) {
    return <Navigate to='/login' replace state={{from:"protected",time:Date.now()}}/>
  }

  return <Outlet />
}