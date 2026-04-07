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
                        <th style={{width:"7%"}}>교과목 번호</th>
                        <th style={{width:"2%"}}>분반</th>
                        <th style={{width:"20%"}}>교과목명</th>
                        <th style={{width:"2%"}}>학점</th>
                        <th style={{width:"7%"}}>교강사명</th>
                        <th style={{width:"42%"}}>요일/교시/강의실</th>
                        <th style={{width:"4%"}}>마감 여부</th>
                        <th style={{width:"4%"}}>신청 인원</th>
                        <th style={{width:"4%"}}>제한 인원</th>
                        <th style={{width:"4%"}}>폐강</th>
                    </tr>
                </thead>
                <tbody>
                    {/*담은 강의 목록 출력 및 더블클릭으로 신청 로직 실행*/}
                    {data.map((sub)=>(
                        <tr key={`${sub.code}-${sub.division}`} onDoubleClick={()=>onRegister(sub.code, sub.division)}>
                            <td>{sub.code}</td>
                            <td>{sub.division}</td>
                            <td className={styles.nameCell}>{sub.name}</td>
                            <td>{sub.credits}</td>
                            <td>{sub.professor}</td>
                            <td className={styles.nameCell}>{sub.times}</td>
                            <td className={sub.closed === "Y" ? styles.red : styles.blue}>
                                {sub.closed}
                            </td>
                            <td>{sub.current}</td>
                            <td>{sub.limit}</td>
                            <td>{sub.cancel === "Y" ? 폐강됨 : ""}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}