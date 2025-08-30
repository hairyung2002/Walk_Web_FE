import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/apis/axios';

interface LikeReviewRequest {
  reviewId: number;
  isLike: boolean; // true: 좋아요, false: 싫어요
}

const likeReview = async (data: LikeReviewRequest): Promise<void> => {
  const endpoint = data.isLike ? `/walk/reviews/${data.reviewId}/like` : `/walk/reviews/${data.reviewId}/hate`;
  
  await axiosInstance.post(endpoint);
};

export const useLikeReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: likeReview,
    onSuccess: () => {
      // 리뷰 목록 쿼리 무효화하여 최신 데이터 반영
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
    onError: (error) => {
      console.error('좋아요/싫어요 처리 실패:', error);
    },
  });
};
