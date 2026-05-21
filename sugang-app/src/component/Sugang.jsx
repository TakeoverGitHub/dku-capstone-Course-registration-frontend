import styles from "./Sugang.module.css"

// 장바구니로 담은 강의 목록 보여주는 테이블 (더블클릭으로 신청)
export default function Sugang({data, onRegister}){

    return(
        <>
            <div className={styles.header}>
                <div className={styles.bar}></div>
                <div>수강계획도우미</div>
            </div>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th style={{width:"7%"}}>과목코드</th>
                        <th style={{width:"2%"}}>분반</th>
                        <th style={{width:"20%"}}>교과목명</th>
                        <th style={{width:"2%"}}>학점</th>
                        <th style={{width:"42%"}}>요일/교시</th>
                        <th style={{width:"4%"}}>신청 인원</th>
                        <th style={{width:"4%"}}>제한 인원</th>
                    </tr>
                </thead>
                <tbody>
                    {/*담은 강의 목록 출력 및 더블클릭으로 신청 로직 실행*/}
                    {data.map((sub)=>(
                        <tr key={Number(sub.courseId)} onDoubleClick={()=>onRegister(sub.courseId)}>
                            <td>{sub.courseCode}</td>
                            <td>{sub.classNo}</td>
                            <td className={styles.nameCell}>{sub.courseName}</td>
                            <td>{sub.credit}</td>
                            <td className={styles.nameCell}>{sub.dayOfWeek}{sub.startTime} ~ {sub.endTime}</td>
                            <td>{sub.currentEnrollment}</td>
                            <td>{sub.remain}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}