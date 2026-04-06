import styles from "./Bsummary.module.css"

export default function Bsummary({credits,lectures}){

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
                    <th className={styles.label}>영어레벨</th>
                    <td className={styles.value} colSpan={3}>{credits.english}</td>
                </tr>
                <tr>
                    <th className={styles.label}>최대학점</th>
                    <td className={styles.value}>{credits.maximum}</td>
                    <th className={styles.label}>초과가능(추가)</th>
                    <td className={styles.value}>{credits.over}</td>
                    <th className={styles.label}>이월학점</th>
                    <td className={styles.value}>{credits.carry}</td>
                    <th className={styles.label}>혁신융합학점</th>
                    <td className={styles.value}>{credits.addition}</td>
                </tr>
            </tbody>
        </table>
    )
}