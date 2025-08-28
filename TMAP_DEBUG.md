# T-map API 문제 해결 가이드

## 현재 상황
- T-map 스크립트는 로드되지만 `window.Tmapv2`에 `Map`, `LatLng` 등의 핵심 클래스가 없음
- 오직 `_getScriptLocation`과 `VERSION_NUMBER`만 존재

## 가능한 원인들

### 1. API 키 문제
- API 키가 잘못되었거나 만료됨
- 도메인 제한 설정 (localhost 허용 안 함)
- API 사용량 제한 초과

### 2. T-map API 버전 문제
- v2 API URL이 변경되었을 수 있음
- 새로운 인증 방식 필요

### 3. 스크립트 로딩 타이밍 문제
- API 초기화 시간 부족
- 네트워크 지연

## 해결 방법

### 1. HTML 테스트 파일 확인
`http://localhost:5173/tmap-test.html` 접속하여 순수 HTML 환경에서 테스트

### 2. API 키 재확인
- T-map 개발자 콘솔에서 API 키 상태 확인
- 새 API 키 발급 고려

### 3. 대안 API 고려
- Kakao Map API
- Naver Map API
- Google Maps API

### 4. 네트워크 디버깅
브라우저 개발자 도구에서:
- Network 탭에서 T-map 스크립트 요청 상태 확인
- Console에서 오류 메시지 확인
- Application 탭에서 쿠키/스토리지 확인

## 다음 단계
1. HTML 테스트 파일 결과 확인
2. API 키 상태 점검
3. 필요시 대안 지도 API로 전환
