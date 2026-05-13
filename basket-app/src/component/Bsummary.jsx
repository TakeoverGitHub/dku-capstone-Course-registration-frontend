import styles from "./Bsummary.module.css"


// 담은 강의 요약 테이블 (몇 개, 몇 학점 담았는지 등)
export default function Bsummary({credits,myCartLectures}){

    // 테이블 구성요소 (강의수, 학점)
    const sugangCount = myCartLectures.length
    const sugangCredits = myCartLectures.reduce((acc, cur) => acc + Number(cur.credit || 0), 0);

    return(
        <table className={styles.summary}>
            <tbody>
                <tr>
                    <th className={styles.label}>도우미 등록 과목 수</th>
                    <td className={styles.value}>{sugangCount}</td>
                    <th className={styles.label}>도우미 등록 학점</th>
                    <td className={styles.value}>{sugangCredits}</td>
                    <th className={styles.label}>최대수강학점</th>
                    <td className={styles.value}>{credits}</td>
                </tr>
            </tbody>
        </table>
    )
}