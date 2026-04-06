import styles from "./Sidebar.module.css"
import {NavLink} from 'react-router-dom'

export default function Sidebar({goBasket}){
    
    return(
        <div className={styles.menu}>
            <div className={styles.title}>
                단국대학교
                <span style={{color:"#A68056"}}>수강신청시스템</span>
            </div>
            <div className={styles.sugang}>
                수강신청
            </div>

            <div className={styles.block}>
                수강안내
            </div>

            <NavLink to='/notice' className={({isActive})=>
                isActive ? `${styles.option} ${styles.active}` : styles.option}>
                ▶ 수강안내문
            </NavLink>
            <NavLink to='https://voc.dankook.ac.kr/tiad/vocm/findVocList.do?_view=ok' 
                target="_blank" className={styles.option}>
                ▶ Q&A
            </NavLink>
            <NavLink to='https://voc.dankook.ac.kr/tiad/vocm/findFaqList.do?_view=ok' 
                target="_blank" className={styles.option}>
                ▶ FAQ
            </NavLink>

            <div className={styles.block}>
                수강신청
            </div>

            <NavLink to='/sugang' className={({isActive})=>
                isActive ? `${styles.option} ${styles.active}` : styles.option}>
                ▶ 수강신청
            </NavLink>
            <NavLink to='/timetable' className={({isActive})=>
                isActive ? `${styles.option} ${styles.active}` : styles.option}>
                ▶ 수강시간표
            </NavLink>
            <NavLink to='/confirmation' className={({isActive})=>
                isActive ? `${styles.option} ${styles.active}` : styles.option}>
                ▶ 수강신청확인서
            </NavLink>

            <div className={styles.block}>
                수강계획도우미
            </div>

            <a href="#" onClick={goBasket} className={styles.option}>
                ▶ 수강계획도우미 등록 (학부)
            </a>

            <div className={styles.box}></div>
        </div>
    )
}