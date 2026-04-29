import styles from "./UserInfo.module.css"

// 사용자 정보 테이블 (로그인한 사용자 정보 및 학점 정보)
export default function UserInfo({studentData, userData}){

    return(
        <>
            <div className={styles.table}>
                <table className={styles.user}>
                    <tbody>
                        <tr>
                            <td className={styles.labelCell}>학번</td>
                            <td className={styles.dataCell}>{userData.studentId}</td>
                            <td className={styles.labelCell}>성명</td>
                            <td className={styles.dataCell}>{userData.name}</td>
                            <td className={styles.labelCell}>최대수강학점</td>
                            <td className={styles.dataCellLeft}>{userData.maxCredit}</td>
                            <td className={styles.labelCell}>가용학점</td>
                            <td className={styles.dataCellLeft}>{studentData.availableCredit}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
}