import styles from "./Summary.module.css"

// 하단 요약 테이블 (신청 강의 수, 신청 학점, 대기 강의 수, 대기 학점, 신청 + 대기 학점)
export default function Summary({data}){

    // 수강 신청된 강의 목록 (개수, 학점 계산)
    const sugangItems = data.filter(lectures => lectures.status === "sugang")
    const sugangCount = sugangItems.length
    const sugangCredits = sugangItems.reduce((acc,cur) => acc + Number(cur.credits),0)

    // 대기열 신청된 강의 목록 (개수, 학점 계산)
    const waitingItems = data.filter(lectures => lectures.status === "waiting")
    const waitingCount = waitingItems.length
    const waitingCredits = waitingItems.reduce((acc,cur) => acc + Number(cur.credits),0)

    return(
        <table className={styles.summary}>
            <tbody>
                <tr>
                    <th className={styles.label}>신청과목 수</th>
                    <td className={styles.value}>{sugangCount}</td>
                    <th className={styles.label}>신청학점</th>
                    <td className={styles.value}>{sugangCredits}</td>
                    <th className={styles.label}>대기과목 수</th>
                    <td className={styles.value}>{waitingCount}</td>
                    <th className={styles.label}>대기학점</th>
                    <td className={styles.value}>{waitingCredits}</td>
                    <th className={styles.label}>신청학점+대기학점</th>
                    <td className={styles.value}>{sugangCredits+waitingCredits}</td>
                </tr>
            </tbody>
        </table>
    )
}