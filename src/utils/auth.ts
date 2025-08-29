// 로그인 상태 관리를 위한 유틸리티 함수들
import type { User } from '../types/auth';

// localStorage 키
const USER_KEY = 'walking_city_user';
const IS_LOGGED_IN_KEY = 'walking_city_logged_in';
const SESSION_ID_KEY = 'walking_city_session_id';

// 사용자 정보 저장
export const saveUser = (user: User): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(IS_LOGGED_IN_KEY, 'true');
};

// 세션 ID 저장
export const saveSessionId = (sessionId: string): void => {
  localStorage.setItem(SESSION_ID_KEY, sessionId);
};

// 세션 ID 가져오기
export const getSessionId = (): string | null => {
  return localStorage.getItem(SESSION_ID_KEY);
};

// 사용자 정보 가져오기
export const getUser = (): User | null => {
  try {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

// 로그인 상태 확인
export const isLoggedIn = (): boolean => {
  return localStorage.getItem(IS_LOGGED_IN_KEY) === 'true' && getUser() !== null;
};

// 로그아웃 (사용자 정보 및 세션 ID 삭제)
export const logout = (): void => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(IS_LOGGED_IN_KEY);
  localStorage.removeItem(SESSION_ID_KEY);
  
  // 우리 서버의 JSESSIONID 쿠키만 제거 (SK 지도 API 쿠키는 보존)
  document.cookie = 'JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost';
  // apis.openapi.sk.com의 JSESSIONID는 T-map API를 위해 보존
  
  console.log('🧹 로그아웃: 우리 서버 세션 정보만 제거 완료 (T-map 쿠키는 보존)');
};

// 사용자 정보 업데이트
export const updateUser = (updates: Partial<User>): void => {
  const currentUser = getUser();
  if (currentUser) {
    const updatedUser = { ...currentUser, ...updates };
    saveUser(updatedUser);
  }
};
