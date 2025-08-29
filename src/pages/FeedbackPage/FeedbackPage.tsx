import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const FeedbackPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 상태 관리
  const [rating, setRating] = useState<number>(0);
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState<string>('');

  // 피드백 태그들
  const feedbackTags = [
    { id: 'fun', label: '재미있어요', emoji: '😊', color: 'from-blue-400 to-blue-600' },
    { id: 'hard', label: '힘들어요', emoji: '😅', color: 'from-red-400 to-red-600' },
    { id: 'scenic', label: '경치가 좋아요', emoji: '🌄', color: 'from-green-400 to-green-600' },
    { id: 'safe', label: '안전해요', emoji: '🛡️', color: 'from-yellow-400 to-yellow-600' },
    { id: 'crowded', label: '사람이 많아요', emoji: '👥', color: 'from-purple-400 to-purple-600' },
    { id: 'quiet', label: '조용해요', emoji: '🤫', color: 'from-indigo-400 to-indigo-600' },
    { id: 'clean', label: '깨끗해요', emoji: '✨', color: 'from-teal-400 to-teal-600' },
    { id: 'convenient', label: '편리해요', emoji: '👍', color: 'from-cyan-400 to-cyan-600' },
  ];

  // 별점 클릭 핸들러
  const handleStarClick = (starRating: number) => {
    setRating(starRating);
  };

  // 태그 토글
  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]));
  };

  // 피드백 제출
  const handleSubmit = () => {
    const feedbackData = {
      rating,
      tags: selectedTags,
      comment: comment.trim(),
      timestamp: new Date().toISOString(),
      routeInfo: location.state || null,
    };

    console.log('피드백 데이터:', feedbackData);

    // TODO: API 호출하여 피드백 저장

    // 메인 페이지로 이동
    navigate('/', { replace: true });
  };

  // 건너뛰기
  const handleSkip = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-900 pb-16 sm:pb-20">
      <Navbar />

      <div className="max-w-sm sm:max-w-md mx-auto">
        {/* Hero Section */}
        <div className="px-4 pt-16 sm:pt-20 pb-4 sm:pb-6">
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mb-4 sm:mb-6">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">산책</span>은
              <br />
              어떠셨나요?
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm">여러분의 소중한 피드백이 더 나은 경로 추천에 도움이 돼요</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 space-y-4 sm:space-y-6">
          {/* 별점 평가 */}
          <div className="bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <label className="block text-white font-medium mb-3 sm:mb-4 text-sm sm:text-base">⭐ 전체적인 만족도</label>

            <div className="flex justify-center space-x-2 sm:space-x-3 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className={`w-10 h-10 sm:w-12 sm:h-12 transition-all transform hover:scale-110 ${
                    star <= (hoveredStar || rating) ? 'text-yellow-400 drop-shadow-lg' : 'text-gray-500'
                  } hover:text-yellow-300`}>
                  <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </button>
              ))}
            </div>

            <div className="text-center">
              <span className="text-xs sm:text-sm text-gray-400">
                {rating === 0
                  ? '별점을 선택해주세요'
                  : rating === 1
                    ? '매우 불만족'
                    : rating === 2
                      ? '불만족'
                      : rating === 3
                        ? '보통'
                        : rating === 4
                          ? '만족'
                          : '매우 만족'}
              </span>
            </div>
          </div>

          {/* 태그 선택 */}
          <div className="bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <label className="block text-white font-medium mb-3 sm:mb-4 text-sm sm:text-base">🏷️ 산책의 특징</label>
            <p className="text-gray-400 text-xs sm:text-sm mb-4">이 경로는 어떤 특징이 있었나요? (중복 선택 가능)</p>

            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {feedbackTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => handleTagToggle(tag.id)}
                  className={`p-3 sm:p-4 rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm font-medium border-2 ${
                    selectedTags.includes(tag.id)
                      ? `bg-gradient-to-r ${tag.color} border-transparent text-white shadow-lg`
                      : 'border-gray-600 text-gray-300 hover:border-gray-500 hover:bg-gray-700'
                  }`}>
                  <div className="flex flex-col items-center space-y-1">
                    <span className="text-lg">{tag.emoji}</span>
                    <span>{tag.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 상세 의견 */}
          <div className="bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <label className="block text-white font-medium mb-3 sm:mb-4 text-sm sm:text-base">💭 추가 의견</label>
            <p className="text-gray-400 text-xs sm:text-sm mb-4">더 전하고 싶은 말이 있다면? (선택사항)</p>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="경로에 대한 상세한 의견을 자유롭게 작성해주세요..."
              className={`w-full h-24 sm:h-32 bg-gray-700 border border-gray-600 rounded-lg sm:rounded-xl p-3 sm:p-4 text-white placeholder-gray-400 text-xs sm:text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                comment.length > 500 ? 'border-red-500 focus:ring-red-500' : ''
              }`}
              maxLength={500}
            />

            <div className="flex justify-between items-center mt-2">
              <span className={`text-xs ${comment.length > 500 ? 'text-red-400' : 'text-gray-500'}`}>
                {comment.length}/500자
              </span>
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className="space-y-3 sm:space-y-4 pt-2">
            <button
              onClick={handleSubmit}
              disabled={rating === 0}
              className={`w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base transition-all ${
                rating === 0
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
              }`}>
              {rating === 0 ? '별점을 선택해주세요' : '피드백 완료'}
            </button>

            <button
              onClick={handleSkip}
              className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-medium text-sm sm:text-base transition-all border border-gray-700 hover:border-gray-600">
              건너뛰기
            </button>
          </div>

          {/* 하단 안내 */}
          <div className="text-center text-xs text-gray-500 leading-relaxed pb-4">
            여러분의 피드백은 익명으로 처리되며,
            <br />더 나은 경로 추천 서비스를 위해 활용됩니다.
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
