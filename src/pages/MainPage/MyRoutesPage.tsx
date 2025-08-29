import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import TabBar from '../../components/TabBar';
import ReviewModal from '../../components/ReviewModal';
import FilterTabs from './components/FilterTabs';
import AchievementSection from './components/AchievementSection';
import EmptyState from './components/EmptyState';
import { useGetMyRoutes, useGetFavoriteRoutes } from '../../hooks/queries/MainPage/useGetMyRoute';
import { useToggleMyRouteFavorite } from '../../hooks/mutations/MainPage/useToggleMyRouteFavorite';
import type { MyRoute } from '../../types/myRoute';

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

interface Achievement {
  id: string;
  emoji: string;
  title: string;
  description: string;
  completed: boolean;
  progress?: {
    current: number;
    total: number;
  };
}

const MyRoutesPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('recent');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedRouteForReview, setSelectedRouteForReview] = useState<SavedRoute | null>(null);

  // API 훅 사용
  const { data: myRoutes = [], isLoading, isError, error } = useGetMyRoutes();
  const { data: favoriteRoutes = [] } = useGetFavoriteRoutes();
  const toggleFavoriteMutation = useToggleMyRouteFavorite();

  // API 데이터를 기존 형식으로 변환
  const convertMyRouteToSavedRoute = (myRoute: MyRoute): SavedRoute => ({
    id: myRoute.myRouteId.toString(),
    title: myRoute.routeTitle,
    location: '위치 정보 없음', // API에 없는 데이터는 기본값 사용
    distance: `${myRoute.distanceInKm}km`,
    duration: '시간 정보 없음', // API에 없는 데이터는 기본값 사용
    lastWalked: new Date().toISOString().split('T')[0], // 기본값으로 오늘 날짜
    walkCount: myRoute.walkCount,
    favorite: myRoute.isFavorite,
    tags: [], // API에 없는 데이터는 빈 배열
    rating: myRoute.rating,
    image: '🚶‍♂️', // 기본 아이콘
    difficulty: '쉬움', // 기본값
  });

  // API 데이터를 변환하여 사용
  const savedRoutes: SavedRoute[] = myRoutes.map(convertMyRouteToSavedRoute);

  const achievements: Achievement[] = [
    {
      id: '1',
      emoji: '🌟',
      title: '첫 산책 완주',
      description: '첫 번째 경로를 완주했어요',
      completed: true,
    },
    {
      id: '2',
      emoji: '🔥',
      title: '7일 연속 산책',
      description: '꾸준히 걷고 있어요',
      completed: true,
    },
    {
      id: '3',
      emoji: '📍',
      title: '장소 탐험가',
      description: '10곳 이상 방문하기',
      completed: false,
      progress: {
        current: 7,
        total: 10,
      },
    },
  ];

  const filterOptions = [
    { id: 'recent', label: '최근 순' },
    { id: 'frequent', label: '자주 걸은 순' },
    { id: 'favorite', label: '즐겨찾기' },
    { id: 'rating', label: '별점 순' },
  ];

  const handleToggleFavorite = (routeId: string) => {
    toggleFavoriteMutation.mutate(parseInt(routeId));
  };

  const handleOpenReviewModal = (route: SavedRoute) => {
    setSelectedRouteForReview(route);
    setIsReviewModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    setIsReviewModalOpen(false);
    setSelectedRouteForReview(null);
  };

  const filteredRoutes = (() => {
    let routes = savedRoutes;
    
    // 즐겨찾기 필터의 경우 API의 favorite routes 사용
    if (selectedFilter === 'favorite') {
      routes = favoriteRoutes.map(convertMyRouteToSavedRoute);
    }
    
    return routes.sort((a, b) => {
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
  })();

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 pb-20">
        <Navbar />
        <div className="w-full max-w-sm mx-auto pt-16 px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-white">로딩 중...</div>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태 처리
  if (isError) {
    // 401 에러인지 확인
    const isUnauthorized =
      error &&
      typeof error === 'object' &&
      'response' in error &&
      error.response &&
      typeof error.response === 'object' &&
      'status' in error.response &&
      error.response.status === 401;

    return (
      <div className="min-h-screen bg-gray-900 pb-20">
        <Navbar />
        <div className="w-full max-w-sm mx-auto pt-16 px-4">
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            {isUnauthorized ? (
              <>
                <div className="text-6xl">🔒</div>
                <div className="text-white text-lg font-semibold">로그인이 필요합니다</div>
                <div className="text-gray-400 text-center">내 경로를 확인하려면 로그인해주세요</div>
                <button
                  onClick={() => navigate('/login')}
                  className="mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200">
                  로그인하러 가기
                </button>
              </>
            ) : (
              <>
                <div className="text-6xl">⚠️</div>
                <div className="text-red-400">데이터를 불러오는데 실패했습니다</div>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200">
                  다시 시도
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pb-20">
      <Navbar />

      {/* Fixed Container for Mobile */}
      <div className="w-full max-w-sm mx-auto pt-16 px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">내 경로</h1>
          <p className="text-gray-400 text-sm">저장한 산책로와 기록을 확인하세요</p>
        </div>

        {/* Filter Tabs */}
        <FilterTabs options={filterOptions} selectedFilter={selectedFilter} onFilterChange={setSelectedFilter} />

        {/* Routes List */}
        {filteredRoutes.length > 0 ? (
          <div className="space-y-4">
            {filteredRoutes.map((route) => (
              <div key={route.id} className="bg-gray-800 rounded-2xl overflow-hidden">
                {/* Route Card Content */}
                <div className="p-4">
                  {/* Route Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-2xl">
                        {route.image}
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg leading-tight">{route.title}</h3>
                        <p className="text-gray-400 text-sm">{route.location}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleFavorite(route.id)}
                      title={route.favorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
                      className={`p-2 rounded-lg transition-colors ${
                        route.favorite ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
                      }`}>
                      <svg
                        className="w-5 h-5"
                        fill={route.favorite ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-gray-400 text-xs mb-1">거리</p>
                      <p className="text-white font-semibold text-sm">{route.distance}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400 text-xs mb-1">시간</p>
                      <p className="text-white font-semibold text-sm">{route.duration}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400 text-xs mb-1">횟수</p>
                      <p className="text-green-400 font-semibold text-sm">{route.walkCount}회</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400 text-xs mb-1">별점</p>
                      <div className="flex items-center justify-center space-x-1">
                        <span className="text-yellow-400 text-sm">★</span>
                        <span className="text-white font-semibold text-sm">{route.rating}</span>
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
                      마지막 산책:{' '}
                      {new Date(route.lastWalked).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                      })}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => navigate('/navigate')}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2">
                      <span>🚶‍♂️</span>
                      <span>다시 걷기</span>
                    </button>
                    <button
                      onClick={() => handleOpenReviewModal(route)}
                      className="px-6 py-3 border border-gray-600 text-gray-300 rounded-xl hover:border-gray-500 hover:text-white transition-all duration-200">
                      상세보기
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            emoji="🚶‍♂️"
            title="저장된 경로가 없습니다"
            description="새로운 산책로를 발견하고 저장해보세요"
            buttonText="경로 찾으러 가기"
            buttonAction={() => navigate('/')}
          />
        )}

        {/* Achievement Section */}
        {filteredRoutes.length > 0 && <AchievementSection achievements={achievements} />}

        {/* Bottom Spacing */}
        <div className="h-6"></div>
      </div>

      <TabBar onTabChange={() => {}} />

      {/* Review Modal */}
      {selectedRouteForReview && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={handleCloseReviewModal}
          routeId={parseInt(selectedRouteForReview.id)}
          routeTitle={selectedRouteForReview.title}
        />
      )}
    </div>
  );
};

export default MyRoutesPage;
