import styles from "./Timetable.module.css"
import React from "react"

// 시간표 (수강신청내역, 대기열신청내역에 추가된 강의들 시각화)
export default function Timetable({ enrolledData, waitingData }) {
    
    const days = ['월', '화', '수', '목', '금', '토']
    const times = Array.from({length: 24}, (_, i) => i + 1)

    const dayMap = {
        'MON': '월', 'TUE': '화', 'WED': '수', 
        'THU': '목', 'FRI': '금', 'SAT': '토', 'SUN': '일'
    }

    const getSubjectStatus = (day, period) => {
        // 1. 수강 확정 데이터에서 먼저 찾기
        const isEnrolled = enrolledData.some(lecture => {
            const lectureDay = dayMap[lecture.dayOfWeek] || lecture.dayOfWeek
            return lectureDay === day && period >= lecture.startTime && period <= lecture.endTime
        })
        if (isEnrolled) return styles.sugangCell

        // 2. 확정 내역에 없다면 대기열 데이터에서 찾기
        const isWaiting = waitingData.some(lecture => {
            const lectureDay = dayMap[lecture.dayOfWeek] || lecture.dayOfWeek
            return lectureDay === day && period >= lecture.startTime && period <= lecture.endTime
        })
        if (isWaiting) return styles.waitingCell

        return ""
    }

    return (
        <div className={styles.timetable}>
            <div className={styles.grid}>
                <div className={`${styles.cell} ${styles.label}`}/>
                {days.map(day => <div key={day} className={`${styles.cell} ${styles.label}`}>{day}</div>)}
            </div>

            <div className={styles.grid}>
                {times.map(time => (
                    <React.Fragment key={time}>
                        <div className={styles.cell}>{time}</div>
                        {days.map(day => {
                            const statusClass = getSubjectStatus(day, time)
                            return (
                                <div key={`${day}-${time}`} className={`${styles.cell} ${statusClass}`}/>
                            )
                        })}
                    </React.Fragment>
                ))}
            </div>
        </div>
    )
}