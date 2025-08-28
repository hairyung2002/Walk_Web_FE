// 로그인 요청 타입
export interface LoginRequest {
  nickname: string;
  password: string;
}

// 로그인 응답 타입 (API 명세서 기준)
export interface LoginResponse {
  id: number;
  nickname: string;
  age: number;
  gender: 'male' | 'female';
}

// 회원가입 요청 타입
export interface SignUpRequest {
  password: string;
  nickname: string;
  age: number;
  gender: 'male' | 'female';
}

// 회원가입 응답 타입 (API 명세서 기준)
export interface SignUpResponse {
  id: number;
  nickname: string;
  age: number;
  gender: 'male' | 'female';
}

// 사용자 정보 타입
export interface User {
  id: number;
  nickname: string;
  age: number;
  gender: 'male' | 'female';
}

// API 에러 타입
export interface ApiError {
  message: string;
  status: number;
}

// 기존 타입들 (호환성을 위해 유지)
export interface LegacyUser {
  user_id: number;
  nickname: string;
  age: number;
  gender: 'MALE' | 'FEMALE';
  social_type: 'GOOGLE' | 'NAVER' | 'KAKAO';
}

export interface loginResponseData {
  access_token: string;
  refresh_token: string;
  user: LegacyUser;
}

export interface loginResponse {
  message: string;
  data: loginResponseData;
  statusCode: number;
}
