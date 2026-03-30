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
import data from "./db/sugangData.json"
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import TimetablePage from './page/TimetablePage'
import LoginPage from './page/LoginPage'
import ProtectRoutes from './component/ProtectRoutes'
import { useState } from 'react'

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

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('user')
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

    const isFull = target.current >= target.limit
    const newStatus = isFull ? "waiting" : "sugang"


    if(isFull) alert(`정원이 초과되어 대기 ${target.totalwaiting + 1}번으로 신청됩니다.`)

    setLectures(prev =>
      prev.map(lectures => lectures.code === code && lectures.division === division? 
        {...lectures, status:newStatus, 
          current: newStatus === "sugang" ? lectures.current + 1 : lectures.current,
          totalwaiting: newStatus === "waiting" ? lectures.totalwaiting + 1 : lectures.totalwaiting,
          mywaiting: newStatus === "waiting" ? lectures.totalwaiting + 1 : null} 
          : lectures)
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

  return (
    <BrowserRouter>
      <div className='app'>
        {user && <Header user={user} onLogout={handleLogout}/>}
        {user && <Sidebar />}

        <Routes>
          <Route path='/' element={user ? <Navigate to='/sugang'/> : <Navigate to='/login'/>}
          />

          <Route path='/login' element={
            user ? <Navigate to='/sugang'/> : <LoginPage onLogin={handleLogin}/>
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