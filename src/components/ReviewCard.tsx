import React from 'react';
import type { Review } from '@/types/review';

interface ReviewCardProps {
  review: Review;
  onLike?: (reviewId: number) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, onLike }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleLike = () => {
    if (onLike) {
      onLike(review.id);
    }
  };

  return (
    <div className="bg-gray-800 rounded-2xl p-4">
      {/* User Info */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">{review.userNickname.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <p className="text-white font-medium text-sm">{review.userNickname}</p>
            <p className="text-gray-400 text-xs">{formatDate(review.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* AI Generated Title and Summary */}
      {review.aiTitle && (
        <div className="bg-gray-700/50 rounded-xl p-3 mb-3">
          <div className="flex items-center space-x-1 mb-2">
            <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xs text-blue-400 font-medium">AI 코멘트</span>
          </div>
          <h3 className="text-white font-semibold text-lg">{review.aiTitle}</h3>
          <p className="text-gray-300 text-sm leading-relaxed">{review.aiSummary}</p>
        </div>
      )}

      {/* Original Title */}
      <h4 className="text-white font-medium mb-2">"{review.title}"</h4>

      {/* Original Content */}
      <p className="text-gray-300 text-sm mb-3 leading-relaxed">{review.content}</p>

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-700">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
            className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors"
            title="좋아요">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span className="text-sm font-medium">{review.likeCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
