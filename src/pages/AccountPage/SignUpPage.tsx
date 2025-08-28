import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUpApi } from '../../apis/auth';
import type { SignUpRequest } from '../../types/auth';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    nickname: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: '',
    agreeTerms: false,
    agreePrivacy: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nickname.trim()) {
      newErrors.nickname = '닉네임을 입력해주세요';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }

    if (!formData.age.trim()) {
      newErrors.age = '나이를 입력해주세요';
    } else if (isNaN(Number(formData.age)) || Number(formData.age) < 1 || Number(formData.age) > 120) {
      newErrors.age = '올바른 나이를 입력해주세요 (1-120)';
    }

    if (!formData.gender) {
      newErrors.gender = '성별을 선택해주세요';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = '이용약관에 동의해주세요';
    }

    if (!formData.agreePrivacy) {
      newErrors.agreePrivacy = '개인정보 처리방침에 동의해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const signUpData: SignUpRequest = {
        password: formData.password,
        nickname: formData.nickname,
        age: Number(formData.age),
        gender: formData.gender as 'male' | 'female',
      };

      const response = await signUpApi(signUpData);
      console.log('회원가입 성공:', response);
      
      // 회원가입 성공 시 로그인 페이지로 이동
      navigate('/login');
    } catch (error) {
      console.error('회원가입 실패:', error);
      
      // 에러 메시지 설정
      if (error instanceof Error) {
        setErrors({ submit: error.message });
      } else {
        setErrors({ submit: '회원가입 중 오류가 발생했습니다.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-start justify-center px-4 py-6 sm:py-8">
      <div className="w-full max-w-sm sm:max-w-md space-y-6 sm:space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">회원가입</h2>
          <p className="text-sm sm:text-base text-gray-400">WalkingCity와 함께 산책을 시작하세요</p>
        </div>

        {/* Sign Up Form */}
        <div className="bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="nickname" className="block text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                닉네임
              </label>
              <input
                id="nickname"
                name="nickname"
                type="text"
                required
                value={formData.nickname}
                onChange={handleInputChange}
                className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base ${
                  errors.nickname ? 'border-red-400' : 'border-gray-600'
                }`}
                placeholder="닉네임을 입력하세요"
              />
              {errors.nickname && <p className="mt-1 text-xs sm:text-sm text-red-400">{errors.nickname}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base ${
                  errors.password ? 'border-red-400' : 'border-gray-600'
                }`}
                placeholder="비밀번호 (8자 이상)"
              />
              {errors.password && <p className="mt-1 text-xs sm:text-sm text-red-400">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                비밀번호 확인
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base ${
                  errors.confirmPassword ? 'border-red-400' : 'border-gray-600'
                }`}
                placeholder="비밀번호를 다시 입력하세요"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs sm:text-sm text-red-400">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Age */}
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                나이
              </label>
              <input
                id="age"
                name="age"
                type="number"
                min="1"
                max="120"
                required
                value={formData.age}
                onChange={handleInputChange}
                className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base ${
                  errors.age ? 'border-red-400' : 'border-gray-600'
                }`}
                placeholder="나이를 입력하세요"
              />
              {errors.age && <p className="mt-1 text-xs sm:text-sm text-red-400">{errors.age}</p>}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 sm:mb-3">성별</label>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, gender: 'male' }))}
                  className={`relative p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-200 text-center ${
                    formData.gender === 'male'
                      ? 'border-green-500 bg-green-500/10 text-green-400'
                      : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500 hover:bg-gray-700'
                  }`}>
                  <div className="flex flex-col items-center space-y-1.5 sm:space-y-2">
                    <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-500/20">
                      <svg className="w-4 h-4 sm:w-6 sm:h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2a5 5 0 0 0-5 5v2H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V10a1 1 0 0 0-1-1h-2V7a5 5 0 0 0-5-5zM9 7a3 3 0 0 1 6 0v2H9V7z" />
                      </svg>
                    </div>
                    <span className="font-medium text-xs sm:text-sm">남성</span>
                    {formData.gender === 'male' && (
                      <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, gender: 'female' }))}
                  className={`relative p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-200 text-center ${
                    formData.gender === 'female'
                      ? 'border-green-500 bg-green-500/10 text-green-400'
                      : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500 hover:bg-gray-700'
                  }`}>
                  <div className="flex flex-col items-center space-y-1.5 sm:space-y-2">
                    <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-pink-500/20">
                      <svg className="w-4 h-4 sm:w-6 sm:h-6 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 3.5C14.8 3.4 14.6 3.3 14.4 3.3H9.6C9.4 3.3 9.2 3.4 9 3.5L3 7V9H21ZM12 8C13.7 8 15 9.3 15 11V22H9V11C9 9.3 10.3 8 12 8Z" />
                      </svg>
                    </div>
                    <span className="font-medium text-xs sm:text-sm">여성</span>
                    {formData.gender === 'female' && (
                      <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              </div>
              {errors.gender && <p className="mt-2 text-xs sm:text-sm text-red-400">{errors.gender}</p>}
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-start">
                <input
                  id="agreeTerms"
                  name="agreeTerms"
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  className="mt-0.5 h-4 w-4 text-green-500 focus:ring-green-500 border-gray-600 rounded bg-gray-700"
                />
                <label htmlFor="agreeTerms" className="ml-2.5 text-xs sm:text-sm text-gray-300">
                  <span className="text-green-400">(필수)</span> 이용약관에 동의합니다
                </label>
              </div>
              {errors.agreeTerms && <p className="text-xs sm:text-sm text-red-400 ml-7">{errors.agreeTerms}</p>}

              <div className="flex items-start">
                <input
                  id="agreePrivacy"
                  name="agreePrivacy"
                  type="checkbox"
                  checked={formData.agreePrivacy}
                  onChange={handleInputChange}
                  className="mt-0.5 h-4 w-4 text-green-500 focus:ring-green-500 border-gray-600 rounded bg-gray-700"
                />
                <label htmlFor="agreePrivacy" className="ml-2.5 text-xs sm:text-sm text-gray-300">
                  <span className="text-green-400">(필수)</span> 개인정보 처리방침에 동의합니다
                </label>
              </div>
              {errors.agreePrivacy && <p className="text-xs sm:text-sm text-red-400 ml-7">{errors.agreePrivacy}</p>}
            </div>

            {/* Submit Error Message */}
            {errors.submit && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-red-400 text-center">{errors.submit}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-500 text-white py-2.5 sm:py-3 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-sm sm:text-base">
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  가입 중...
                </div>
              ) : (
                '회원가입'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-xs sm:text-sm text-gray-400">
              이미 계정이 있으신가요?{' '}
              <button
                onClick={() => navigate('/login')}
                className="font-medium text-green-400 hover:text-green-300 transition-colors duration-200">
                로그인
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
