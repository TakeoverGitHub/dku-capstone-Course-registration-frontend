import {FaTag} from "react-icons/fa"
import styles from "./Bar.module.css"

// 서브 타이틀 (메뉴명 + 선으로 구분)
export default function Bar({text}){
    return(
        <div className={styles.top}>        
            <div className={styles.header}>
                <FaTag size="20" color="#656565"/>
                    <span>{text}</span>
            </div>
            <div className={styles.bar}/>
        </div>
    )
}