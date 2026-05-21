import styles from "./Btable.module.css"

// 담은 강의 목록 (삭제 및 순서 변경 가능)
export default function Btable({data,onRemove,onSwap,onMove}){

    return(
        <>
            <div className={styles.header}>
                <div className={styles.bar}></div>
                <div>수강계획현황</div>
            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th style={{width:"5%"}}>삭제</th>
                        <th style={{width:"5%"}}>과목코드</th>
                        <th style={{width:"5%"}}>분반</th>
                        <th style={{width:"22%"}}>교과목명</th>
                        <th style={{width:"5%"}}>학점</th>
                        <th style={{width:"28%"}}>요일/교시</th>
                        <th style={{width:"6%"}}>희망 인원</th>
                        <th style={{width:"6%"}}>제한 인원</th>
                        <th style={{width:"5%"}}>잔여석</th>
                        <th style={{width:"13%"}}>순위변경</th>
                    </tr>
                </thead>
                <tbody>
                    {/*담은 강의 목록 출력*/}
                    {data.length > 0 ? data.map((sub,index) => (
                        <tr key={sub.courseId}>
                            {/*삭제 버튼으로 취소 가능*/}
                            <td><button className={styles.button} onClick={()=>onRemove(sub.cartId)}>
                                삭제</button></td>
                            <td>{sub.courseCode}</td>
                            <td>{sub.classNo}</td>
                            <td className={styles.nameCell}>{sub.courseName}</td>
                            <td>{sub.credit}</td>
                            <td className={styles.nameCell}>{sub.dayOfWeek}{sub.startTime} ~ {sub.endTime}</td>
                            <td>{sub.wish}</td>
                            <td>{sub.maxCapacity}</td>
                            <td>{sub.remain}</td>
                            <td>
                                {/*우선순위 변경 버튼*/}
                                <span className={styles.orderBtn} onClick={()=>onSwap(sub.courseId, data[index-1]?.courseId)}>
                                    {'\u25B2'}</span>
                                <span className={styles.orderBtn} onClick={()=>onSwap(sub.courseId, data[index+1]?.courseId)}>
                                    {'\u25BC'}</span>
                                <span className={styles.orderBtn} onClick={()=>onMove(sub.courseId, 'top')}>
                                    {'\u2912'}</span>
                                <span className={styles.orderBtn} onClick={()=>onMove(sub.courseId, 'bottom')}>
                                    {'\u2913'}</span>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={10}>
                                조회된 데이터가 없습니다.
                            </td>
                        </tr>
                    )
                }
                </tbody>
            </table>
            <div className={styles.message}>
                *수강신청가능학점 = 최대학점 + 초과가능(추가)학점+ 이월학점 + 혁신융합학점
            </div>
        </>
    )
}