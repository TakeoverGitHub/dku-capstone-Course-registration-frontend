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
import { BrowserRouter, Route, Routes, Navigate, useNavigate } from 'react-router-dom'
import LoginPage from './page/LoginPage'
import ProtectRoutes from './component/ProtectRoutes'
import { useState, useEffect } from 'react'
import api from './axios.jsx'

// 컴포넌트들 호출 및 로직 담당
export default function App() {

  // 로컬 스토리지 저장된 유저 정보 불러오기
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  const [studentData, setStudentData] = useState([])
  const [lectures, setLectures] = useState([])
  const [cartItems, setCartItems] = useState([])

  // 로그인 로직 (유저 정보 저장 및 로컬스토리지에 동기화)
  const handleLogin = (userInfo) => {
    setUser(userInfo)
    localStorage.setItem('user', JSON.stringify(userInfo))
  }

  // 다른 탭에서 로그아웃 시 로그아웃 진행
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

  // 로그아웃 로직 (로컬스토리지 비우고 장바구니 페이지에 로그아웃 신호)
  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    const returnUrl = window.location.origin + '/login?action=done'
    window.location.href = `http://localhost:3001?action=clear&next=${encodeURIComponent(returnUrl)}`
  }
  
  // 상태 초기화 (로그인 페이지 전달용)
  const clearUserState = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const refreshData = async () => {
    const studentId = user?.studentId
    if (!studentId) {
        console.warn("학번 정보가 없어 요청을 중단합니다.");
        return;
    }
    try {
      // 1. 장바구니 강의 목록 가져오기 (CourseService 연동)
      const cartRes = await api.get(`/cart/${studentId}`);
      setCartItems(cartRes.data);
      
      const sortedCartLectures = [...cartRes.data].sort((a, b) => Number(a.priority) - Number(b.priority));
      setLectures(sortedCartLectures);

      // 3. 학생 마이페이지 정보 가져오기 (EnrollmentService 연동)
      // user.id는 로그인 시 저장된 학번이라고 가정
      const myPageRes = await api.get(`/enroll/mypage/${studentId}`);
      const rawStudentData = myPageRes.data;
      if (rawStudentData && rawStudentData.waitingCourses) {
        const waitingCoursesWithNumbers = await Promise.all(
          rawStudentData.waitingCourses.map(async (course) => {
            try {
              // 개별 과목의 대기 번호를 요청하는 API (이전 가이드에서 만든 레포지토리 로직과 연동)
              const numRes = await api.get(`/enroll/waiting-number`, {
                params: { studentId, courseId: course.courseId }
              });
              // 기존 과목 데이터에 waitingNumber 필드를 추가 조립
              return { ...course, waitingNumber: numRes.data }; 
            } catch (err) {
              console.error(`${course.courseName} 대기번호 로드 실패:`, err);
              return { ...course, waitingNumber: "-" }; // 에러 시 예외 처리
            }
          })
        );
        rawStudentData.waitingCourses = waitingCoursesWithNumbers;        
      }
      
      
      setStudentData(rawStudentData);

      // 4. 대기열 과목은 대기 번호 붙여주기

    } catch (error) {
      console.error("데이터 로드 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    if(user && user.studentId){
      refreshData();
    }
  }, [user]);

  // 수강신청 로직
  const handleSugang = async (courseId) => {
    try {
      const response = await api.post('/enroll', {
        studentId: user.studentId,
        courseId: courseId
      });
      
      if (response.data === "SUCCESS") {
        alert("수강 신청 완료!");
      } else if (response.data === "WAITING") {
        alert("정원 초과로 대기열에 등록되었습니다.");
      }

      // 서버의 최신 상태를 반영하기 위해 데이터를 다시 불러옵니다.
      await refreshData(); 
    } catch (error) {
      alert(error.response?.data?.message || "신청에 실패했습니다.");
    }
  };

  // 신청 취소 로직 (수강 확정 내역)
  const handleCancel = async (courseId) => {
    try {
      const response = await api.post('/enroll/cancel', {
        studentId: user.studentId,
        courseId: courseId
      });

      // 백엔드 응답이 객체이므로 response.data.status 확인
      if (response.data.status === "CANCEL_SUCCESS") {
        alert("수강 취소가 완료되었습니다.");
        await refreshData();
      }
    } catch (error) {
      const message = error.response?.data?.message || "취소 처리 중 오류가 발생했습니다.";
      alert(message);
    }
  };

  // 신청 취소 로직 (대기열)
  const handleWaitingCancel = async (courseId) => {
    try {
      const response = await api.post('/enroll/cancel-waiting', {
        studentId: user.studentId,
        courseId: courseId
      });

      // 백엔드 응답이 객체이므로 response.data.status 확인
      if (response.data.status === "WAITING_CANCEL_SUCCESS") {
        alert("수강 취소가 완료되었습니다.");
        await refreshData();
      }
    } catch (error) {
      const message = error.response?.data?.message || "취소 처리 중 오류가 발생했습니다.";
      alert(message);
    }
  };

  // 장바구니 페이지로 이동 (유저 정보 넘기면서 새 창 열기)
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
        {/*로그인 후 헤더, 사이드바 호출*/}
        {user && <Header user={user} onLogout={handleLogout}/>}
        {user && <Sidebar goBasket={handleLink}/>}

        {/*로그인하면 수강신청페이지로 그 외엔 로그인페이지로 접속*/}
        <Routes>
          <Route path='/' element={user ? <Navigate to='/sugang'/> : <Navigate to='/login'/>}
          />

          {/*로그인 페이지 (로그인된 유저가 접속하면 수강신청 페이지로 보냄)*/}
          <Route path='/login' element={
            (user && !window.location.search.includes('action=done')) ? 
            <Navigate to='/sugang'/> : 
            <LoginPage onLogin={handleLogin} onLogout={clearUserState}/>
          }/>

          {/*로그인한 사용자만 접근 가능*/}
          <Route element={<ProtectRoutes user={user}/>}>
            {/*메인 수강신청 페이지*/}
            <Route path='/sugang' element={
              <main className='container'>
                <Bar text={"수강신청"}/>

                <div className='content'>
                  {/*왼쪽 영역 : 유저정보, 담은강의목록, 신청내역, 대기열내역, 요약표*/}
                  <div className='left'>
                  <UserInfo
                    studentData={studentData}
                    userData={user}
                  />
                  <Sugang 
                    data={lectures}
                    onRegister={handleSugang}
                  />
                  <SugangStatus 
                    // 마이페이지 데이터에서 확정된 강의만 필터링해서 전달
                    data={studentData?.enrolledCourses || []}
                    onDelete={handleCancel}
                  />
                  <WaitingList 
                    // 마이페이지 데이터에서 대기 중인 강의만 전달
                    data={studentData?.waitingCourses || []}
                    onDelete={handleWaitingCancel}
                  />
                  <Summary 
                    enrolledCourses={studentData?.enrolledCourses} 
                    waitingCourses={studentData?.waitingCourses} 
                  />
                </div>
                  {/*우측 영역 : 시간표*/}
                  <div className='right'>
                    <Timetable 
                      enrolledData={studentData?.enrolledCourses || []} 
                      waitingData={studentData?.waitingCourses || []} 
                    />
                  </div>
                </div>
              </main>
            }
          />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  )
}