import styles from "./WaitingList.module.css"
import React from "react"

// 대기열신청내역 테이블 (삭제 가능, 대기 번호 확인 가능)
export default function WaitingList({data, onDelete}){

    return(
        <>
            <div className={styles.header}>
                <div className={styles.bar}></div>
                <div>대기열신청내역</div>
            </div>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th style={{width:"7%"}}>삭제</th>
                        <th style={{width:"8%"}}>캠퍼스</th>
                        <th style={{width:"12%"}}>교과목번호</th>
                        <th style={{width:"3%"}}>분반</th>
                        <th style={{width:"32%"}}>교과목명</th>
                        <th style={{width:"3%"}}>학점</th>
                        <th style={{width:"10%"}}>교강사명</th>
                        <th style={{width:"8%"}}>재수강년도학기</th>
                        <th style={{width:"10%"}}>수업유형</th>
                        <th style={{width:"7%"}}>대기번호</th>
                    </tr>
                </thead>
                <tbody>
                    {/*대기 중인 강의 목록 출력*/}
                    {data.map((sub)=>(
                        <React.Fragment key={`${sub.code}-${sub.division}`}>
                        <tr>
                            {/*삭제 버튼으로 대기열 취소 가능*/}
                            <td rowSpan={2}><button className={styles.button} onClick={()=>onDelete(sub.code, sub.division)}>삭제</button></td>
                            <td>{sub.campus}</td>
                            <td>{sub.code}</td>
                            <td>{sub.division}</td>
                            <td className={styles.nameCell}>{sub.name}</td>
                            <td>{sub.credits}</td>
                            <td>{sub.professor}</td>
                            <td>{sub.retake}</td>
                            <td>{sub.type}</td>
                            {/*대기번호 5이하면 "5이하"로 표기*/}
                            <td className={sub.mywaiting <= 5 ? styles.red : ""}>
                                {sub.mywaiting <= 5 ? "5이하" : sub.mywaiting}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={9} className={styles.nameCell}>
                                <div>{sub.times}</div>
                            </td>
                        </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </>
    )
}