import styles from "./Summary.module.css"

// 하단 요약 테이블 (신청 강의 수, 신청 학점, 대기 강의 수, 대기 학점, 신청 + 대기 학점)
export default function Summary({enrolledCourses = [], waitingCourses = []}){

    // 1. 수강 확정된 강의 요약
    const sugangCount = enrolledCourses.length
    const sugangCredits = enrolledCourses.reduce((acc, cur) => acc + Number(cur.credit), 0)

    // 2. 대기 중인 강의 요약
    const waitingCount = waitingCourses.length
    const waitingCredits = waitingCourses.reduce((acc, cur) => acc + Number(cur.credit), 0)
    
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