import Bheader from './component/Bheader'
import styles from './App.module.css'
import Bbar from './component/Bbar'
import Btable from './component/Btable'
import data from '../../db/basketData.json'
import { useEffect, useState } from 'react'
import Bsummary from './component/Bsummary'
import Bsearch from './component/Bsearch'

export default function App() {

  const [user,setUser] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    const userFromUrl = params.get('user')

    if(userFromUrl){
      try{
        const parsedUser = JSON.parse(decodeURIComponent(userFromUrl))
        localStorage.setItem('user', JSON.stringify(parsedUser))
        window.history.replaceState({}, '', window.location.pathname)
        return parsedUser
      } catch (e) {console.error(e)}
    }

    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  const [lectures, setLectures] = useState(data.lectures)
  const [credits, setCredits] = useState(data.credits)
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const action = params.get('action')

    if(action === 'clear'){
      localStorage.removeItem('user')
      setUser(null)

      const nextUrl = params.get('next')
      if(nextUrl) {
        window.location.href = nextUrl
      }
      return
    }
    
    if(!user && !localStorage.getItem('user')){
      if(action === 'done') return
      const currentUrl = window.location.origin
      window.location.href = `http://localhost:3000/login?from=protected&redirect=${encodeURIComponent(currentUrl)}`
    }

    const checkAuth = () => {
      const checkStorage = localStorage.getItem('user')
      if (user && !checkStorage){
        alert("세션이 만료되었거나 다른 창에서 로그아웃되었습니다.")
        setUser(null)
      }
    }

    const timer = setInterval(checkAuth, 2000)
    return () => clearInterval(timer)
  }, [user])

  const handleLogout = () => {
    window.location.href = "http://localhost:3000/login?action=done"
  }

  if(!user && !localStorage.getItem('user')) return null

  const addBasket = (id, isAdding) => {
    if(isAdding){
      const already = lectures.find(lectures => lectures.id === id && lectures.basket)
      if(already){
        alert("이미 처리된 과목입니다.")
        return lectures
      }
    }

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
        data={(lectures || []).filter(lectures => lectures.basket).sort((a,b) => (a.seq || 0) - (b.seq || 0))}
        onRemove={(id) => addBasket(id,false)}
        onSwap={swapSeq}
        onMove={moveExtreme}
      />

      <Bsummary 
        credits={credits}
        lectures={lectures}
      />

      <Bsearch 
        data={lectures}
        onAdd={addBasket}
      />
  
      <a href='http://localhost:3000/sugang'>수강신청 페이지 이동</a>
    </div>
  )
}