import styles from "./UserInfo.module.css"

// 사용자 정보 테이블 (로그인한 사용자 정보 및 학점 정보)
export default function UserInfo({userInfo, credits}){
    
    return(
        <>
            <div className={styles.table}>
                <table className={styles.user}>
                    <tbody>
                        {/*현재학기, 학번, 소속, 성명, 제1전공*/}
                        <tr>
                            <td rowSpan={2} className={styles.semesterCell}>
                                {userInfo.semester}
                            </td>
                            <td className={styles.labelCell}>학번</td>
                            <td className={styles.dataCell}>{userInfo.id}</td>
                            <td className={styles.labelCell}>소속</td>
                            <td className={styles.dataCellLeft}>{userInfo.affiliation}</td>
                        </tr>
                        <tr>
                            <td className={styles.labelCell}>성명</td>
                            <td className={styles.dataCell}>{userInfo.name}</td>
                            <td className={styles.labelCell}>제1전공</td>
                            <td className={styles.dataCellLeft}>{userInfo.major}</td>
                        </tr>
                    </tbody>
                </table>

                <table className={styles.credit}>
                    <tbody>
                        {/*각 학점 내역 확인 및 신청 가능 학점 표기*/}
                        <tr>
                            <td className={styles.listCell}>이수학기</td>
                            <td className={styles.creditCell}>{credits.semester}</td>
                        </tr>
                        <tr>
                            <td className={styles.listCell}>학기최소학점</td>
                            <td className={styles.creditCell}>{credits.minimum}</td>
                        </tr>
                        <tr>
                            <td className={styles.listCell}>학기최대학점(A)</td>
                            <td className={styles.creditCell}>{credits.maximum}</td>
                        </tr>
                        <tr>
                            <td className={styles.listCell}>학기이월학점(B)</td>
                            <td className={styles.creditCell}>{credits.carry}</td>
                        </tr>
                        <tr>
                            <td className={styles.listCell}>성적초과학점(C)</td>
                            <td className={styles.creditCell}>{credits.over}</td>
                        </tr>
                        <tr>
                            <td className={styles.listCell}>혁신추가학점(D)</td>
                            <td className={styles.creditCell}>{credits.addition}</td>
                        </tr>
                        <tr>
                            <td className={styles.listCell}>신청가능학점<br />(A+B+C+D)</td>
                            <td className={styles.creditCell}>
                                {(Number(credits.maximum)||0)+(Number(credits.carry)||0)+(Number(credits.over)||0)+(Number(credits.addition)||0)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
}