<img src="https://capsule-render.vercel.app/api?type=waving&height=250&color=0:ff7eb3,100:87CEEB&text=대여%20돼요&fontSize=60&fontAlignY=30&animation=fadeIn&rotate=0&desc=딥러닝%20기반%20중고%20렌트%20거래%20플랫폼&descSize=30&reversal=false&fontColor=ffffff" style="width: 120%;">

# 🚀 프로젝트 소개 🚀  


## 프로젝트 개요 및 배경
비대면 쇼핑과 중고 물품 구매·대여 수요가 증가하면서 중고 시장이 빠르게 성장하고 있다. 지속 가능한 소비와 경제적 이유로 중고 거래 선호도가 높아졌고, AI 기술의 발전으로 개인 맞춤형 서비스의 중요성이 커졌다. 
이에, AI 이미지 기능을 포함하고, 추가로 중고 거래 사이트를 사용해보며 필요성을 느낀 숏폼 동영상, 중간 거리 찾기 등의 기능을 통합하여 사용자에게 편리하고 직관적인 물건 대여가 가능한 플랫폼을 만들고자 한다.

<br>

## 팀원 소개
<table align="center">
 <tr>
    <td align="center"><a href="https://github.com/dyun23"><img src="https://github.com/user-attachments/assets/db7dcd49-7090-4708-ae09-c2f9686f45ff" width="150px;" alt=""></td>
    <td align="center"><a href="https://github.com/sue06004"><img src="https://github.com/user-attachments/assets/2377ed7f-4031-4af6-a79f-e655d66d0c39" width="150px;" alt=""></td>
<tr>
    <td align="center">🔥<a href="https://github.com/jin2304"><b>이기호</b></td>
    <td align="center">🌳<a href="https://github.com/soohoon0821"><b>박정훈</b></td>
  </tr>
   <tr>
    <td align="center"><b></b></td>
    <td align="center"><b></b></td>
  </tr>
  </table>
            
# 🛠 프로젝트 설계 🏗  
## 기술 스택

### ✔ Frond-end
<div>
<img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=black"/>
<img src="https://img.shields.io/badge/Javascript-F7DF1E?style=for-the-badge&logo=Javascript&logoColor=black"/>
<img src="https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=Sass&logoColor=white"/>
</div>

### ✔ Back-end
<div>
<img src="https://img.shields.io/badge/Spring Boot-6DB33F?style=for-the-badge&logo=SpringBoot&logoColor=white"/>
<img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=MySQL&logoColor=white"/>
<img src="https://img.shields.io/badge/GitHub Actions-2088FF?style=for-the-badge&logo=GitHub Actions&logoColor=white"/>
</div>

### ✔ Dev tools
<div>
<img src="https://img.shields.io/badge/Visual Studio Code-007ACC?style=for-the-badge&logo=Visual Studio Code&logoColor=white">
<img src="https://img.shields.io/badge/IntelliJ IDEA-000000?style=for-the-badge&logo=IntelliJ IDEA&logoColor=white"/>
<img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=Git&logoColor=white"/>
<img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=GitHub&logoColor=white"/>
</div>

<br>

이유 있어야될듯..?
<br>

## 🏗 시스템 아키텍처 🏛  
<div align="center">
  <img src="https://github.com/user-attachments/assets/846cd11c-26dd-42a6-a8ce-005444b83872" width="70%" height="400" />
</div>

<br>

## 🏗 시스템 구조도 🏛  
<img src="https://github.com/user-attachments/assets/d9815f6f-73da-4d81-92c7-9c3fa3df45c2" width="100%" height="400" />

## 🛠 **ERD** 🗂  
<div align="center">
 <img src="https://github.com/user-attachments/assets/2481aa28-1eba-4ad1-9da9-a6bf8f0f5d0c" width="30%" height="300" />
</div>

수정해야될듯?아닌가

# 🛠 프로젝트 내용 및 기능 🏗  
<br>

## 주요 내용  

### 1. 로그인 및 회원가입

이메일 & 비밀번호 기반 로그인 
아이디 찾기: 이메일 인증 후 아이디 제공
비밀번호 찾기: 이메일 인증 후 임시 비밀번호 발급
회원가입: 3단계 진행 (정보 입력 → 이메일 인증 → 프로필 설정)
아이디/닉네임 중복 검사
비밀번호 정규식 검사 (영문+숫자+특수문자 8자 이상)
주소 검색 API 활용
프로필 사진 업로드

### 2. 검색 기능
키워드 검색: 제목, 설명, 카테고리 기반 필터링
이미지 검색:
이미지 업로드 시 배경 제거 및 YOLOv8 기반 카테고리/이름 분류
FastAPI 서버를 활용하여 처리

### 3. 상품 등록
필수 입력 정보: 제목, 상품명, 이미지, 카테고리, 대여 가격, 대여 가능 기간, 설명
자동 분류: YOLOv8을 이용하여 이미지 분석 후 상품명 & 카테고리 자동 입력
유사 상품 가격 비교: 같은 카테고리 내 가격 분포 그래프 제공

### 4. 거래 및 대여 시스템
상세 페이지: 상품 정보, 이미지, 동영상 확인
채팅 기능: 실시간 메시지 & 중간 거래 장소 추천 기능
대여 신청 프로세스:
신청 후 대여자가 "빌려주기" 승인 시 대여 확정
거래 종료 후 반납 확인 버튼 클릭 시 종료

### 5. 숏폼 페이지
상품 홍보 영상 업로드 가능
랜덤 재생 및 자동 소리 ON/OFF 기능 제공

### 6. 중간거리 찾기
판매자 & 대여자의 주소 입력 시 자동 중간 지점 계산 후 추천

### 7. 마이페이지 및 리뷰 시스템
내 정보 변경 (비밀번호, 주소, 닉네임, 프로필 사진 변경 가능)
거래 내역 조회 및 리뷰 작성-별점 평가


## 주요 기능 영상
1. 회원가입
2. 상품등록
3. 쇼츠 영상
4. 채팅 및 중간거리
5. 리뷰와 내정보
6. 이미지로 검색ㅎ

<br>

| **회원가입** | **상품 등록** | **쇼츠영상** |
| :---: | :---: | :---: |
| <img src="https://github.com/user-attachments/assets/5e7fef3c-56ba-4b75-b49e-0a0b1e03086e" width="450" height="300" /> | <img src="https://github.com/user-attachments/assets/2dd72771-4847-4ecb-9fe5-5640a85d5179" width="450" height="300" /> | <img src="https://github.com/user-attachments/assets/eab5ecae-fb55-4a0b-9d3b-57b87073d6cb" width="450" height="300" /> |
| **채팅 및 중간거리** | **리뷰와 내정보** | **이미지로 검색** |
| <img src="https://github.com/user-attachments/assets/1fcdf8f0-ccaa-49d9-940f-f136eefcb73c" width="450" height="300" /> | <img src="https://github.com/user-attachments/assets/36ee009b-ffe9-48d6-acc4-bd9657b6755f" width="450" height="300" /> | <img src="https://github.com/user-attachments/assets/cd5c4ff0-9b91-459e-b095-4b8ec19959c0" width="450" height="300" /> |

<br><br>
인공지능
<br><br>

# 🛠 결론 🏗

## 트러블 슈팅
<br><br>
## 프로젝트 하면서 느낀점 아쉬운점
<br><br>

## 결론

본 프로젝트에서는 기존의 B2C 렌트와 중고 물품 판매를 결합한 중고 물품 대여 플랫폼인 ‘대여돼요’를 개발했다. 본 플랫폼은 기존 렌트 서비스와 차별된 C2C 기반의 대여 서비스를 제공하여 사용자 간의 자원 공유와 활용성을 극대화하는 것을 목표로 정했다. 이를 통해 기존 플랫폼이 가지는 한계를 극복하고 사용자 중심의 대여 서비스를 개발했다.

해당 서비스는 딥러닝 모델인 YOLOv8과 ResNet50을 활용하여 다양한 사용자 편의 기능을 구현했다. 사용자가 빌려주고 싶은 상품을 등록할 때 YOLOv8을 통해 자동으로 카테고리와 이름을 분류함으로써 상품 등록 과정의 편의성을 높였고 상품 등록 시 유사한 상품들의 가격 정보를 차트로 제공함으로써 합리적인 가격 설정을 할 수 있도록 서비스를 제공했다. 또한, ResNet50을 이용하여 사용자가 원하는 상품의 이미지를 입력하면 가장 유사한 상품을 검색할 수 있는 기능을 제공하여 사용자 경험을 향상시켰다. 이와 더불어, 숏폼 콘텐츠를 활용한 상품 홍보와 설명 기능은 사용자들에게 더 흥미롭고 직관적인 정보를 제공하여 플랫폼의 활용도를 높이는데 기여하고 있다.

‘대여돼요’ 서비스는 사용자간 신뢰를 바탕으로 한 C2C 렌트 서비스를 통해 자원의 재사용과 공유 경제를 실현할 수 있는 플랫폼으로 자리 잡을 것으로 기대된다. 
향후 연구에서는 데이터 기반 서비스를 더욱 향상시키고, 클라우드 기반 인프라를 구축함으로써 서비스의 안정성과 확장성을 강화할 계획인다. 이를 통해 본 플랫폼이 사용자에게 더욱 신뢰할 수 있고 편리한 서비스를 제공하며, 지속 가능한 중고 렌트 플랫폼으로 성장할 수 있을 것으로 기대된다.




