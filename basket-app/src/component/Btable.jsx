import styles from "./Btable.module.css"

// 담은 강의 목록 (삭제 및 순서 변경 가능)
export default function Btable({data,onRemove,onSwap,onMove}){

    // 우선순위 기준 정렬
    const basketList = (data || []).sort((a,b) => (a.seq || 0) - (b.seq || 0))

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
                        <th style={{width:"4%"}}>캠퍼스</th>
                        <th style={{width:"10%"}}>교과목-분반</th>
                        <th style={{width:"20%"}}>교과목명</th>
                        <th style={{width:"5%"}}>학점</th>
                        <th style={{width:"5%"}}>교강사</th>
                        <th style={{width:"7%"}}>강의언어</th>
                        <th style={{width:"25%"}}>요일/교시/강의실</th>
                        <th style={{width:"2%"}}>희망 인원</th>
                        <th style={{width:"2%"}}>제한 인원</th>
                        <th style={{width:"4%"}}>잔여석</th>
                        <th style={{width:"2%"}}>폐강</th>
                        <th style={{width:"9%"}}>순위변경</th>
                    </tr>
                </thead>
                <tbody>
                    {/*담은 강의 목록 출력*/}
                    {basketList.length > 0 ? basketList.map((sub,index) => (
                        <tr key={sub.id}>
                            {/*삭제 버튼으로 취소 가능*/}
                            <td><button className={styles.button} onClick={()=>onRemove(sub.id)}>
                                삭제</button></td>
                            <td>{sub.campus}</td>
                            <td>{sub.code}</td>
                            <td className={styles.nameCell}>{sub.name}</td>
                            <td>{sub.credits}</td>
                            <td>{sub.professor}</td>
                            <td>{sub.language}</td>
                            <td className={styles.nameCell}>{sub.times}</td>
                            <td>{sub.wish}</td>
                            <td>{sub.limit}</td>
                            <td>{sub.remain}</td>
                            <td>{sub.cancel}</td>
                            <td>
                                {/*우선순위 변경 버튼*/}
                                <span className={styles.orderBtn} onClick={()=>onSwap(sub.id, basketList[index-1]?.id)}>
                                    {'\u25B2'}</span>
                                <span className={styles.orderBtn} onClick={()=>onSwap(sub.id, basketList[index+1]?.id)}>
                                    {'\u25BC'}</span>
                                <span className={styles.orderBtn} onClick={()=>onMove(sub.id, 'top')}>
                                    {'\u2912'}</span>
                                <span className={styles.orderBtn} onClick={()=>onMove(sub.id, 'bottom')}>
                                    {'\u2913'}</span>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={13}>
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