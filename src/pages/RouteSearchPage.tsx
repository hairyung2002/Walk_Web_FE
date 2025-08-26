import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TabBar from '../components/TabBar';

interface SearchFilters {
  location: string;
  distance: string;
  difficulty: string;
  category: string;
  withPet: boolean;
  timeOfDay: string;
}

const RouteSearchPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('search');
  const [filters, setFilters] = useState<SearchFilters>({
    location: '',
    distance: 'all',
    difficulty: 'all',
    category: 'all',
    withPet: false,
    timeOfDay: 'all',
  });

  const categories = [
    { id: 'all', label: '전체', icon: '🌍' },
    { id: 'urban', label: '도심', icon: '🏙️' },
    { id: 'nature', label: '자연', icon: '🌿' },
    { id: 'river', label: '강변', icon: '🌊' },
    { id: 'park', label: '공원', icon: '🏞️' },
    { id: 'night', label: '야경', icon: '🌙' },
  ];

  const distances = [
    { id: 'all', label: '전체' },
    { id: '1km', label: '1km 이하' },
    { id: '2km', label: '2km 이하' },
    { id: '3km', label: '3km 이하' },
    { id: '5km', label: '5km 이하' },
  ];

  const difficulties = [
    { id: 'all', label: '전체' },
    { id: 'easy', label: '쉬움' },
    { id: 'normal', label: '보통' },
    { id: 'hard', label: '어려움' },
  ];

  const timeOptions = [
    { id: 'all', label: '전체' },
    { id: 'morning', label: '오전' },
    { id: 'afternoon', label: '오후' },
    { id: 'evening', label: '저녁' },
    { id: 'night', label: '밤' },
  ];

  // 회의록에 맞는 샘플 데이터
  const sampleRoutes = [
    {
      id: '1',
      title: '강남역 → 선릉역',
      subtitle: '도심 속 힐링 코스',
      location: '강남구',
      distance: '2.1km',
      duration: '35분',
      difficulty: '쉬움',
      rating: 4.6,
      reviews: 124,
      category: 'urban',
      image: '🏙️',
      features: ['카페 많음', '평지', '교통 편리'],
      weatherTip: '현재 날씨에 적합',
      nearby: ['스타벅스 5곳', '음식점 12곳'],
    },
    {
      id: '2',
      title: '한강공원 벚꽃길',
      subtitle: '반려동물과 함께하는 강변 산책',
      location: '서초구',
      distance: '3.2km',
      duration: '50분',
      difficulty: '쉬움',
      rating: 4.8,
      reviews: 89,
      category: 'river',
      image: '🌸',
      features: ['반려동물 OK', '넓은 공간', '벚꽃'],
      weatherTip: '벚꽃 시즌 추천',
      nearby: ['편의점 3곳', '카페 7곳'],
    },
    {
      id: '3',
      title: '북한산 둘레길 1코스',
      subtitle: '자연 속 힐링과 운동',
      location: '강북구',
      distance: '4.1km',
      duration: '1시간 20분',
      difficulty: '보통',
      rating: 4.5,
      reviews: 67,
      category: 'nature',
      image: '🏔️',
      features: ['자연길', '운동효과', '맑은 공기'],
      weatherTip: '등산화 추천',
      nearby: ['약수터 2곳', '휴게소 1곳'],
    },
    {
      id: '4',
      title: '청계천 야경투어',
      subtitle: '도심 야경 감상 코스',
      location: '중구',
      distance: '2.8km',
      duration: '45분',
      difficulty: '쉬움',
      rating: 4.7,
      reviews: 156,
      category: 'night',
      image: '🌃',
      features: ['야경 명소', '안전', '조명'],
      weatherTip: '저녁 시간 추천',
      nearby: ['편의점 8곳', '카페 15곳'],
    },
  ];

  const handleFilterChange = (key: keyof SearchFilters, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    // 필터링된 결과 표시 로직
    console.log('검색 필터:', filters);
  };

  const handleRouteSelect = (routeId: string) => {
    navigate(`/route-detail/${routeId}`);
  };

  const filteredRoutes = sampleRoutes.filter(route => {
    if (filters.category !== 'all' && route.category !== filters.category) return false;
    if (filters.location && !route.location.includes(filters.location)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-900 pb-20">
      <Navbar />

      <div className="max-w-md mx-auto pt-20 px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">산책로 찾기</h1>
          <p className="text-gray-400 text-sm">원하는 조건으로 산책로를 찾아보세요</p>
        </div>

        {/* Search Input */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="지역, 장소명으로 검색하세요"
              className="w-full px-4 py-4 bg-gray-800 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none transition-all"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            />
            <button 
              onClick={handleSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-2.5 rounded-xl hover:bg-green-700 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <h3 className="text-white font-medium mb-3">카테고리</h3>
          <div className="grid grid-cols-3 gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleFilterChange('category', category.id)}
                className={`p-3 rounded-xl text-center transition-all ${
                  filters.category === category.id
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <div className="text-xl mb-1">{category.icon}</div>
                <span className="text-xs font-medium">{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="mb-6 space-y-4">
          {/* Distance Filter */}
          <div>
            <h3 className="text-white font-medium mb-2">거리</h3>
            <div className="flex space-x-2 overflow-x-auto">
              {distances.map((distance) => (
                <button
                  key={distance.id}
                  onClick={() => handleFilterChange('distance', distance.id)}
                  className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
                    filters.distance === distance.id
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-800 text-gray-300'
                  }`}
                >
                  {distance.label}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div>
            <h3 className="text-white font-medium mb-2">난이도</h3>
            <div className="flex space-x-2">
              {difficulties.map((difficulty) => (
                <button
                  key={difficulty.id}
                  onClick={() => handleFilterChange('difficulty', difficulty.id)}
                  className={`px-3 py-2 rounded-lg text-sm transition-all ${
                    filters.difficulty === difficulty.id
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-800 text-gray-300'
                  }`}
                >
                  {difficulty.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time Filter */}
          <div>
            <h3 className="text-white font-medium mb-2">시간대</h3>
            <div className="flex space-x-2 overflow-x-auto">
              {timeOptions.map((time) => (
                <button
                  key={time.id}
                  onClick={() => handleFilterChange('timeOfDay', time.id)}
                  className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
                    filters.timeOfDay === time.id
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-800 text-gray-300'
                  }`}
                >
                  {time.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pet Option */}
          <div>
            <label className="flex items-center justify-between p-3 bg-gray-800 rounded-xl cursor-pointer">
              <div className="flex items-center space-x-3">
                <span className="text-xl">🐕</span>
                <span className="text-white font-medium">반려동물 동반 가능</span>
              </div>
              <input
                type="checkbox"
                checked={filters.withPet}
                onChange={(e) => handleFilterChange('withPet', e.target.checked)}
                className="w-5 h-5 text-green-500 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
              />
            </label>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-lg">
              검색 결과 ({filteredRoutes.length}개)
            </h3>
            <button className="text-green-400 text-sm font-medium">
              필터 초기화
            </button>
          </div>

          <div className="space-y-4">
            {filteredRoutes.map((route) => (
              <div
                key={route.id}
                onClick={() => handleRouteSelect(route.id)}
                className="bg-gray-800 rounded-2xl overflow-hidden cursor-pointer hover:bg-gray-750 transition-all"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-2xl">
                        {route.image}
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-lg">{route.title}</h4>
                        <p className="text-gray-400 text-sm">{route.subtitle}</p>
                        <p className="text-gray-500 text-xs">{route.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-white text-sm font-medium">{route.rating}</span>
                      <span className="text-gray-400 text-xs">({route.reviews})</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                    <div className="text-center">
                      <p className="text-gray-400">거리</p>
                      <p className="text-white font-medium">{route.distance}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400">시간</p>
                      <p className="text-white font-medium">{route.duration}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400">난이도</p>
                      <p className="text-green-400 font-medium">{route.difficulty}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {route.features.map((feature, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-lg">
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3">
                    <p className="text-green-400 text-sm">{route.weatherTip}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* No Results */}
        {filteredRoutes.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-white font-semibold mb-2">검색 결과가 없습니다</h3>
            <p className="text-gray-400 text-sm">다른 조건으로 검색해보세요</p>
          </div>
        )}
      </div>

      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default RouteSearchPage;
