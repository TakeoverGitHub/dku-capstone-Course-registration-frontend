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
  const [myCartLectures, setMyCartLectures] = useState([])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const action = params.get('action')

    if (action === 'clear') {
      localStorage.removeItem('user')
      setUser(null)
      const currentUrl = window.location.origin
      window.location.href = `http://localhost:3000/login?from=protected&redirect=${encodeURIComponent(currentUrl)}`
      return
    }

    // 유저 정보 없으면 접근 막기 (로그인 페이지로 강제 이동)
    if(!user && !localStorage.getItem('user')){
      if(action === 'done') return
      if(action === 'clear') return
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

  // 1. 데이터 동기화 함수 (백엔드 DTO 매핑 적용 버전)
  const refreshData = async () => {
    const studentId = user?.studentId;
    if (!studentId) return;
    
    try {
      // 일반 전체 과목 목록 가져오기
      const courseRes = await api.get('/courses'); 
      setLectures(courseRes.data);

      // 장바구니 DTO 리스트 수신
      const cartRes = await api.get(`/cart/${studentId}`); 
      setCartItems(cartRes.data); // 원본 저장

      // 백엔드가 준 데이터를 priority 기준으로 오름차순 정렬하여 상태에 주입
      const sortedCartLectures = [...cartRes.data].sort((a, b) => Number(a.priority) - Number(b.priority));

      console.log("최종 정렬 및 조립 완료된 장바구니 내역:", sortedCartLectures);
      setMyCartLectures(sortedCartLectures);
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    }
  };

  // 2. 변경된 순서를 백엔드 DB에 영구 저장하는 함수
  const savePriorityToServer = async (updatedList) => {
    try {
      // 정렬된 배열에서 cartId 목록만 순서대로 추출 (예: [12, 15, 8, 23])
      const sortedCartIds = updatedList.map(item => item.cartId);

      // 백엔드 컨트롤러 구조인 { cartIds: [...] } 형식으로 put 요청
      await api.put(`/cart/${user.studentId}/priority`, {
        cartIds: sortedCartIds
      });

      // DB 저장이 끝나면 최신화된 데이터를 서버에서 다시 긁어옴
      await refreshData();
    } catch (error) {
      alert("순서 변경 사항을 저장하지 못했습니다.");
    }
  };

  useEffect(() => {
    if(user && user.studentId){
      refreshData();
    }
  }, [user]);

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

  // 장바구니 취소 new
  const onDelete = async (cartId) => {
    try {
      // 1. 백엔드 POST 요청 (request body에 데이터 담기)
      const response = await api.delete(`/cart/${user.studentId}/${cartId}`);

      // 3. 장바구니 목록 새로고침 (데이터 동기화)
      refreshData();
    } catch (error) {
      alert(error.response?.data?.message || "이미 장바구니에 담긴 과목입니다.");
    }
  };

  // 3. 강의 우선순위 한 칸씩 변경 함수
  const swapPriority = async (currentId, targetId) => {
    if (!targetId) return;

    const listCopy = [...myCartLectures];
    const currentLecture = listCopy.find(l => l.courseId === currentId);
    const targetLecture = listCopy.find(l => l.courseId === targetId);

    if (!currentLecture || !targetLecture) return;

    // 우선순위 값 swap
    const tempPriority = currentLecture.priority;
    currentLecture.priority = targetLecture.priority;
    targetLecture.priority = tempPriority;

    const sortedList = listCopy.sort((a, b) => a.priority - b.priority);

    // UI를 즉시 먼저 움직이게 하여 사용자 경험을 살립니다.
    setMyCartLectures(sortedList);
    
    // 백그라운드에서 백엔드 DB 저장을 요청합니다.
    await savePriorityToServer(sortedList);
  };

  // 4. 강의 우선순위 맨 위/아래 변경 함수
  const moveExtremePriority = async (currentId, type) => {
    if (myCartLectures.length === 0) return;

    const priorityValues = myCartLectures.map(l => l.priority || 0);
    const minPriority = Math.min(...priorityValues);
    const maxPriority = Math.max(...priorityValues);

    const updated = myCartLectures.map(l => {
      if (l.courseId === currentId) {
        return { ...l, priority: type === 'top' ? minPriority - 1 : maxPriority + 1 };
      }
      return l;
    });

    const sortedList = [...updated].sort((a, b) => a.priority - b.priority);

    // UI를 즉시 먼저 움직이게 하여 사용자 경험을 살립니다.
    setMyCartLectures(sortedList);
    
    // 백그라운드에서 백엔드 DB 저장을 요청합니다.
    await savePriorityToServer(sortedList);
  };
  
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
        onRemove={onDelete}
        onSwap={swapPriority}
        onMove={moveExtremePriority}
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