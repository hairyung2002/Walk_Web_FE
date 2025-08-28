import { axiosInstance } from './axios';
import type { LoginRequest, LoginResponse, SignUpRequest, SignUpResponse } from '../types/auth';

export const loginApi = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await axiosInstance.post<LoginResponse>('/walk/users/login', data);
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
