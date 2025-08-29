import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { RequestReviewDTO, ResponseReviewDTO } from '@/types/review';

const postReview = async (data: RequestReviewDTO): Promise<ResponseReviewDTO> => {
  const res = await fetch('/walk/reviews', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // JSESSIONID 쿠키 자동 전송
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw { status: res.status, ...error };
  }

  return res.json();
};

export const usePostReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postReview,
    onMutate: async (newReview) => {
      // Optimistic update: 리뷰 목록 캐시가 있다면 임시 추가
      await queryClient.cancelQueries({ queryKey: ['reviews'] });
      const prev = queryClient.getQueryData<ResponseReviewDTO[]>(['reviews']);
      
      if (prev) {
        queryClient.setQueryData(
          ['reviews'],
          [
            {
              id: Date.now(),
              title: newReview.title,
              content: newReview.content,
              likeCount: 0,
              hateCount: 0,
              createdAt: new Date().toISOString(),
              userNickname: '나',
              aiSummary: '',
              aiTitle: '',
            },
            ...prev,
          ],
        );
      }
      
      return { prev };
    },
    onError: (_err: unknown, _newReview, context) => {
      // 에러 발생 시 이전 상태로 되돌리기
      if (context?.prev) {
        queryClient.setQueryData(['reviews'], context.prev);
      }
    },
    onSuccess: () => {
      // 성공 시 최신 리뷰 목록 refetch
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
};
