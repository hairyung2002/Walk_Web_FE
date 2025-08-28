import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import TabBar from '../../components/TabBar';
import { isLoggedIn } from '../../utils/auth';
import useGetWeather from '@/hooks/query/Mainpage/useGetWheatehr';

const MainPage = () => {
  const [location, setLocation] = useState('');
  const [walkTime, setWalkTime] = useState('30');
  const [walkPurpose, setWalkPurpose] = useState('');
  const [withPet, setWithPet] = useState(false);
  const navigate = useNavigate();

  const { data: weatherData } = useGetWeather();

  // 날씨 상태 (예시)
  const weatherInfo = {
    temp: weatherData?.temperature || 0,
    condition: weatherData?.precipitationType || 'unknown',
    pm: 'good',
    recommendation: '산책하기 좋은 날씨입니다!',
  };

  // 추천 경로 타입
  const walkPurposes = [
    { id: 'urban', label: '도심 산책', icon: '🏙️', desc: '음식점, 카페가 많은 활기찬 코스' },
    { id: 'peaceful', label: '조용한 산책', icon: '🌿', desc: '수목이 많고 한적한 힐링 코스' },
    { id: 'moving', label: '이동 겸 산책', icon: '🚶', desc: '목적지까지 효율적인 경로' },
    { id: 'scenic', label: '경치 좋은 길', icon: '📸', desc: '사진 찍기 좋은 명소 코스' },
  ];

  const timeOptions = [
    { value: '15', label: '15분' },
    { value: '30', label: '30분' },
    { value: '45', label: '45분' },
    { value: '60', label: '1시간' },
  ];

  const handleRouteRecommendation = () => {
    // 로그인 체크
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }

    if (!location || !walkPurpose) {
      alert('출발지와 산책 목적을 선택해주세요!');
      return;
    }
    navigate('/route-recommendation', {
      state: { location, walkTime, walkPurpose, withPet },
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 pb-16 sm:pb-20">
      <Navbar />

      <div className="max-w-sm sm:max-w-md mx-auto">
        {/* Hero Section with Weather */}
        <div className="px-4 pt-16 sm:pt-20 pb-4 sm:pb-6">
          <div className="text-center mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
              오늘은 어디로
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">산책</span>을
              떠날까요?
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm">AI가 분석한 당신만의 최적 경로를 추천해드려요</p>
          </div>

          {/* Weather Card */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm opacity-90">현재 날씨</p>
                <p className="text-xl sm:text-2xl font-bold">{weatherInfo.temp}°C</p>
                <p className="text-xs sm:text-sm opacity-90">{weatherInfo.recommendation}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl sm:text-3xl mb-1">☀️</div>
                <p className="text-xs opacity-90">미세먼지: 좋음</p>
              </div>
            </div>
          </div>

          {/* Location Input */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-white font-medium mb-2 text-sm sm:text-base">📍 출발지를 입력하세요</label>
            <div className="relative">
              <input
                type="text"
                placeholder="현재 위치 또는 출발지를 입력하세요"
                className="w-full px-3 py-3 sm:px-4 sm:py-4 bg-gray-800 border border-gray-700 rounded-xl sm:rounded-2xl text-white placeholder-gray-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none transition-all text-sm sm:text-base"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <button className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-1.5 sm:p-2 rounded-lg sm:rounded-xl">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Walk Time Selection */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-white font-medium mb-2 sm:mb-3 text-sm sm:text-base">⏰ 산책 시간</label>
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
              {timeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setWalkTime(option.value)}
                  className={`py-2 sm:py-3 px-1 sm:px-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    walkTime === option.value
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}>
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pet Option */}
          <div className="mb-4 sm:mb-6">
            <label className="flex items-center justify-between p-3 sm:p-4 bg-gray-800 rounded-xl sm:rounded-2xl cursor-pointer">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <span className="text-xl sm:text-2xl">🐕</span>
                <div>
                  <p className="text-white font-medium text-sm sm:text-base">반려동물과 함께</p>
                  <p className="text-gray-400 text-xs sm:text-sm">수목이 많은 길로 안내해드려요</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={withPet}
                onChange={(e) => setWithPet(e.target.checked)}
                className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
              />
            </label>
          </div>

          {/* Walk Purpose Selection */}
          <div className="mb-6 sm:mb-8">
            <label className="block text-white font-medium mb-2 sm:mb-3 text-sm sm:text-base">🎯 산책 목적</label>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {walkPurposes.map((purpose) => (
                <button
                  key={purpose.id}
                  onClick={() => setWalkPurpose(purpose.id)}
                  className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all text-left ${
                    walkPurpose === purpose.id
                      ? 'border-green-500 bg-gray-800'
                      : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                  }`}>
                  <div className="text-xl sm:text-2xl mb-1 sm:mb-2">{purpose.icon}</div>
                  <h3 className="text-white font-medium text-xs sm:text-sm mb-1">{purpose.label}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">{purpose.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Recommendation Button */}
          <button
            onClick={handleRouteRecommendation}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:shadow-lg transition-all mb-4 sm:mb-6">
            🚀 AI 맞춤 경로 추천받기
          </button>
        </div>

        {/* Quick Access Features */}
        <div className="px-4 py-4 sm:py-6 bg-gray-800/30">
          <h3 className="text-white font-bold text-base sm:text-lg mb-3 sm:mb-4">빠른 접근</h3>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <button
              onClick={() => navigate('/my-routes')}
              className="bg-gray-800 p-3 sm:p-4 rounded-xl sm:rounded-2xl text-center hover:bg-gray-700 transition-all">
              <div className="text-xl sm:text-2xl mb-1 sm:mb-2">📋</div>
              <p className="text-white font-medium text-xs sm:text-sm">내 경로</p>
              <p className="text-gray-400 text-xs">저장된 경로 보기</p>
            </button>
            <button
              onClick={() => navigate('/community')}
              className="bg-gray-800 p-3 sm:p-4 rounded-xl sm:rounded-2xl text-center hover:bg-gray-700 transition-all">
              <div className="text-xl sm:text-2xl mb-1 sm:mb-2">💬</div>
              <p className="text-white font-medium text-xs sm:text-sm">커뮤니티</p>
              <p className="text-gray-400 text-xs">후기 & 추천</p>
            </button>
          </div>
        </div>

        {/* Recent Routes */}
        <div className="px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-white font-bold text-base sm:text-lg">최근 추천 경로</h3>
            <button className="text-green-400 text-xs sm:text-sm font-medium">전체보기</button>
          </div>
          <div className="space-y-2 sm:space-y-3">
            <div className="bg-gray-800 p-3 sm:p-4 rounded-xl sm:rounded-2xl">
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <h4 className="text-white font-medium text-sm sm:text-base">강남역 → 반포한강공원</h4>
                <span className="text-green-400 text-xs sm:text-sm">45분</span>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-3">조용한 산책 • 반려동물 동반</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <span className="text-yellow-400">⭐</span>
                  <span className="text-gray-300 text-xs sm:text-sm">4.5</span>
                </div>
                <button className="text-green-400 text-xs sm:text-sm font-medium">다시 걷기</button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="px-3 sm:px-4 py-6 sm:py-8 bg-gradient-to-r from-green-600 to-green-700 mx-4 rounded-xl sm:rounded-2xl mb-4 sm:mb-6">
          <div className="text-center">
            <h3 className="text-white font-bold text-lg sm:text-xl mb-2">더 정확한 추천을 원하시나요?</h3>
            <p className="text-green-100 text-xs sm:text-sm mb-4 sm:mb-6">회원가입하고 개인 맞춤 경로를 받아보세요</p>
            <button
              onClick={() => navigate('/signup')}
              className="w-full bg-white text-green-600 font-bold py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-all text-sm sm:text-base">
              무료로 시작하기
            </button>
          </div>
        </div>

        {/* Bottom Navigation Placeholder */}
        <div className="h-16 sm:h-20"></div>
      </div>

      {/* TabBar */}
      <TabBar onTabChange={() => {}} />
    </div>
  );
};

export default MainPage;
