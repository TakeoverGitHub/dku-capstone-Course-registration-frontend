import Timetable from "../component/Timetable"
import styles from "./TimetablePage.module.css"

export default function TimetablePage({data}){

    const currentSemester = "2026년도 1학기"

    return(
        <>
            <div className={styles.header}>
                <div className={styles.bar}></div>
                <div>{currentSemester} 수강시간표</div>
            </div>
            <div className={styles.timetable}>
                <Timetable data={data}/>
            </div>
        </>
    )
}