import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';

interface RouteRecommendation {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  distance: string;
  difficulty: string;
  features: string[];
  weatherTip: string;
  nearbyPlaces: Array<{
    name: string;
    type: string;
    distance: string;
  }>;
  route: Array<{
    lat: number;
    lng: number;
    name: string;
  }>;
}

const RouteRecommendationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { location: startLocation, walkTime, walkPurpose, withPet } = location.state || {};

  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 4가지 추천 경로 더미 데이터
  const recommendations: RouteRecommendation[] = [
    {
      id: 'urban',
      title: '도심 활력 코스',
      description: '음식점과 카페가 많은 활기찬 거리를 따라 걷는 코스',
      estimatedTime: walkTime || '30분',
      distance: '2.1km',
      difficulty: '쉬움',
      features: ['카페 6곳', '음식점 12곳', '편의시설 다수', '넓은 보도'],
      weatherTip: '현재 날씨에 적합한 코스입니다',
      nearbyPlaces: [
        { name: '스타벅스 강남점', type: '카페', distance: '50m' },
        { name: '맛있는 김밥', type: '음식점', distance: '120m' },
        { name: 'GS25 편의점', type: '편의점', distance: '80m' },
      ],
      route: [
        { lat: 37.5665, lng: 126.978, name: '출발지' },
        { lat: 37.5675, lng: 126.979, name: '카페거리' },
        { lat: 37.5685, lng: 126.98, name: '음식점거리' },
        { lat: 37.5665, lng: 126.978, name: '도착지' },
      ],
    },
    {
      id: 'peaceful',
      title: '조용한 힐링 코스',
      description: withPet ? '반려동물과 함께 수목이 풍부한 한적한 길' : '수목이 많고 조용한 힐링 코스',
      estimatedTime: walkTime || '30분',
      distance: '1.8km',
      difficulty: '쉬움',
      features: withPet
        ? ['대형 수목 50그루', '넓은 식재간격', '반려동물 동반 가능', '조용한 환경']
        : ['대형 수목 50그루', '벤치 8개', '조용한 환경', '그늘진 길'],
      weatherTip: '수목이 많아 그늘이 시원합니다',
      nearbyPlaces: [
        { name: '작은 도서관', type: '도서관', distance: '150m' },
        { name: '동네 카페', type: '카페', distance: '200m' },
        { name: '근린공원', type: '공원', distance: '100m' },
      ],
      route: [
        { lat: 37.5665, lng: 126.978, name: '출발지' },
        { lat: 37.567, lng: 126.9785, name: '수목길' },
        { lat: 37.568, lng: 126.9775, name: '공원입구' },
        { lat: 37.5665, lng: 126.978, name: '도착지' },
      ],
    },
    {
      id: 'efficient',
      title: '효율적인 이동 코스',
      description: '목적지까지 최단 경로로 안내하는 실용적인 코스',
      estimatedTime: walkTime || '30분',
      distance: '2.5km',
      difficulty: '보통',
      features: ['최단경로', '대중교통 연계', '편의시설', '안전한 길'],
      weatherTip: '효율적인 이동에 최적화된 경로입니다',
      nearbyPlaces: [
        { name: '지하철 2호선', type: '교통', distance: '300m' },
        { name: '버스정류장', type: '교통', distance: '100m' },
        { name: '편의점', type: '편의점', distance: '150m' },
      ],
      route: [
        { lat: 37.5665, lng: 126.978, name: '출발지' },
        { lat: 37.569, lng: 126.981, name: '교차로' },
        { lat: 37.571, lng: 126.983, name: '목적지 인근' },
        { lat: 37.5665, lng: 126.978, name: '도착지' },
      ],
    },
    {
      id: 'scenic',
      title: '경치 좋은 포토 코스',
      description: '사진 찍기 좋은 명소와 경치를 감상할 수 있는 코스',
      estimatedTime: walkTime || '30분',
      distance: '2.0km',
      difficulty: '쉬움',
      features: ['포토존 5곳', '경치 명소', '벚꽃길(계절)', '인스타그램 핫플'],
      weatherTip: '맑은 날씨로 사진 촬영에 좋습니다',
      nearbyPlaces: [
        { name: '포토존 카페', type: '카페', distance: '80m' },
        { name: '갤러리', type: '문화시설', distance: '120m' },
        { name: '조형물 광장', type: '명소', distance: '200m' },
      ],
      route: [
        { lat: 37.5665, lng: 126.978, name: '출발지' },
        { lat: 37.5675, lng: 126.9785, name: '포토존1' },
        { lat: 37.568, lng: 126.9795, name: '포토존2' },
        { lat: 37.5665, lng: 126.978, name: '도착지' },
      ],
    },
  ];

  useEffect(() => {
    // AI 분석 시뮬레이션
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleRouteSelect = (routeId: string) => {
    setSelectedRoute(routeId);
  };

  const handleStartWalk = () => {
    if (!selectedRoute) {
      alert('경로를 선택해주세요!');
      return;
    }
    navigate('/navigation', { state: { route: recommendations.find((r) => r.id === selectedRoute) } });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-white text-xl font-bold mb-2">AI가 경로를 분석중입니다</h2>
          <p className="text-gray-400">날씨, 시간, 주변 데이터를 종합하여 최적의 경로를 찾고 있어요</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pb-20">
      <Navbar />

      <div className="max-w-md mx-auto pt-20 px-4">
        {/* Header */}
        <div className="mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center text-gray-400 hover:text-white mb-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            돌아가기
          </button>
          <h1 className="text-2xl font-bold text-white mb-2">AI 맞춤 경로 추천</h1>
          <p className="text-gray-400 text-sm">
            {startLocation} 출발 • {walkTime}분 •{' '}
            {walkPurpose === 'urban'
              ? '도심 산책'
              : walkPurpose === 'peaceful'
                ? '조용한 산책'
                : walkPurpose === 'moving'
                  ? '이동 겸 산책'
                  : '경치 좋은 길'}
            {withPet && ' • 반려동물 동반'}
          </p>
        </div>

        {/* Weather Alert */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-4 mb-6 text-white">
          <div className="flex items-center">
            <div className="text-2xl mr-3">☀️</div>
            <div>
              <p className="font-medium">오늘의 산책 조건</p>
              <p className="text-sm opacity-90">맑은 날씨, 미세먼지 좋음 - 산책하기 완벽한 날이에요!</p>
            </div>
          </div>
        </div>

        {/* Route Recommendations */}
        <div className="space-y-4 mb-6">
          <h2 className="text-white font-bold text-lg">추천 경로 (4개)</h2>
          {recommendations.map((route) => (
            <div
              key={route.id}
              onClick={() => handleRouteSelect(route.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedRoute === route.id
                  ? 'border-green-500 bg-gray-800'
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
              }`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg mb-1">{route.title}</h3>
                  <p className="text-gray-400 text-sm mb-2">{route.description}</p>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedRoute === route.id ? 'border-green-500 bg-green-500' : 'border-gray-600'
                  }`}>
                  {selectedRoute === route.id && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                <div className="text-center">
                  <p className="text-gray-400">시간</p>
                  <p className="text-white font-medium">{route.estimatedTime}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400">거리</p>
                  <p className="text-white font-medium">{route.distance}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400">난이도</p>
                  <p className="text-green-400 font-medium">{route.difficulty}</p>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-gray-400 text-sm mb-2">특징</p>
                <div className="flex flex-wrap gap-2">
                  {route.features.map((feature, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-lg">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3">
                <p className="text-green-400 text-sm font-medium">💡 AI 팁</p>
                <p className="text-green-300 text-sm">{route.weatherTip}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Route Details */}
        {selectedRoute && (
          <div className="bg-gray-800 rounded-2xl p-4 mb-6">
            <h3 className="text-white font-semibold mb-3">주변 정보</h3>
            <div className="space-y-2">
              {recommendations
                .find((r) => r.id === selectedRoute)
                ?.nearbyPlaces.map((place, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs">📍</span>
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{place.name}</p>
                        <p className="text-gray-400 text-xs">{place.type}</p>
                      </div>
                    </div>
                    <span className="text-green-400 text-sm">{place.distance}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleStartWalk}
            disabled={!selectedRoute}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
              selectedRoute
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}>
            {selectedRoute ? '🚶‍♂️ 산책 시작하기' : '경로를 선택해주세요'}
          </button>

          <button
            onClick={() => navigate('/route-comparison')}
            className="w-full py-3 rounded-2xl border border-gray-600 text-gray-300 hover:border-gray-500 transition-all">
            경로 비교하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default RouteRecommendationPage;
