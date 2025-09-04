# WalkingCity Frontend - Vercel 서버리스 함수 사용

이 프로젝트는 Vercel 서버리스 함수를 통해 백엔드 API (`http://52.3.42.186`)와 통신합니다.

## 📁 구조

```
api/
  proxy.ts          # Vercel 서버리스 함수 (백엔드 프록시)
src/
  apis/
    axios.ts        # Axios 설정 (서버리스 함수 사용)
    ...
```

## 🔧 작동 방식

1. **클라이언트**: `/walk/weather` API 호출
2. **axios 인터셉터**: URL을 `/api/proxy?path=/walk/weather`로 변환
3. **Vercel 서버리스 함수**: `http://52.3.42.186/walk/weather`로 프록시
4. **백엔드 응답**: 서버리스 함수를 통해 클라이언트로 전달

## ✅ 해결된 문제들

- ✅ CORS 이슈 완전 해결
- ✅ 인증 헤더 전달 (JSESSIONID, X-Session-ID)
- ✅ 모든 HTTP 메서드 지원 (GET, POST, PUT, DELETE)
- ✅ 에러 처리 및 로깅
- ✅ 30초 타임아웃 설정

## 🚀 배포

```bash
# 의존성 설치
pnpm install

# 빌드
npm run build

# Vercel 배포
vercel deploy
```

## 🔍 디버깅

서버리스 함수 로그는 Vercel 대시보드의 Functions 탭에서 확인할 수 있습니다.

## 📝 API 사용법

```typescript
// 기존과 동일하게 사용
const response = await axiosInstance.get('/walk/weather');
const data = await axiosInstance.post('/walk/ai/request', requestData);
```

내부적으로 자동으로 서버리스 함수를 통해 프록시됩니다.
