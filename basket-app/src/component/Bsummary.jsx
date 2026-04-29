import styles from "./Bsummary.module.css"


// 담은 강의 요약 테이블 (몇 개, 몇 학점 담았는지 등)
export default function Bsummary({credits,lectures}){

    // 담은 강의만 필터링
    const sugangItems = lectures?.filter(lectures => lectures.basket === true)
    const sugangCount = sugangItems.length
    const sugangCredits = sugangItems.reduce((acc,cur) => acc + Number(cur.credits),0)

    return(
        <table className={styles.summary}>
            <tbody>
                <tr>
                    <th className={styles.label}>도우미 등록 과목 수</th>
                    <td className={styles.value}>{sugangCount}</td>
                    <th className={styles.label}>도우미 등록 학점</th>
                    <td className={styles.value}>{sugangCredits}</td>
                    <th className={styles.label}>최대수강학점</th>
                    <td className={styles.value}>{credits.maximum}</td>
                </tr>
            </tbody>
        </table>
    )
}