import { useState } from "react"
import styles from "./Bsearch.module.css"

// 강의 검색 기능 (옵션 선택후 검색, 추가 버튼으로 강의 담기)
export default function Bsearch({data,onAdd}){

    // 데이터 읽고 초기값 세팅
    const [filtered, setFiltered] = useState([])
    const [searchType, setSearchType] = useState("전공")
    const [searchParams, setSearchParams] = useState({
        campus: '',
        major: '',
        category: '',
        courseName: '',
        day: '',
        grade: ''
    })

    // 선택한 옵션 필터에 반영
    const handleChange = (e) => {
        const {name,value} = e.target
        setSearchParams(prev => ({...prev, [name]:value}))
    }

    // 선택한 옵션 기반으로 검색 로직
    const onSearch = () => {
        const filterResult = data.filter(sub => {
            const matchType = !searchType || sub.courseType === searchType
            const matchCampus = searchParams.campus === "" || sub.campus === searchParams.campus
            
            let matchDetail = true
            if(searchType === '교양'){
                matchDetail = searchParams.category === "" || sub.category === searchParams.category
            } else {
                matchDetail = searchParams.major === "" || sub.major.includes(searchParams.major)
            }
            const matchCourseName = searchParams.courseName === "" || sub.courseName.includes(searchParams.courseName)
            const matchDay = searchParams.day === "" || sub.dayOfWeek === searchParams.day
            const matchGrade = searchParams.grade === "" || String(sub.grade) === searchParams.grade

            return matchType && matchCampus && matchDetail && matchCourseName && matchDay && matchGrade
        })

        setFiltered(filterResult)
    }

    // 교양, 전공, 학문기초 선택 시 옵션 다르게
    const handleType = (type) => {
        setSearchType(type)
        setSearchParams({
            campus: '',
            major: '',
            category: '',
            courseName: '',
            day: '',
            grade: ''
        })
        setFiltered([])
    }

    console.log(data)
    return(
        <>
            <div className={styles.header}>
                <div className={styles.bar}></div>
                <div>개설강좌검색</div>
            </div>

            <div className={styles.container}>
                {/*교양,전공,학문기초 선택*/}
                <div className={styles.radio}>
                    <span className={styles.label}>검색 구분</span>
                    <label>
                        <input type="radio" name="type" checked={searchType === '교양'}
                            onChange={() => handleType('교양')}/> 교양 검색
                    </label>
                    <label>
                        <input type="radio" name="type" checked={searchType === '전공'}
                            onChange={() => handleType('전공')}/> 전공 검색
                    </label>
                    <label>
                        <input type="radio" name="type" checked={searchType === '학문기초'}
                            onChange={() => handleType('학문기초')}/> 학문기초 검색
                    </label>
                </div>

                {/*사용자가 선택하는 옵션값 반영*/}
                <div className={styles.filter}>
                    <select className={styles.selectSmall} name="campus" onChange={handleChange} value={searchParams.campus}>
                        <option value="">캠퍼스</option>
                        <option value="죽전">죽전</option>
                        <option value="천안">천안</option>
                    </select>

                    {searchType === '교양' && (
                        <select className={styles.selectMedium} name="category" onChange={handleChange} value={searchParams.category}>
                            <option value="">영역</option>
                            <option value="필수교양">필수교양</option>
                            <option value="선택교양">선택교양</option>
                        </select>
                    )}

                    {(searchType === '전공' || searchType === '학문기초') && (
                        <select className={styles.selectMedium} name="major" onChange={handleChange} value={searchParams.major}>
                            <option value="">전공명</option>
                            <option value="SW융합 소프트웨어학과">SW융합 소프트웨어학과</option>
                            <option value="SW융합 컴퓨터공학과">SW융합 컴퓨터공학과</option>
                            <option value="SW융합 통계데이터사이언스학과">SW융합 통계데이터사이언스학과</option>
                        </select>
                    )}

                    <input type="text" name="courseName" placeholder="교과목명" value={searchParams.courseName} 
                        className={styles.inputLarge} onChange={handleChange}/>

                    <select className={styles.selectSmall} name="day" onChange={handleChange} value={searchParams.day}>
                        <option value="">요일</option>
                        <option value="일">일요일</option>
                        <option value="월">월요일</option>
                        <option value="화">화요일</option>
                        <option value="수">수요일</option>
                        <option value="목">목요일</option>
                        <option value="금">금요일</option>
                        <option value="토">토요일</option>
                    </select>

                    {(searchType === '전공' || searchType === '학문기초') && (
                        <select className={styles.selectSmall} name="grade" onChange={handleChange} value={searchParams.grade}>
                            <option value="">학년</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                        </select>
                    )}

                    {/*검색 버튼*/}
                    <button className={styles.searchBtn} onClick={onSearch}>SEARCH</button>
                </div>
            </div>

            <p className={styles.result}>
                검색결과는 [ <span style={{color:"red"}}>{filtered.length}건</span> ] 입니다.
            </p>
            
            {/*검색 결과 출력*/}
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th style={{width:"5%"}}>추가</th>
                        {searchType != '교양' && <th style={{width:"5%"}}>학년</th>}
                        <th style={{width:"8%"}}>이수구분</th>
                        <th style={{width:"10%"}}>교과목번호</th>
                        <th style={{width:"5%"}}>분반</th>
                        <th style={{width:"20%"}}>교과목명</th>
                        <th style={{width:"3%"}}>학점</th>
                        <th style={{width:"25%"}}>요일/교시</th>
                        <th style={{width:"5%"}}>잔여석</th>
                        <th style={{width:"14%"}}>수강조직</th>
                    </tr>
                </thead>
                <tbody>
                    {/*필터링된 데이터만 화면에 띄워주는 역할*/}
                    {filtered.length > 0 ? (
                        filtered.map(sub => (
                            <tr key={sub.courseId}>
                                <td><button className={styles.button} onClick={()=>onAdd(sub.courseId)}>
                                    추가</button></td>
                                {searchType != '교양' && <td>{sub.grade}</td>}
                                <td>{sub.category}</td>
                                <td>{sub.courseCode}</td>
                                <td>{sub.classNo}</td>
                                <td className={styles.nameCell}>{sub.courseName}</td>
                                <td>{sub.credit}</td>
                                <td className={styles.nameCell}>{sub.dayOfWeek}{sub.startTime} ~ {sub.endTime}</td>
                                <td>{sub.remain}</td>
                                <td>{sub.major}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={10}>
                                조회된 데이터가 없습니다.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    )
}