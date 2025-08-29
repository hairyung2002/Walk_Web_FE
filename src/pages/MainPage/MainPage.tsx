import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import TabBar from '../../components/TabBar';
import useGetWeather from '@/hooks/query/Mainpage/useGetWheatehr';
import useGetAddress from '@/hooks/query/Mainpage/useGetAddress';
import usePostRoute from '@/hooks/mutation/MainPage/usePostRoute';
import { axiosInstance } from '@/apis/axios';

const MainPage = () => {
  // 기본 상태 관리
  const [location, setLocation] = useState('');
  const [walkTime, setWalkTime] = useState('30');
  const [walkPurpose, setWalkPurpose] = useState('');
  const [withPet, setWithPet] = useState(false);

  // 위치 정보 상태
  const [currentCoords, setCurrentCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const navigate = useNavigate();

  const { data: weatherData } = useGetWeather();

  // 백엔드에서 주소 가져오기 (좌표 기반)
  const { data: addressData } = useGetAddress({
    latitude: currentCoords?.latitude,
    longitude: currentCoords?.longitude,
    enabled: !!currentCoords,
  });

  const [weatherMention, setWeatherMention] = useState<string>('산책하기 좋은 날씨입니다!');
  const [weatherColor, setWeatherColor] = useState<'Green' | 'Red' | 'Blue' | 'Gray' | 'White'>('Green');

  useEffect(() => {
    if (weatherData && weatherData.temperature > 33.0) {
      setWeatherMention('날씨가 매우 더워요! 가벼운 옷차림과 충분한 수분 섭취를 잊지 마세요.');
      setWeatherColor('Red');
    } else if (weatherData && weatherData.temperature < -10.0) {
      setWeatherMention('날씨가 매우 추워요! 따뜻한 옷차림과 외출 시 주의하세요.');
      setWeatherColor('Blue');
    } else if (weatherData && weatherData.precipitationType === '비') {
      setWeatherMention('비가 오고 있어요! 우산을 챙기세요.');
      setWeatherColor('Gray');
    } else if (weatherData && weatherData.precipitationType === '눈') {
      setWeatherMention('눈이 오고 있어요! 따뜻한 옷차림과 안전에 유의하세요.');
      setWeatherColor('White');
    } else if (weatherData) {
      setWeatherMention('산책하기 좋은 날씨입니다!');
      setWeatherColor('Green');
    }
  }, [weatherData]);

  // 런닝 목적 선택 시 시간 옵션 제한
  useEffect(() => {
    if (walkPurpose === 'RUN' && (walkTime === 'MIN_45' || walkTime === 'MIN_60')) {
      setWalkTime('MIN_30');
    }
  }, [walkPurpose, walkTime]);

  // 날씨 관리
  const weatherInfo = {
    temp: weatherData?.temperature || 0,
    condition: weatherData?.precipitationType || 'unknown',
    recommendation: weatherMention,
    color: weatherColor,
  };

  // 추천 경로 타입
  const walkPurposes = [
    { id: 'CITY', label: '도심 산책', icon: '🏙️', desc: '음식점, 카페가 많은 활기찬 코스' },
    { id: 'QUIET', label: '조용한 산책', icon: '🌿', desc: '수목이 많고 한적한 힐링 코스' },
    { id: 'RUN', label: '런닝', icon: '🌃', desc: '다이어터를 위한 런닝 코스' },
    { id: 'NIGHT_VIEW', label: '경치 좋은 길', icon: '📸', desc: '사진 찍기 좋은 명소 코스' },
  ];

  const timeOptions = [
    { value: 'MIN_15', label: '15분' },
    { value: 'MIN_30', label: '30분' },
    { value: 'MIN_45', label: '45분' },
    { value: 'MIN_60', label: '1시간' },
  ];

  // 런닝 목적일 때는 15분, 30분만 선택 가능
  const getAvailableTimeOptions = () => {
    if (walkPurpose === 'RUN') {
      return timeOptions.filter((option) => option.value === 'MIN_15' || option.value === 'MIN_30');
    }
    return timeOptions;
  };

  // 현재 위치 가져오기 함수 (브라우저 GPS + 백엔드 주소 변환)
  const handleGetCurrentLocation = async () => {
    setIsLocationLoading(true);
    setLocationError(null);

    try {
      // 브라우저 GPS로 위도/경도 가져오기
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('브라우저에서 위치 서비스를 지원하지 않습니다.'));
          return;
        }

        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        });
      });

      const { latitude, longitude } = position.coords;
      console.log('📍 현재 위치:', { latitude, longitude });

      // 좌표 상태 업데이트 (이후 useGetAddress가 자동으로 호출됨)
      setCurrentCoords({ latitude, longitude });
    } catch (error) {
      console.error('위치 가져오기 실패:', error);
      setLocationError('현재 위치를 가져올 수 없습니다. 직접 주소를 입력해주세요.');
    } finally {
      setIsLocationLoading(false);
    }
  };

  // 사용자가 직접 주소를 입력할 때
  const handleAddressInputChange = (value: string) => {
    setLocation(value);
    // 사용자가 직접 입력한 경우 좌표 정보 초기화
    setCurrentCoords(null);
  };

  // 백엔드에서 주소를 가져왔을 때 location 상태 업데이트
  useEffect(() => {
    if (addressData?.addressJibun && currentCoords) {
      setLocation(addressData.addressJibun);
      console.log('🏠 백엔드에서 받은 주소:', addressData.addressJibun);
    }
  }, [addressData, currentCoords]);

  // const handleRouteRecommendation = () => {
  //   // 로그인 체크
  //   if (!isLoggedIn()) {
  //     navigate('/login');
  //     return;
  //   }

  //   if (!location || !walkPurpose) {
  //     alert('출발지와 산책 목적을 선택해주세요!');
  //     return;
  //   }

  //   // 주소 유형 결정 (GPS 기반인지 사용자 입력인지)
  //   const addressType = currentCoords ? 'gps' : 'manual';

  //   navigate('/route-recommendation', {
  //     state: {
  //       location,
  //       walkTime,
  //       walkPurpose,
  //       withPet,
  //       addressInfo: {
  //         address: location,
  //         coordinates: currentCoords,
  //         addressType,
  //         backendAddressData: addressData,
  //       },
  //     },
  //   });
  // };

  const postRouteMutation = usePostRoute();

  const handleSubmitAIRequest = () => {
    postRouteMutation.mutate(
      {
        duration: walkTime,
        purpose: walkPurpose,
        addressJibun: location,
        withPet,
        // longitude: currentCoords?.longitude || 0,
        // latitude: currentCoords?.latitude || 0,
        longitude: 127.0395,
        latitude: 37.5741,
      },
      {
        onSuccess: (data) => {
          // API response 구조
          const { routeStartX, routeStartY, points } = data;

          navigate('/routeinfo', {
            state: {
              startX: routeStartX,
              startY: routeStartY,
              points,
            },
          });
        },
      },
    );
  };

  // 주소 검색 기능
  const handleSearchCurrentLocation = async () => {
    if (!location.trim()) {
      setLocationError('주소를 입력해주세요.');
      return;
    }

    setIsLocationLoading(true);
    setLocationError(null);

    try {
      const response = await axiosInstance.get('/walk/location/search', {
        params: {
          address: location.trim(),
        },
      });

      if (response.data && response.data.latitude && response.data.longitude) {
        const { latitude, longitude } = response.data;

        // 좌표 상태 업데이트
        setCurrentCoords({ latitude, longitude });

        console.log('🔍 주소 검색 성공:', {
          address: location,
          coordinates: { latitude, longitude },
        });

        // 성공 메시지 (선택사항)
        setLocationError(null);
      } else {
        throw new Error('좌표 정보를 받지 못했습니다.');
      }
    } catch (error: unknown) {
      console.error('주소 검색 실패:', error);

      const axiosError = error as { response?: { status?: number } };

      if (axiosError.response?.status === 404) {
        setLocationError('주소를 찾을 수 없습니다. 다시 확인해주세요.');
      } else if (axiosError.response?.status === 400) {
        setLocationError('올바른 주소 형식이 아닙니다.');
      } else {
        setLocationError('주소 검색 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLocationLoading(false);
    }
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
          <div
            className={`rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6 text-white bg-opacity-80 ${
              weatherInfo.color === 'Red'
                ? 'bg-gradient-to-r from-red-700/80 to-red-900/80'
                : weatherInfo.color === 'Blue'
                  ? 'bg-gradient-to-r from-blue-700/80 to-blue-900/80'
                  : weatherInfo.color === 'Gray'
                    ? 'bg-gradient-to-r from-gray-700/80 to-gray-900/80'
                    : weatherInfo.color === 'White'
                      ? 'bg-gradient-to-r from-gray-200/80 to-gray-400/80 text-gray-800'
                      : 'bg-gradient-to-r from-green-700/80 to-green-900/80'
            }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs sm:text-sm ${weatherInfo.color === 'White' ? 'opacity-70' : 'opacity-90'}`}>
                  현재 날씨
                </p>
                <p className="text-xl sm:text-2xl font-bold">{weatherInfo.temp}°C</p>
                <p className={`text-xs sm:text-sm ${weatherInfo.color === 'White' ? 'opacity-70' : 'opacity-90'}`}>
                  {weatherInfo.recommendation}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl sm:text-3xl mb-1">
                  {weatherInfo.color === 'Red'
                    ? '🔥'
                    : weatherInfo.color === 'Blue'
                      ? '🥶'
                      : weatherInfo.color === 'Gray'
                        ? '🌧️'
                        : weatherInfo.color === 'White'
                          ? '❄️'
                          : '☀️'}
                </div>
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
                className="w-full px-3 py-3 sm:px-4 sm:py-4 pr-20 sm:pr-24 bg-gray-800 border border-gray-700 rounded-xl sm:rounded-2xl text-white placeholder-gray-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none transition-all text-sm sm:text-base"
                value={location}
                onChange={(e) => handleAddressInputChange(e.target.value)}
              />

              {/* 주소 검색 버튼 */}
              <button
                title="주소로 위치 검색"
                aria-label="주소로 위치 검색"
                disabled={isLocationLoading}
                className={`absolute right-12 sm:right-14 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all ${
                  isLocationLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
                onClick={handleSearchCurrentLocation}>
                {isLocationLoading ? (
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                )}
              </button>

              {/* GPS 현재 위치 버튼 */}
              <button
                title="현재 위치 가져오기"
                aria-label="현재 위치 가져오기"
                disabled={isLocationLoading}
                className={`absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all ${
                  isLocationLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
                }`}
                onClick={handleGetCurrentLocation}>
                {isLocationLoading ? (
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
            {/* Location Error Message */}
            {locationError && <p className="mt-2 text-xs sm:text-sm text-red-400">{locationError}</p>}
          </div>

          {/* Walk Time Selection */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-white font-medium mb-2 sm:mb-3 text-sm sm:text-base">⏰ 산책 시간</label>
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
              {getAvailableTimeOptions().map((option) => (
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
            onClick={handleSubmitAIRequest}
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
