import {FaTag} from "react-icons/fa"
import styles from "./Bar.module.css"

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