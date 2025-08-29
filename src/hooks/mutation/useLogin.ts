import { useState } from 'react';
import { loginApi } from '../../apis/auth';
import { saveUser } from '../../utils/auth';
import type { LoginRequest, User } from '../../types/auth';

interface UseLoginReturn {
  login: (loginData: LoginRequest) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  user: User | null;
  isSuccess: boolean;
}

export const useLogin = (): UseLoginReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const login = async (loginData: LoginRequest): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const response = await loginApi(loginData);
      
      // LoginResponse를 User 타입으로 변환
      const user: User = {
        id: response.id,
        nickname: response.nickname,
        age: 0, // API에서 제공하지 않는 경우 기본값
        gender: 'male', // API에서 제공하지 않는 경우 기본값
      };
      
      // 로그인 성공 시 사용자 정보 저장
      setUser(user);
      setIsSuccess(true);
      
      // 로컬 스토리지에 사용자 정보 저장 (세션은 쿠키로 자동 관리)
      saveUser(user);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '로그인에 실패했습니다.';
      setError(errorMessage);
      setUser(null);
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading,
    error,
    user,
    isSuccess,
  };
};
