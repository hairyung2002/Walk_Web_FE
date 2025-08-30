import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL, // 직접 백엔드 서버로 요청
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  timeout: 30000, // 30초 타임아웃으로 증가
  withCredentials: false, // CORS 이슈 해결을 위해 임시로 false 설정
  // CORS 관련 설정
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
});

// 요청 인터셉터 (디버깅용 + 인증 헤더 추가)
axiosInstance.interceptors.request.use(
  (config) => {
    // 쿠키 확인
    const cookies = document.cookie;
    const jsessionId = cookies.split(';').find((cookie) => cookie.trim().startsWith('JSESSIONID='));
    
    console.log('🔍 Session Debug Info:', {
      requestUrl: config.url,
      allCookies: cookies,
      jsessionId: jsessionId,
      withCredentials: config.withCredentials,
    });

    // JSESSIONID 쿠키가 있는지 확인
    if (jsessionId) {
      console.log('✅ JSESSIONID 쿠키 발견:', jsessionId);
      
      // 브라우저가 Cookie 헤더 설정을 차단하므로 제거
      // config.headers['Cookie'] = jsessionId; // 제거됨
      
      // 백업으로 다른 헤더에 추가 (일부 서버는 헤더를 선호할 수 있음)
      const sessionIdValue = jsessionId.split('=')[1];
      config.headers['X-Session-ID'] = sessionIdValue;
      config.headers['JSESSIONID'] = sessionIdValue;
    } else {
      console.warn('⚠️ JSESSIONID 쿠키가 없습니다!');
      
      // localStorage에 백업 세션 ID가 있는지 확인
      const backupSessionId = localStorage.getItem('sessionId') || localStorage.getItem('walking_city_session_id');
      if (backupSessionId) {
        console.log('🔄 백업 세션 ID 사용:', backupSessionId);
        config.headers['X-Session-ID'] = backupSessionId;
        config.headers['JSESSIONID'] = backupSessionId;
        config.headers['Authorization'] = `Session ${backupSessionId}`; // 추가 인증 방식
      }
    }

    // Authorization 토큰이 있다면 추가 (다른 API용)
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    console.log('🚀 API Request:', {
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers,
      withCredentials: config.withCredentials,
      actualCookies: document.cookie, // 실제 전송될 쿠키 확인
    });
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  },
);

// 응답 인터셉터 (디버깅용 + 에러 처리)
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      status: response.status,
      url: response.config?.url,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error('❌ API Error Details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message,
      headers: error.response?.headers,
    });

    // 403 Forbidden 에러 특별 처리
    if (error.response?.status === 403) {
      console.warn('🔒 403 Forbidden - 권한이 없거나 CORS 문제일 수 있습니다.');
      
      // 개발환경에서 CORS 문제 해결을 위한 대안 URL 시도 (선택사항)
      if (import.meta.env.DEV) {
        console.log('🔄 개발환경에서 대체 요청 시도 가능...');
      }
    }

    // 401 Unauthorized 에러 처리
    if (error.response?.status === 401) {
      console.warn('🔒 Unauthorized - 로그인이 필요합니다.');
      // 세션이 만료되었거나 유효하지 않은 경우 localStorage 정리
      localStorage.removeItem('walking_city_session_id');
      localStorage.removeItem('walking_city_user');
      localStorage.removeItem('walking_city_logged_in');
      
      // 로그인 페이지로 리다이렉트 (현재 페이지가 로그인 페이지가 아닌 경우에만)
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);
