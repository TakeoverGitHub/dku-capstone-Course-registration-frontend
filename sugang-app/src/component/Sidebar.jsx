import styles from "./Sidebar.module.css"
import {NavLink} from 'react-router-dom'

// 좌측 사이드바 부분 (각 메뉴(링크)들 위치)
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

            {/*웹정보시스템, Q&A, FAQ는 VOC 링크 연결*/}
            <NavLink to='https://webinfo.dankook.ac.kr/main.do' 
                target="_blank" className={styles.option}>
                ▶ 웹정보시스템
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

            {/*수강신청 페이지*/}
            <NavLink to='/sugang' className={({isActive})=>
                isActive ? `${styles.option} ${styles.active}` : styles.option}>
                ▶ 수강신청
            </NavLink>

            <div className={styles.block}>
                수강계획도우미
            </div>

            {/*장바구니 페이지로 연결*/}
            <a href="#" onClick={goBasket} className={styles.option}>
                ▶ 수강계획도우미 등록 (학부)
            </a>

            <div className={styles.box}></div>
        </div>
    )
}