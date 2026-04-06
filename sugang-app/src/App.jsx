import './App.css'
import Header from './component/Header'
import Sidebar from './component/Sidebar'
import Timetable from './component/Timetable'
import UserInfo from './component/UserInfo'
import Bar from './component/Bar'
import Sugang from "./component/Sugang"
import SugangStatus from "./component/SugangStatus"
import WaitingList from "./component/WaitingList"
import Summary from "./component/Summary"
import data from "../../db/sugangData.json"
import { BrowserRouter, Route, Routes, Navigate, useNavigate } from 'react-router-dom'
import TimetablePage from './page/TimetablePage'
import LoginPage from './page/LoginPage'
import ProtectRoutes from './component/ProtectRoutes'
import { useState } from 'react'
import { useEffect } from 'react'

export default function App() {

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })
  const [userInfo, setUserInfo] = useState(data.userInfo)
  const [credits, setCredits] = useState(data.credits)
  const [lectures, setLectures] = useState(data.lectures)

  const handleLogin = (userInfo) => {
    setUser(userInfo)
    localStorage.setItem('user', JSON.stringify(userInfo))
  }

  useEffect(() => {
    const checkAuth = () => {
      const checkStorage = localStorage.getItem('user')
      if(user && !checkStorage){
        setUser(null)
      }
    }

    const timer = setInterval(checkAuth, 2000)
    return () => clearInterval(timer)
  }, [user])

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    const returnUrl = window.location.origin + '/login?action=done'
    window.location.href = `http://localhost:3001?action=clear&next=${encodeURIComponent(returnUrl)}`
  }
  
  const clearUserState = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const parseTimes = (timesStr) => {
    if(!timesStr) return false
  
    const timePart = timesStr.split('(')[0]
    const daysArray = timePart.split('/')
  
    const allSlots = []
    daysArray.forEach(dayStr => {
      const day = dayStr[0]
      const periods = dayStr.slice(1).split(',')
      periods.forEach(p=>allSlots.push(day+p))
    })
    return allSlots
  }

  const handleSugang = (code,division) => {
    const target = lectures.find(lectures => lectures.code === code && lectures.division === division)
    if(!target) return

    if(target.status === "sugang" || target.status === "waiting"){
      alert("이미 처리된 과목입니다.")
      return
    }

    const isSameCode = lectures.some(
      lectures => lectures.code === code && lectures.status === "sugang"
    )
    if(isSameCode){
      alert("이미 신청된 과목과 교과목번호가 동일한 과목입니다.")
      return
    }

    const occupiedSlots = lectures.filter(l=>l.status === "sugang").flatMap(l=>parseTimes(l.times))
    const targetSlots = parseTimes(target.times)
    const isConflict = targetSlots.some(slot=>occupiedSlots.includes(slot))

    if (isConflict) {
      alert("이미 신청된 과목과 시간대가 겹쳐 신청이 불가능합니다.")
      return
    }
    
    const isFull = target.current >= target.limit

    if(isFull) {
      const waitingCount = lectures.filter(l=>l.status === "waiting").length
      if(waitingCount >= 2){
        alert("최대 2과목까지만 대기 가능합니다.")
        return
      }
      else alert("정원이 초과되어 대기열로 신청됩니다.")
    }

    const newStatus = isFull ? "waiting" : "sugang"

    if(lectures.some(l=>l.code === code && l.status === "waiting")){
      if(isFull){
        alert("이미 해당 과목의 다른 분반이 대기열에 존재합니다.")
        return
      }
      else alert("대기 중인 과목을 취소하고 신청합니다.")
    }
    
    setLectures(prev =>
      prev.map(lectures => {
        if(lectures.code === code && lectures.division === division){
          return{
            ...lectures, status:newStatus, 
            current: newStatus === "sugang" ? lectures.current + 1 : lectures.current,
            totalwaiting: newStatus === "waiting" ? lectures.totalwaiting + 1 : lectures.totalwaiting,
            mywaiting: newStatus === "waiting" ? lectures.totalwaiting + 1 : null
          }
        }
        
        if(newStatus === "sugang" && lectures.code === code && lectures.status === "waiting"){
          return{
            ...lectures, status: "", mywaiting: ""
          }
        }

        return lectures
      })
    )
  }

  const handleCancel = (code,division) => {
    setLectures(prev =>
      prev.map(lectures => lectures.code === code && lectures.division === division ? 
        {...lectures, status:"", 
          current:lectures.status === "sugang" ? 
          Math.max(0,lectures.current-1) : lectures.current} : lectures)
    )
  }

  const handleLink = (e) => {
      e.preventDefault()
      if(!user){
          alert("로그인이 필요합니다.")
          return
      }
      const userData = encodeURIComponent(JSON.stringify(user))
      window.open(`http://localhost:3001?user=${userData}`, "_blank")
  }

  return (
    <BrowserRouter>
      <div className='app'>
        {user && <Header user={user} onLogout={handleLogout}/>}
        {user && <Sidebar goBasket={handleLink}/>}

        <Routes>
          <Route path='/' element={user ? <Navigate to='/sugang'/> : <Navigate to='/login'/>}
          />

          <Route path='/login' element={
            (user && !window.location.search.includes('action=done')) ? 
            <Navigate to='/sugang'/> : 
            <LoginPage onLogin={handleLogin} onLogout={clearUserState}/>
          }/>

          <Route element={<ProtectRoutes user={user}/>}>
            <Route path='/sugang' element={
              <main className='container'>
                <Bar text={"수강신청"}/>

                <div className='content'>
                  <div className='left'>
                    <UserInfo 
                      userInfo={userInfo}
                      credits={credits}
                    />
                    <Sugang 
                      data={lectures}
                      onRegister={handleSugang}
                    />
                    <SugangStatus 
                      data={lectures.filter(lectures => lectures.status === "sugang")}
                      onDelete={handleCancel}
                    />
                    <WaitingList 
                      data={lectures.filter(lectures => lectures.status === "waiting")}
                      onDelete={handleCancel}
                    />
                    <Summary data={lectures}/>
                  </div>
                  <div className='right'>
                    <Timetable data={lectures}/>
                  </div>
                </div>
              </main>
            }
          />

          <Route path='/notice' element={
            <>
              <Bar text={"수강안내문"}/>
            </>
          }/>

          <Route path='/timetable' element={
            <>
              <Bar text={"수강시간표"}/>
              <TimetablePage data={lectures}/>
            </>
          }/>

          <Route path='/confirmation' element={
            <>
              <Bar text={"수강신청확인서"}/>
            </>
          }/>

          <Route path='/lecture' element={
            <>
              <Bar text={"종합강의시간표"}/>
            </>
          }/>

          <Route path='/helper' element={
            <>
              <Bar text={"수강계획도우미 등록(학부)"}/>
            </>
          }/>
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  )
}