import Bheader from './component/Bheader'
import styles from './App.module.css'
import Bbar from './component/Bbar'
import Btable from './component/Btable'
import { useEffect, useState } from 'react'
import Bsummary from './component/Bsummary'
import Bsearch from './component/Bsearch'
import api from './axios.jsx'

// 컴포넌트들 호출 및 로직 담당
export default function App() {

  // 로그인 페이지에서 넘겨받은 파라미터로 유저 저장 (없으면 로컬스토리지에서 가져옴)
  const [user,setUser] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    const userFromUrl = params.get('user')

    // URL에 유저 데이터 넘어온 경우 로컬스토리지에 동기화 및 주소창 정리
    if(userFromUrl){
      try{
        const parsedUser = JSON.parse(decodeURIComponent(userFromUrl))
        localStorage.setItem('user', JSON.stringify(parsedUser))
        window.history.replaceState({}, '', window.location.pathname)
        return parsedUser
      } catch (e) {console.error(e)}
    }

    // URL에 없으면 로컬스토리지 세션 확인
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  const [lectures, setLectures] = useState([])
  const [cartItems, setCartItems] = useState([])
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const action = params.get('action')

    // 유저 정보 없으면 접근 막기 (로그인 페이지로 강제 이동)
    if(!user && !localStorage.getItem('user')){
      if(action === 'done') return
      const currentUrl = window.location.origin
      window.location.href = `http://localhost:3000/login?from=protected&redirect=${encodeURIComponent(currentUrl)}`
    }

    // 다른 탭에서 로그아웃 시 현재 페이지도 로그아웃
    const checkAuth = () => {
      const checkStorage = localStorage.getItem('user')
      if (user && !checkStorage){
        setUser(null)
      }
    }

    // 2초마다 스토리지 상태 확인
    const timer = setInterval(checkAuth, 2000)
    return () => clearInterval(timer)
  }, [user])

  // 로그아웃 시 로컬스토리지 유저 정보 비우고 수강신청페이지에 로그아웃 신호 (action=done 전달)
  const handleLogout = () => {
    localStorage.removeItem('user')
    window.location.href = "http://localhost:3000/login?action=done"
  }

  // 로그인되지 않은 상태에서는 렌더링 차단
  if(!user && !localStorage.getItem('user')) return null

  const refreshData = async () => {
    const studentId = user?.studentId
    if (!studentId) {
        console.warn("학번 정보가 없어 요청을 중단합니다.");
        return;
    }
    try {
      // 1. 전체 강의 목록 가져오기 (CourseService 연동)
      const courseRes = await api.get('/courses');
      // 2. 장바구니 테이블 정보 가져오기 (학생 ID 기준)
      const cartRes = await api.get(`/cart/${user.studentId}`);
      setLectures(courseRes.data);
      setCartItems(cartRes.data);
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    }
  };

  useEffect(() => {
    if(user && user.studentId){
      refreshData();
    }
  }, [user]);

  // 담은 강의 목록 필터링
  const myCartLectures = lectures.filter(lecture => 
    cartItems.some(cart => cart.courseId === lecture.courseId)
  );

  // 장바구니 담기 new
  const onAdd = async (courseId) => {
    try {
      // 1. 백엔드 POST 요청 (request body에 데이터 담기)
      const response = await api.post('/cart', {
        studentId: user.studentId,
        courseId: courseId
      });

      // 3. 장바구니 목록 새로고침 (데이터 동기화)
      refreshData();
    } catch (error) {
      alert(error.response?.data?.message || "이미 장바구니에 담긴 과목입니다.");
    }
  };

  // 장바구니 담기/취소 이전 버전 (basket 변수로 관리)
  const addBasket = (id, isAdding) => {
    if(isAdding){
      const already = lectures.find(lectures => lectures.id === id && lectures.basket)
      if(already){
        alert("이미 처리된 과목입니다.")
        return lectures
      }
    }

    
    // 우선순위(seq) 부여, 희망 인원(wish) 증감 처리
    setLectures(prev => {
      if(!Array.isArray(prev)) return prev
      
      const basketItems = prev.filter(l=>l.basket)
      const maxSeq = basketItems.length > 0 ? Math.max(...basketItems.map(l=>l.seq || 0)) : 0
      return prev.map(lectures => {
        if(lectures.id === id){
          return {...lectures, basket: isAdding,
            seq: isAdding ? maxSeq + 1 : 0,
            wish: isAdding ? (lectures.wish || 0)+1 : (lectures.wish || 0)-1
          }
        }
        return lectures
      })
    })
  }

  // 강의 우선순위 변경 (위 아래)
  const swapSeq = (currentId, targetId) => {
    if(!targetId) return
    setLectures(prev => {
      const currentLecture = prev.find(l=>l.id === currentId)
      const targetLecture = prev.find(l=>l.id === targetId)

      return prev.map(l=>{
        if(l.id === currentId) return {...l, seq:targetLecture.seq}
        if(l.id === targetId) return {...l, seq:currentLecture.seq}
        return l
      })
    })
  }

  // 강의 우선순위 변경 (맨 위/아래)
  const moveExtreme = (currentId, type) => {
    setLectures(prev => {
      const basketLectures = prev.filter(l=>l.basket)
      const seqValues = basketLectures.map(l=>l.seq)

      const minSeq = Math.min(...seqValues)
      const maxSeq = Math.max(...seqValues)

      return prev.map(l=>{
        if(l.id === currentId){
          return {...l, seq:type === 'top' ? minSeq - 1 : maxSeq + 1}
        }
        return l
      })
    })
  }
  
  return(
    <div className={styles.app}>
      <Bheader user={user} onLogout={handleLogout}/>
      <Bbar text={"수강계획도우미"}/>

      <div className={styles.container}>
        <div className={styles.notice}>
          <p>
            <span style={{color:"red"}}>※ 시스템 테스트로 인하여 간혹 사용기간이 열려 수강신청이 가능할 수 있으나 
              테스트 후 예고없이 삭제됩니다.</span><br/>
            1) 강의시간/강의실은 교강사 및 강의실 사정에 따라 변경될 수 있으니 
              아래[수강계획현황] 및 [수강계획시간표]를 활용하여 중복여부를 확인 바랍니다.<br/>
            2) 수강신청 전 반드시 원격수업 및 영어강의 여부를 최종적으로 확인 바랍니다.<br/>
            3) 재수강은 기존 수강교과목 중 C+ 이하 성적을 취득한 교과목에 한해 한 학기 최대 6학점까지 수강가능.<br/>
            4) 교육과정 경과조치 (2024학년도 이전 입학자)<br/>
            <span style={{color:"gray"}}>
              - DK로드맵 미이수자는 선택교양 취업진로교과목 ( 554880, 545530, 544820 ) 대체이수<br/>
              - 공통교양 대학영어1,2 교과목 각 2학점으로 이수기준 완화<br/>
              - 공통교양 진로설계와자기계발/글로벌중국어 이수 의무사항 폐지<br/>
              - 영역교양 이수기준은 영역구분없이 입학년도 이수기준 학점 충족으로 변경<br/>
              {"\u00A0\u00A0\u00A0"}(단, 2024학년도 입학자는 혁신/정보/기술 영역교양을 SW/AI 영역에서 단과대학별 필수교과 이수해야 함)<br/>
            </span>
            - 기타 전공 학과(부)기초, 법학소양, 공학소양 이수 경과조치는 학과사무실 문의<br/>
            5) 혁신칼리지 입학생 교과과정 바로가기 (  퇴계 / 율곡 )
          </p>
        </div>
      </div>

      <Btable 
        data={(myCartLectures || [])}
        onRemove={(id) => addBasket(id,false)}
        onSwap={swapSeq}
        onMove={moveExtreme}
      />

      <Bsummary 
        credits={user.maxCredit}
        myCartLectures={myCartLectures}
      />

      <Bsearch 
        data={lectures}
        onAdd={onAdd}
      />
    </div>
  )
}