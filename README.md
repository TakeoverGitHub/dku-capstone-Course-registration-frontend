
---

# 🎓 단국대학교 수강신청 시스템 & 도우미 (Cross-App Auth)

본 프로젝트는 **수강신청 시스템(Sugang-App)**과 **수강계획 도우미(Basket-App)** 두 개의 독립된 React 애플리케이션으로 구성되어 있습니다. 두 앱 사이의 **자동 로그인** 및 **통합 로그아웃** 기능을 구현한 것이 핵심입니다.

## 📁 프로젝트 구조 (주요 구성요소)
- **sugang-app (Port: 3000)**
  ```text
  ├── app.jsx       # 메인 엔트리 파일 (컴포넌트 호출)
  ├── main.jsx      # app.jsx 기반 화면 그리기
  ├── component       # 화면에 그릴 구성요소들
  │   ├── Header.jsx        # 상단에 그릴 헤더
  │   ├── ProtectRoutes.jsx # 로그인한 경우에만 접속 가능하게
  │   ├── Sidebar.jsx       # 좌측 위치 사이드바
  │   ├── Sugang.jsx        # 장바구니로 담아둔 강의 테이블
  │   ├── SugangStatus.jsx  # 수강신청내역 테이블
  │   ├── Summary.jsx       # 하단 요약 테이블
  │   ├── Timetable.jsx     # 우측 시간표
  │   ├── UserInfo.jsx      # 상단 사용자 정보 테이블
  │   └── WaitingList.jsx   # 대기열신청내역 테이블
  └── page          # 각 페이지 구현
      ├── LoginPage.jsx     # 로그인 페이지
      └── TimetablePage.jsx # 시간표 페이지
- **basket-app (Port: 3001)**
  ```text
  ├── app.jsx       # 메인 엔트리 파일 (컴포넌트 호출)
  ├── main.jsx      # app.jsx 기반 화면 그리기
  └── component       # 화면에 그릴 구성요소들
      ├── Bheader.jsx   # 상단에 그릴 헤더
      ├── Bsearch.jsx   # 강의 검색
      ├── Bsummary.jsx  # 담은 강의 요약 테이블
      └── Btable.jsx    # 담은 강의 목록 테이블
---

## 🚀 실행 방법 (Setup)

테스트를 위해 두 개의 앱을 각각 다른 포트에서 실행해야 합니다. (터미널 2개로 각각 실행)

### 1. 의존성 설치
각 폴더로 이동하여 패키지를 설치합니다.
```bash
# sugang-app 폴더에서
npm install

# basket-app 폴더에서
npm install
```

### 2. 애플리케이션 실행
반드시 지정된 포트 번호로 실행해야 리다이렉션 로직이 정상 작동합니다.

* **Sugang-App (터미널 1에서 sugang-app 폴더로 이동 후)**
    ```bash
    npm start
    ```
* **Basket-App (터미널 2에서 basket-app 폴더로 이동 후)**
    ```bash
    npm start
    ```
---

### 3. 테스트 진행
sugang-app, basket-app을 npm start로 실행하면 각각 localhost:3000, localhost:3001로 접속 가능합니다.  
둘 다 실행만 시켜둔 상태에서 3000이나 30001 포트로 접속하면 아직 로그인되지 않아 로그인 페이지로 이동됩니다.(3000/login)  
현재는 테스트용으로 학번에 12345678 비밀번호에 1234 입력하여 로그인합니다  
로그인 후 3000,3001 포트로 접속이 가능하며 기본값으로 3000포트로 바로 접속됩니다. (수강신청 페이지)  
해당 페이지에서 수강신청 시스템 테스트가 가능하며 좌측 사이드바에서 "수강계획도우미 등록 (학부)" 메뉴를 클릭하여 3001포트로 이동 가능합니다 (장바구니 페이지)  
해당 페이지에서 장비구니 시스템 테스트가 가능하며 각 페이지 우측 상단에 로그아웃 버튼을 통해 로그아웃 가능합니다 (모든 페이지 로그아웃)  
각 페이지들은 로그인한 상태에서만 접근 가능하기에 로그인 페이지로 되돌아옵니다.  