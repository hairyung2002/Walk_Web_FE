import { axiosInstance } from './axios';
import type { LoginRequest, LoginResponse, SignUpRequest, SignUpResponse } from '../types/auth';

export const loginApi = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    // 기존 우리 서버의 JSESSIONID 쿠키만 정리 (SK 지도 API 쿠키는 보존)
    const clearOldCookies = () => {
      // 현재 서버 도메인의 JSESSIONID만 제거
      const serverUrl = import.meta.env.VITE_SERVER_API_URL;
      const serverDomain = new URL(serverUrl).hostname;
      
      if (serverDomain === 'localhost' || serverDomain === '127.0.0.1') {
        document.cookie = 'JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost';
        document.cookie = 'JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      } else {
        // 실제 서버 도메인의 JSESSIONID만 제거
        document.cookie = `JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${serverDomain}`;
      }
      
      // SK 지도 API 쿠키는 보존
      console.log('🧹 우리 서버의 기존 JSESSIONID 쿠키만 정리 (SK 지도 API 쿠키는 보존)');
    };
    
    clearOldCookies();
    
    const response = await axiosInstance.post<LoginResponse>('/walk/users/login', data);
    
    console.log('🔍 로그인 응답 전체:', {
      status: response.status,
      headers: response.headers,
      data: response.data,
      cookies: document.cookie,
      setCookieHeader: response.headers['set-cookie'],
    });
    
    // Set-Cookie 헤더에서 JSESSIONID 추출 및 수동 설정
    const setCookieHeader = response.headers['set-cookie'];
    if (setCookieHeader && Array.isArray(setCookieHeader)) {
      const jsessionCookie = setCookieHeader.find((cookie) => cookie.includes('JSESSIONID='));
      if (jsessionCookie) {
        console.log('🍪 Set-Cookie 헤더에서 JSESSIONID 발견:', jsessionCookie);
        
        // JSESSIONID 값 추출
        const jsessionMatch = jsessionCookie.match(/JSESSIONID=([^;]+)/);
        if (jsessionMatch) {
          const jsessionId = jsessionMatch[1];
          
          // 현재 서버 URL 확인
          const serverUrl = import.meta.env.VITE_SERVER_API_URL;
          const serverDomain = new URL(serverUrl).hostname;
          
          console.log('🔍 서버 정보:', { serverUrl, serverDomain });
          
          // 올바른 도메인으로만 쿠키 설정
          if (serverDomain === 'localhost' || serverDomain === '127.0.0.1') {
            // 로컬 개발 환경
            document.cookie = `JSESSIONID=${jsessionId}; Path=/; SameSite=Lax`;
          } else {
            // 실제 서버 (Cross-Origin)
            document.cookie = `JSESSIONID=${jsessionId}; Path=/; SameSite=None; Secure=true`;
          }
          
          localStorage.setItem('sessionId', jsessionId); // 백업용
          console.log('✅ JSESSIONID 쿠키 올바르게 설정:', jsessionId, 'for domain:', serverDomain);
        }
      }
    }
    
    // 쿠키 기반 인증을 사용하므로 JSESSIONID 쿠키 확인
    const jsessionIdCookie = document.cookie.split(';').find((cookie) => cookie.trim().startsWith('JSESSIONID='));
    
    if (jsessionIdCookie) {
      const jsessionId = jsessionIdCookie.split('=')[1];
      console.log('🍪 JSESSIONID 쿠키 최종 확인:', jsessionId);
    } else {
      console.warn('⚠️ JSESSIONID 쿠키가 여전히 설정되지 않았습니다!');
      
      // 대안: 응답 데이터에 세션 ID가 있는지 확인
      if (response.data && typeof response.data === 'object' && 'sessionId' in response.data) {
        const sessionId = (response.data as { sessionId: string }).sessionId;
        const serverUrl = import.meta.env.VITE_SERVER_API_URL;
        const serverDomain = new URL(serverUrl).hostname;
        
        if (serverDomain === 'localhost' || serverDomain === '127.0.0.1') {
          document.cookie = `JSESSIONID=${sessionId}; Path=/; SameSite=Lax`;
        } else {
          document.cookie = `JSESSIONID=${sessionId}; Path=/; SameSite=None; Secure=true`;
        }
        
        localStorage.setItem('sessionId', sessionId); // 백업용
        console.log('🔄 응답 데이터에서 세션 ID를 쿠키로 설정:', sessionId);
      }
    }
    
    return response.data;
  } catch (error: unknown) {
    // API 에러 처리
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number; data?: string } };
      const status = axiosError.response?.status;
      const errorData = axiosError.response?.data;
      
      if (status === 400) {
        const errorMessage = errorData || '로그인 정보가 올바르지 않습니다.';
        throw new Error(errorMessage);
      }
      
      if (status === 401) {
        const errorMessage = errorData || '닉네임 또는 비밀번호가 일치하지 않습니다.';
        throw new Error(errorMessage);
      }
      
      if (status === 404) {
        throw new Error('존재하지 않는 사용자입니다.');
      }
      
      if (status && status >= 500) {
        console.error('Server Error Details:', errorData);
        // 서버 에러의 경우 기술적 세부사항 대신 사용자 친화적 메시지
        throw new Error('서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    }
    
    // 네트워크 에러 등 기타 에러
    throw new Error('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.');
  }
};

export const signUpApi = async (data: SignUpRequest): Promise<SignUpResponse> => {
  try {
    const response = await axiosInstance.post<SignUpResponse>('/walk/users/signup', data);
    return response.data;
  } catch (error: unknown) {
    // API 에러 처리
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number; data?: string } };
      const status = axiosError.response?.status;
      const errorData = axiosError.response?.data;
      
      if (status === 400) {
        const errorMessage = errorData || '닉네임이 이미 사용 중입니다.';
        throw new Error(errorMessage);
      }
      
      if (status && status >= 500) {
        console.error('Server Error Details:', errorData);
        // 서버 에러의 경우 기술적 세부사항 대신 사용자 친화적 메시지
        throw new Error('서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    }
    
    // 네트워크 에러 등 기타 에러
    throw new Error('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.');
  }
};
