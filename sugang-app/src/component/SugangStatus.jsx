import styles from "./SugangStatus.module.css"
import React from "react"

// 수강신청내역 테이블 (삭제 가능)
export default function SugangStatus({data, onDelete}){

    return(
        <>
            <div className={styles.header}>
                <div className={styles.bar}></div>
                <div>수강신청내역</div>
            </div>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th style={{width:"7%"}}>삭제</th>
                        <th style={{width:"12%"}}>교과목번호</th>
                        <th style={{width:"3%"}}>분반</th>
                        <th style={{width:"42%"}}>교과목명</th>
                        <th style={{width:"3%"}}>학점</th>
                    </tr>
                </thead>
                <tbody>
                    {/*신청완료된 강의 목록 출력 및 삭제 버튼*/}
                    {data.map((sub)=>(
                        <React.Fragment key={Number(sub.courseId)}>
                        <tr>
                            <td rowSpan={2}><button className={styles.button} onClick={()=>onDelete(sub.courseId)}>삭제</button></td>
                            <td>{sub.courseCode}</td>
                            <td>{sub.classNo}</td>
                            <td className={styles.nameCell}>{sub.courseName}</td>
                            <td>{sub.credit}</td>
                        </tr>
                        <tr>
                            <td colSpan={4} className={styles.nameCell}>
                                <div>{sub.dayOfWeek}{sub.startTime} ~ {sub.endTime}</div>
                            </td>
                        </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </>
    )
}