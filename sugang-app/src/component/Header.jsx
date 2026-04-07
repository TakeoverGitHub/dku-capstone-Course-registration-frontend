import styles from "./Header.module.css"
import logo from '../../../public/top_logo.png'
import { useNavigate } from "react-router-dom"

// 헤더 부분 (로고, 유저정보, 로그아웃버튼)
export default function Header({user,onLogout}){

    const navigate = useNavigate()

    return(
        <div className={styles.header}>
            <img src={logo} className={styles.logo} onClick={()=>navigate('/sugang')}>
            </img>

            <div className={styles.userInfo}>
                {user.name}({user.id})
                <button className={styles.button} onClick={()=>{onLogout()}}>로그아웃</button>
            </div>
        </div>
    )
}