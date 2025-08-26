import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TabBar from '../components/TabBar';

interface SavedRoute {
  id: string;
  title: string;
  location: string;
  distance: string;
  duration: string;
  lastWalked: string;
  walkCount: number;
  favorite: boolean;
  tags: string[];
  rating: number;
  image: string;
  difficulty: string;
}

const MyRoutesPage = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('recent');

  const savedRoutes: SavedRoute[] = [
    {
      id: '1',
      title: '강남역 → 반포한강공원',
      location: '서초구',
      distance: '2.3km',
      duration: '45분',
      lastWalked: '2024-04-15',
      walkCount: 12,
      favorite: true,
      tags: ['조용한산책', '반려동물', '강변'],
      rating: 5,
      image: '🌊',
      difficulty: '쉬움'
    },
    {
      id: '2',
      title: '홍대 먹거리 투어 코스',
      location: '마포구',
      distance: '1.8km',
      duration: '30분',
      lastWalked: '2024-04-12',
      walkCount: 8,
      favorite: false,
      tags: ['도심산책', '맛집', '활기찬'],
      rating: 4,
      image: '🍜',
      difficulty: '쉬움'
    },
    {
      id: '3',
      title: '북한산 둘레길 입문',
      location: '강북구',
      distance: '3.2km',
      duration: '1시간 15분',
      lastWalked: '2024-04-10',
      walkCount: 5,
      favorite: true,
      tags: ['자연', '운동', '등산'],
      rating: 4,
      image: '🏔️',
      difficulty: '보통'
    },
    {
      id: '4',
      title: '청계천 야경 루트',
      location: '중구',
      distance: '2.0km',
      duration: '35분',
      lastWalked: '2024-04-08',
      walkCount: 3,
      favorite: false,
      tags: ['야경', '데이트', '도심'],
      rating: 5,
      image: '🌃',
      difficulty: '쉬움'
    }
  ];

  const filterOptions = [
    { id: 'recent', label: '최근 순' },
    { id: 'frequent', label: '자주 걸은 순' },
    { id: 'favorite', label: '즐겨찾기' },
    { id: 'rating', label: '별점 순' }
  ];

  const handleToggleFavorite = (routeId: string) => {
    console.log('즐겨찾기 토글:', routeId);
  };

  const handleWalkAgain = (route: SavedRoute) => {
    navigate('/navigation', { state: { route } });
  };

  const handleRouteDetail = (routeId: string) => {
    navigate(`/route-detail/${routeId}`);
  };

  const filteredRoutes = savedRoutes.filter(route => {
    if (selectedFilter === 'favorite') return route.favorite;
    return true;
  }).sort((a, b) => {
    switch (selectedFilter) {
      case 'frequent':
        return b.walkCount - a.walkCount;
      case 'rating':
        return b.rating - a.rating;
      case 'recent':
      default:
        return new Date(b.lastWalked).getTime() - new Date(a.lastWalked).getTime();
    }
  });

  return (
    <div className="min-h-screen bg-gray-900 pb-20">
      <Navbar />

      <div className="max-w-md mx-auto pt-20 px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">내 경로</h1>
          <p className="text-gray-400 text-sm">저장한 산책로와 기록을 확인하세요</p>
        </div>

        {/* Stats Summary */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-4 mb-6 text-white">
          <h3 className="font-bold text-lg mb-3">이번 달 산책 기록</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">28</p>
              <p className="text-sm opacity-90">총 산책</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">42km</p>
              <p className="text-sm opacity-90">총 거리</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">18시간</p>
              <p className="text-sm opacity-90">총 시간</p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {filterOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedFilter(option.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                selectedFilter === option.id
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Routes List */}
        <div className="space-y-4">
          {filteredRoutes.map((route) => (
            <div key={route.id} className="bg-gray-800 rounded-2xl overflow-hidden">
              {/* Route Header */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-2xl">
                      {route.image}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg leading-tight">{route.title}</h3>
                      <p className="text-gray-400 text-sm">{route.location}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleFavorite(route.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      route.favorite ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
                    }`}
                  >
                    <svg className="w-5 h-5" fill={route.favorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>

                {/* Route Stats */}
                <div className="grid grid-cols-4 gap-4 mb-4 text-sm">
                  <div className="text-center">
                    <p className="text-gray-400">거리</p>
                    <p className="text-white font-medium">{route.distance}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400">시간</p>
                    <p className="text-white font-medium">{route.duration}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400">횟수</p>
                    <p className="text-green-400 font-medium">{route.walkCount}회</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400">별점</p>
                    <div className="flex items-center justify-center space-x-1">
                      <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-white text-xs font-medium">{route.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {route.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-lg">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Last Walked */}
                <div className="mb-4">
                  <p className="text-gray-400 text-sm">
                    마지막 산책: {new Date(route.lastWalked).toLocaleDateString('ko-KR')}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleWalkAgain(route)}
                    className="flex-1 bg-green-500 text-white py-3 rounded-xl font-medium hover:bg-green-600 transition-all"
                  >
                    🚶‍♂️ 다시 걷기
                  </button>
                  <button
                    onClick={() => handleRouteDetail(route.id)}
                    className="px-6 py-3 border border-gray-600 text-gray-300 rounded-xl hover:border-gray-500 transition-all"
                  >
                    상세보기
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredRoutes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚶‍♂️</div>
            <h3 className="text-white font-semibold text-lg mb-2">저장된 경로가 없습니다</h3>
            <p className="text-gray-400 text-sm mb-6">새로운 산책로를 발견하고 저장해보세요</p>
            <button
              onClick={() => navigate('/')}
              className="bg-green-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-600 transition-all"
            >
              경로 찾으러 가기
            </button>
          </div>
        )}

        {/* Achievement Section */}
        <div className="mt-8 bg-gray-800 rounded-2xl p-4">
          <h3 className="text-white font-bold text-lg mb-4">🏆 달성 현황</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-700 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">🌟</div>
                <div>
                  <p className="text-white font-medium text-sm">첫 산책 완주</p>
                  <p className="text-gray-400 text-xs">첫 번째 경로를 완주했어요</p>
                </div>
              </div>
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-700 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">🔥</div>
                <div>
                  <p className="text-white font-medium text-sm">7일 연속 산책</p>
                  <p className="text-gray-400 text-xs">꾸준히 걷고 있어요</p>
                </div>
              </div>
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="text-2xl opacity-50">📍</div>
                <div>
                  <p className="text-gray-400 font-medium text-sm">장소 탐험가</p>
                  <p className="text-gray-500 text-xs">10곳 이상 방문하기 (7/10)</p>
                </div>
              </div>
              <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-gray-400 text-xs">7</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Spacing */}
        <div className="h-6"></div>
      </div>

      <TabBar onTabChange={() => {}} />
    </div>
  );
};

export default MyRoutesPage;
