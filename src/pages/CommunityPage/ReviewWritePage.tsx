import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import TabBar from '../../components/TabBar';
import { usePostReview } from '@/hooks/mutation/CommunityPage/usePostReview';
import type { ResponseReviewDTO } from '@/types/review';

const ReviewWritePage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [routeId, setRouteId] = useState<number | ''>('');
  const [rating, setRating] = useState<number>(0);
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<ResponseReviewDTO | null>(null);

  const postReviewMutation = usePostReview();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !routeId || !rating) {
      setError('모든 필드를 입력해주세요.');
      return;
    }
    if (title.length > 50) {
      setError('제목은 50자 이내로 입력해주세요.');
      return;
    }
    if (content.length > 2000) {
      setError('내용은 2000자 이내로 입력해주세요.');
      return;
    }
    
    postReviewMutation.mutate(
      { title, content, routeId: Number(routeId), rating, tags },
      {
        onSuccess: (data) => {
          setSuccess(data);
          setTitle('');
          setContent('');
          setRouteId('');
          setRating(0);
          setTags([]);
          setError(null);
        },
        onError: (err: unknown) => {
          let errorMsg = '리뷰 작성에 실패했습니다.';
          if (typeof err === 'object' && err && 'message' in err) {
            errorMsg = (err as { message: string }).message;
          }
          setError(errorMsg);
        },
      },
    );
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-900 pb-16 sm:pb-20">
        <div className="max-w-sm sm:max-w-md mx-auto px-4 pt-16 sm:pt-20 pb-4 sm:pb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
              리뷰 작성
            </span>
          </h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-white font-medium mb-2 text-sm sm:text-base">제목</label>
              <input
                type="text"
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                maxLength={50}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none transition-all text-sm sm:text-base"
                placeholder="리뷰 제목을 입력하세요 (최대 50자)"
                required
              />
            </div>
            <div>
              <label className="block text-white font-medium mb-2 text-sm sm:text-base">내용</label>
              <textarea
                value={content}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                maxLength={2000}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none transition-all text-sm sm:text-base min-h-[120px]"
              />
            </div>
            <div>
              <label className="block text-white font-medium mb-2 text-sm sm:text-base">Route ID</label>
              <input
                type="number"
                value={routeId}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setRouteId(e.target.value ? Number(e.target.value) : '')
                }
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none transition-all text-sm sm:text-base"
                placeholder="연결할 Route ID를 입력하세요"
                required
              />
            </div>
            <div>
              <label className="block text-white font-medium mb-2 text-sm sm:text-base">평점 (1~5)</label>
              <input
                type="number"
                min={1}
                max={5}
                value={rating}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setRating(Number(e.target.value))
                }
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none transition-all text-sm sm:text-base"
                placeholder="평점을 입력하세요 (1~5)"
                required
              />
            </div>
            <div>
              <label className="block text-white font-medium mb-2 text-sm sm:text-base">태그 (쉼표로 구분)</label>
              <input
                type="text"
                value={tags.join(',')}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTags(e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag))
                }
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none transition-all text-sm sm:text-base"
                placeholder="태그를 입력하세요 (예: 경치좋음, 조용함)"
              />
            </div>
            {error && <div className="text-red-400 text-sm text-center">⚠️ {error}</div>}
            {success && (
              <div className="text-green-400 text-sm text-center">
                리뷰가 성공적으로 등록되었습니다!
                <br />
                (ID: {success.id})
              </div>
            )}
            <button
              type="submit"
              disabled={postReviewMutation.isPending}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed">
              {postReviewMutation.isPending ? '작성 중...' : '리뷰 등록'}
            </button>
          </form>
        </div>
      </div>
      <TabBar onTabChange={() => {}} />
    </>
  );
};

export default ReviewWritePage;
