// 로그인 상태 관리를 위한 유틸리티 함수들

export interface User {
  id: number;
  nickname: string;
  age: number;
  gender: string;
  wantEnv: string;
  isPet: boolean;
}

// localStorage 키
const USER_KEY = 'walking_city_user';
const IS_LOGGED_IN_KEY = 'walking_city_logged_in';

// 사용자 정보 저장
export const saveUser = (user: User): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(IS_LOGGED_IN_KEY, 'true');
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

// 로그아웃 (사용자 정보 삭제)
export const logout = (): void => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(IS_LOGGED_IN_KEY);
};

// 사용자 정보 업데이트
export const updateUser = (updates: Partial<User>): void => {
  const currentUser = getUser();
  if (currentUser) {
    const updatedUser = { ...currentUser, ...updates };
    saveUser(updatedUser);
  }
};
