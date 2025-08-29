import React, { useState } from 'react';
import { usePostReview } from '../hooks/mutation/CommunityPage/usePostReview';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  routeId: number;
  routeTitle: string;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, routeId, routeTitle }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const postReviewMutation = usePostReview();

  const MAX_TITLE_LENGTH = 50;
  const MAX_CONTENT_LENGTH = 2000;

  const availableTags = [
    '조용한산책', '활기찬', '강변', '도심산책', '자연', '반려동물', 
    '맛집', '카페', '야경', '힐링', '운동', '사진명소', '데이트', '가족산책'
  ];

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !content.trim() || rating === 0) {
      setError('제목, 내용, 별점을 모두 입력해주세요.');
      return;
    }

    if (title.length > MAX_TITLE_LENGTH) {
      setError(`제목은 ${MAX_TITLE_LENGTH}자 이내로 입력해주세요.`);
      return;
    }

    if (content.length > MAX_CONTENT_LENGTH) {
      setError(`내용은 ${MAX_CONTENT_LENGTH}자 이내로 입력해주세요.`);
      return;
    }

    postReviewMutation.mutate(
      { title, content, routeId, rating, tags: selectedTags },
      {
        onSuccess: () => {
          setTitle('');
          setContent('');
          setRating(0);
          setSelectedTags([]);
          setError(null);
          onClose();
        },
        onError: (error) => {
          setError('리뷰 작성에 실패했습니다. 다시 시도해주세요.');
          console.error('리뷰 작성 오류:', error);
        }
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">리뷰 작성</h2>
          <button
            onClick={onClose}
            title="닫기"
            className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          {/* Route Info */}
          <div className="bg-gray-700 rounded-xl p-3">
            <p className="text-gray-300 text-sm">산책로</p>
            <p className="text-white font-medium">{routeTitle}</p>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-white font-medium mb-2">별점</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl transition-colors ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-500'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-white font-medium mb-2">
              제목 <span className="text-gray-400 text-sm">({title.length}/{MAX_TITLE_LENGTH})</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="리뷰 제목을 입력하세요"
              className="w-full bg-gray-700 text-white rounded-xl px-4 py-3 border border-gray-600 focus:border-green-500 focus:outline-none transition-colors"
              maxLength={MAX_TITLE_LENGTH}
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-white font-medium mb-2">
              내용 <span className="text-gray-400 text-sm">({content.length}/{MAX_CONTENT_LENGTH})</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="산책로에 대한 경험을 자세히 적어주세요"
              rows={6}
              className="w-full bg-gray-700 text-white rounded-xl px-4 py-3 border border-gray-600 focus:border-green-500 focus:outline-none transition-colors resize-none"
              maxLength={MAX_CONTENT_LENGTH}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-white font-medium mb-2">태그</label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    selectedTags.includes(tag)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
            {selectedTags.length > 0 && (
              <div className="mt-2">
                <p className="text-gray-400 text-sm">선택된 태그:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedTags.map((tag) => (
                    <span key={tag} className="bg-green-500 text-white px-2 py-1 rounded text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-gray-700 text-gray-300 rounded-xl hover:bg-gray-600 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={postReviewMutation.isPending}
              className="flex-1 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {postReviewMutation.isPending ? '작성 중...' : '리뷰 작성'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
