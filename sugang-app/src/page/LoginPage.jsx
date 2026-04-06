import { useEffect, useState, useRef } from "react"
import styles from "./LoginPage.module.css"
import { useLocation, useNavigate } from "react-router-dom"
import logo from '../../../public/top_logo.png'

export default function LoginPage({onLogin, onLogout}){
    const location = useLocation()
    const navigate = useNavigate()
    const hasAlerted = useRef(false)

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const isDone = params.get('action') === "done"
        const isFromProtected = params.get('from') === "protected"

        if(isDone && !hasAlerted.current){
            localStorage.clear()
            onLogout()
            hasAlerted.current = true
            window.history.replaceState({}, '', window.location.pathname)

            alert("로그아웃되었습니다.")
            navigate('/login', {replace:true})
            return
        }

        if(isFromProtected && !hasAlerted.current){
            hasAlerted.current = true
            window.history.replaceState({}, '', window.location.pathname)
            alert("로그인이 필요한 서비스입니다.")
            navigate('/login', {replace:true})
        }
    }, [location.search,onLogout,navigate])

    const [id, setId] = useState('')
    const [pw, setPw] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if(Number(id) === 12345678 && pw === "1234"){
            const userInfo = {id:12345678, name:"홍길동"}
            onLogin(userInfo)
            const params = new URLSearchParams(window.location.search)
            const redirecUrl = params.get('redirect')

            if(redirecUrl){
                const userStr = encodeURIComponent(JSON.stringify(userInfo))
                window.location.href = `${redirecUrl}?user=${userStr}`
            } else{
                navigate('/')
            }
        } else alert("학번 또는 비밀번호가 틀렸습니다.")
    }

    return(
        <div className={styles.login}>
            <div className={styles.left}>
                <div className={styles.loginContent}>
                    <img src={logo} className={styles.logo}/>
                    <h3>단국대학교 수강신청시스템 로그인.</h3>
                </div>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <input type="text" placeholder="아이디를 입력하여 주세요." 
                            value={id} onChange={(e) => setId(e.target.value)}/>
                        <input type="password" placeholder="비밀번호를 입력하여 주세요." 
                            value={pw} onChange={(e) => setPw(e.target.value)}/>
                    </div>
                    <button type="submit" className={styles.button}>Login</button>
                </form>
            </div>

            <div className={styles.right}>
                <div className={styles.notice}>
                    <h3>▶ ▶ 불법 수강신청에 따른 안내</h3>
                    <p>
                        <span className={styles.red}>불법 수강신청</span>으로 인하여 타학생에게 피해를 주고 대학 전산망에 악영향을 주는 경우
                        <span className={styles.red}> 학칙에 의거 엄중 처벌되며</span> 수강신청 블랙리스트에 등록되어 수강신청 권한이 제한됩니다.
                    </p>
                    <p className={styles.gray}>
                        - 매크로 등 불법 프로그램을 이용하여 수강신청하는 행위
                        <br/>
                        - 타인의 비밀번호를 도용하여 수강신청 하는 등 기타 불법행위
                    </p>
                    <h3>▶ ▶ 수강신청 안내</h3>
                    <p>
                        -<span className={styles.blue}>최초 비밀번호는 주민등록번호 앞 10자리</span>이며 웹정보 시스템에서 비밀번호 변경 가능
                    </p>
                    <p>
                        -수강신청 프로그램은 Chrome, Firefox, Safari 이용 가능(브라우저별 최신 버전으로 업데이트 권장)
                    </p>
                    <h3>▶ ▶ 수강신청시스템 이상 발생 시 안내</h3>
                    <p>
                        -우리 대학은 수강신청 시스템의 안정적이 운영에 만전을 기하고 있으나 
                        수강신청 시 과도한 트래픽에 따른 예상치 못한 오류가 발생하여 
                        <span className={styles.red}>이상이 감지될 경우 개시 1분 이내 시점에서 시스템이 중단됩니다.</span>
                    </p>
                    <p>
                        -이 경우 공정성 확보를 위해 수강신청 내역은 일괄 삭제되며, 
                        이상 발생에 따른 수강신청 재개 관련 사항은 별도 공지 예정입니다.
                    </p>
                    <p className={styles.gray}>
                        ☎죽전: 학사팀(031-8005-2055), 교양(031-8005-2521)
                    </p>
                    <p className={styles.gray}>
                        ☎천안: 학사팀(041-550-1222~1229), 교양(041-550-1342, 1343)
                    </p>
                </div>
            </div>
        </div>
    )
}