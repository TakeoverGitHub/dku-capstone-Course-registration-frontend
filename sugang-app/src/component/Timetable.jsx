import styles from "./Timetable.module.css"
import React from "react"

export default function Timetable({data}){
    
    const days = ['월', '화', '수', '목', '금', '토']
    const times = Array.from({length:24}, (_,i) => i+1)    

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
        
        if(hasSugang) return styles.sugangCell
        if(hasWaiting) return styles.waitingCell
        return ""
    }

    return(
        <div className={styles.timetable}>
            <div className={styles.grid}>
                <div className={`${styles.cell} ${styles.label}`}/>
                {days.map(day=><div key={day} className={`${styles.cell} ${styles.label}`}>{day}</div>)}
            </div>

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