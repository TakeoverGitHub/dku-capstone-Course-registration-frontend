import styles from "./Timetable.module.css"
import React from "react"

// 시간표 (수강신청내역, 대기열신청내역에 추가된 강의들 시각화)
export default function Timetable({data}){
    
    // 시간표 그리기
    const days = ['월', '화', '수', '목', '금', '토']
    const times = Array.from({length:24}, (_,i) => i+1)

    // 넘겨받은 데이터에서 시간 정보 추출
    const getSubject = (day, period) => {
        const sub = data.filter(lecture => {
            if(!lecture.times || !lecture.status) return false

            const timePart = lecture.times.split('(')[0]
            const daysArray = timePart.split('/')
            const targetDayStr = daysArray.find(d => d.trim().startsWith(day))

            if(!targetDayStr) return false

            const periods = targetDayStr.replace(day, "").split(',')
            return periods.some(p=>p.trim() === String(period))
        })

        if(sub.length === 0) return ""

        const hasSugang = sub.some(l=>l.status === "sugang")
        const hasWaiting = sub.some(l=>l.status === "waiting")
        
        // 수강확정 강의는 회색, 대기 중인 강의는 파란색으로
        if(hasSugang) return styles.sugangCell
        if(hasWaiting) return styles.waitingCell
        return ""
    }

    return(
        <div className={styles.timetable}>
            {/*시간표 틀 구성*/}
            <div className={styles.grid}>
                <div className={`${styles.cell} ${styles.label}`}/>
                {days.map(day=><div key={day} className={`${styles.cell} ${styles.label}`}>{day}</div>)}
            </div>

            {/*해당되는 칸 칠하기*/}
            <div className={styles.grid}>
                {times.map(time=>(
                    <React.Fragment key={time}>
                        <div className={styles.cell}>{time}</div>
                        {days.map(day=>{
                            const status = getSubject(day,time)
                            return(
                                <div key={`${day}-${time}`} className={`${styles.cell} ${status}`}/>
                            )
                        })}
                    </React.Fragment>
                ))}
            </div>
        </div>
    )
}