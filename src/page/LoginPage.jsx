import { useEffect, useState, useRef } from "react"
import styles from "./LoginPage.module.css"
import { useLocation, useNavigate } from "react-router-dom"
import logo from '../../public/top_logo.png'

export default function LoginPage({onLogin}){
    const location = useLocation()
    const navigate = useNavigate()
    const hasAlerted = useRef(false)

    useEffect(() => {
        if(location.state?.from === "protected" && !hasAlerted.current){
            alert("로그인이 필요한 서비스입니다.")
            hasAlerted.current = true
            navigate(location.pathname, {replace: true, state:{}})
        }
    }, [location,navigate])

    const [id, setId] = useState('')
    const [pw, setPw] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        id === 12345678 || pw === "1234" ? 
            onLogin({id:12345678, name:"홍길동"}) 
            : alert("학번 또는 비밀번호가 틀렸습니다.")
    }

    return(
        <div className={styles.login}>
            <div className={styles.left}>
                <div className={styles.loginContent}>
                    <img src={logo} className={styles.logo}/>
                    <h3>단국대학교 수강신청시스템 로그인.</h3>
                </div>
                <div className={styles.form}>
                    <div className={styles.inputGroup}>
                        <input type="text" placeholder="아이디를 입력하여 주세요." 
                            value={id} onChange={(e) => setId(e.target.value)}/>
                        <input type="password" placeholder="비밀번호를 입력하여 주세요." 
                            value={pw} onChange={(e) => setPw(e.target.value)}/>
                    </div>
                    <button className={styles.button} onClick={handleSubmit}>Login</button>
                </div>
            </div>

            <div className={styles.right}>
                <div className={styles.header}>
                    Please select a language ▶
                    <select>
                        <option>한국어</option>
                        <option>English</option>
                    </select>
                </div>
                <div className={styles.notice}>
                    <h3>▶ 불법 수강신청에 따른 안내</h3>
                    <p>불법 수강신청...</p>
                    <p>불법 수강신청...</p>
                    <p>불법 수강신청...</p>
                </div>
            </div>
        </div>
    )
}