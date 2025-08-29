import React, { useState, useCallback } from 'react';
import Navbar from '../../components/Navbar';
import TabBar from '../../components/TabBar';
import ReviewCard from '../../components/ReviewCard';
import ReviewSkeleton from '../../components/ReviewSkeleton';
import { useGetReviews } from '../../hooks/queries/useGetReviews';
import type { ReviewsQueryParams } from '@/types/review';

const CommunityPage: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'latest' | 'popular' | 'rating'>('latest');
  const [showMyReviews, setShowMyReviews] = useState(false);
  const [location] = useState<{ lat: number; lng: number } | null>(null);

  // API 쿼리 파라미터
  const queryParams: Omit<ReviewsQueryParams, 'page'> = {
    sort: selectedFilter,
    lat: location?.lat || 0,
    lng: location?.lng || 0,
    size: 10,
    my: showMyReviews,
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useGetReviews(queryParams);

  // 모든 리뷰 데이터를 하나의 배열로 평탄화
  const allReviews = data?.pages.flatMap((page) => page.content) || [];

  const filterOptions = [
    { id: 'latest' as const, label: '최신순' },
    { id: 'popular' as const, label: '인기순' },
    { id: 'rating' as const, label: '별점순' },
  ];

  const handleLike = useCallback((reviewId: number) => {
    // 좋아요 토글 로직 (나중에 mutation으로 구현)
    console.log('좋아요:', reviewId);
  }, []);

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 pb-20">
      <Navbar />

      {/* Mobile Container - 320px base */}
      <div className="w-full max-w-[320px] mx-auto pt-16 pb-4">
        {/* Header */}
        <div className="px-4 mb-4">
          <h1 className="text-xl font-bold text-white mb-1">커뮤니티</h1>
          <p className="text-gray-400 text-xs">산책 후기를 확인해보세요</p>
        </div>

        {/* My Reviews Toggle */}
        <div className="px-4 mb-4">
          <button
            onClick={() => setShowMyReviews(!showMyReviews)}
            className={`w-full py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
              showMyReviews ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}>
            {showMyReviews ? '전체 리뷰 보기' : '내가 쓴 리뷰만 보기'}
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="px-4 mb-4">
          <div className="flex space-x-1.5 overflow-x-auto">
            {filterOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedFilter(option.id)}
                className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  selectedFilter === option.id
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}>
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div className="px-4 space-y-3">
          {isLoading ? (
            // 스켈레톤 UI 표시
            Array.from({ length: 3 }).map((_, index) => <ReviewSkeleton key={index} />)
          ) : isError ? (
            // 에러 상태 표시
            <div className="bg-gray-800 rounded-xl p-4 text-center">
              <div className="text-red-400 mb-2">
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-white font-medium mb-1 text-sm">데이터를 불러올 수 없습니다</h3>
              <p className="text-gray-400 text-xs mb-3">네트워크 연결을 확인하고 다시 시도해주세요.</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-600 transition-colors">
                다시 시도
              </button>
            </div>
          ) : allReviews.length === 0 ? (
            // 빈 상태 표시
            <div className="bg-gray-800 rounded-xl p-4 text-center">
              <div className="text-gray-400 mb-3">
                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </div>
              <h3 className="text-white font-medium mb-1 text-sm">
                {showMyReviews ? '작성한 리뷰가 없습니다' : '아직 작성된 리뷰가 없습니다'}
              </h3>
              <p className="text-gray-400 text-xs">
                {showMyReviews ? '산책을 완료하고 첫 리뷰를 작성해보세요!' : '첫 번째 리뷰를 작성해보세요!'}
              </p>
            </div>
          ) : (
            // 실제 리뷰 목록 표시
            allReviews.map((review) => <ReviewCard key={review.id} review={review} onLike={handleLike} />)
          )}
        </div>

        {/* Load More Button */}
        {hasNextPage && !isLoading && (
          <div className="px-4 py-4 text-center">
            <button
              onClick={handleLoadMore}
              disabled={isFetchingNextPage}
              className="text-green-400 font-medium hover:text-green-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm">
              {isFetchingNextPage ? '로딩 중...' : '더 많은 후기 보기'}
            </button>
          </div>
        )}

        {/* Loading indicator for infinite scroll */}
        {isFetchingNextPage && (
          <div className="px-4 py-2">
            <ReviewSkeleton />
          </div>
        )}
      </div>

      <TabBar onTabChange={() => {}} />
    </div>
  );
};

export default CommunityPage;
