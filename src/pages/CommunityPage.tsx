import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TabBar from '../components/TabBar';

interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  routeTitle: string;
  rating: number;
  comment: string;
  photos: string[];
  walkDate: string;
  location: string;
  tags: string[];
  likes: number;
  isLiked: boolean;
}

const CommunityPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('community');
  const [selectedFilter, setSelectedFilter] = useState('recent');

  const reviews: Review[] = [
    {
      id: '1',
      userName: '산책러버',
      userAvatar: '👩‍🦰',
      routeTitle: '한강 서래섬 벚꽃길',
      rating: 5,
      comment: '반려동물과 함께 걷기 정말 좋았어요! 수목이 많아서 그늘도 시원하고 강아지도 너무 좋아했습니다. 벚꽃 시즌이라 더욱 예뻤네요 🌸',
      photos: ['🌸', '🐕', '🌳'],
      walkDate: '2024-04-15',
      location: '서초구',
      tags: ['반려동물', '벚꽃', '강변'],
      likes: 24,
      isLiked: false
    },
    {
      id: '2',
      userName: '도심탐험가',
      userAvatar: '👨‍💼',
      routeTitle: '강남역 먹거리 투어 코스',
      rating: 4,
      comment: '점심시간에 걷기 좋은 코스입니다. 중간중간 맛집들이 많아서 산책하면서 구경하는 재미가 있어요. 다만 사람이 좀 많긴 해요.',
      photos: ['🍜', '🏢', '☕'],
      walkDate: '2024-04-14',
      location: '강남구',
      tags: ['도심', '맛집', '점심산책'],
      likes: 18,
      isLiked: true
    },
    {
      id: '3',
      userName: '야경매니아',
      userAvatar: '🌙',
      routeTitle: '청계천 야경 코스',
      rating: 5,
      comment: '밤에 걷기 정말 좋은 코스예요! 조명이 예쁘고 안전해서 혼자 걸어도 괜찮습니다. 데이트 코스로도 추천드려요 💕',
      photos: ['🌃', '💡', '💑'],
      walkDate: '2024-04-13',
      location: '중구',
      tags: ['야경', '데이트', '안전'],
      likes: 32,
      isLiked: false
    },
    {
      id: '4',
      userName: '건강지킴이',
      userAvatar: '💪',
      routeTitle: '북한산 둘레길 입문 코스',
      rating: 4,
      comment: '운동 겸 산책하기 좋아요. 생각보다 경사가 있어서 운동 효과 확실! 공기도 맑고 자연을 만끽할 수 있었습니다.',
      photos: ['🏔️', '🌲', '💪'],
      walkDate: '2024-04-12',
      location: '강북구',
      tags: ['운동', '자연', '등산'],
      likes: 15,
      isLiked: false
    }
  ];

  const filterOptions = [
    { id: 'recent', label: '최신순' },
    { id: 'popular', label: '인기순' },
    { id: 'rating', label: '별점순' },
    { id: 'nearby', label: '내 주변' }
  ];

  const handleLike = (reviewId: string) => {
    // 좋아요 토글 로직
    console.log('좋아요:', reviewId);
  };

  const handleWriteReview = () => {
    navigate('/write-review');
  };

  return (
    <div className="min-h-screen bg-gray-900 pb-20">
      <Navbar />

      <div className="max-w-md mx-auto pt-20 px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">커뮤니티</h1>
          <p className="text-gray-400 text-sm">산책 후기와 추천을 공유해보세요</p>
        </div>

        {/* Write Review CTA */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold text-lg mb-1">산책 후기 작성하기</h3>
              <p className="text-green-100 text-sm">다른 사람들과 경험을 나눠보세요</p>
            </div>
            <button
              onClick={handleWriteReview}
              className="bg-white text-green-600 px-4 py-2 rounded-xl font-medium hover:bg-gray-50 transition-all"
            >
              작성하기
            </button>
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

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-gray-800 rounded-2xl p-4">
              {/* User Info */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-xl">
                    {review.userAvatar}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{review.userName}</p>
                    <p className="text-gray-400 text-xs">{review.location} • {review.walkDate}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-600'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>

              {/* Route Title */}
              <h3 className="text-white font-semibold mb-2">{review.routeTitle}</h3>

              {/* Comment */}
              <p className="text-gray-300 text-sm mb-3 leading-relaxed">{review.comment}</p>

              {/* Photos */}
              {review.photos.length > 0 && (
                <div className="flex space-x-2 mb-3">
                  {review.photos.map((photo, index) => (
                    <div
                      key={index}
                      className="w-16 h-16 bg-gray-700 rounded-xl flex items-center justify-center text-2xl"
                    >
                      {photo}
                    </div>
                  ))}
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {review.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-lg"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                <button
                  onClick={() => handleLike(review.id)}
                  className={`flex items-center space-x-2 ${
                    review.isLiked ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
                  } transition-colors`}
                >
                  <svg className="w-5 h-5" fill={review.isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="text-sm font-medium">{review.likes}</span>
                </button>

                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.476L3 21l2.524-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                    </svg>
                    <span className="text-sm">댓글</span>
                  </button>

                  <button className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    <span className="text-sm">공유</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="py-6 text-center">
          <button className="text-green-400 font-medium hover:text-green-300 transition-colors">
            더 많은 후기 보기
          </button>
        </div>
      </div>

      {/* Floating Write Button */}
      <button
        onClick={handleWriteReview}
        className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-lg flex items-center justify-center z-50"
        aria-label="후기 작성"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </button>

      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default CommunityPage;
