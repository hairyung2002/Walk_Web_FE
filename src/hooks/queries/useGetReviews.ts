import { useInfiniteQuery } from '@tanstack/react-query';
import type { ReviewsResponse, ReviewsQueryParams } from '@/types/review';
import { axiosInstance } from '@/apis/axios';

const fetchReviews = async (params: ReviewsQueryParams): Promise<ReviewsResponse> => {
  const searchParams = new URLSearchParams();

  if (params.sort) searchParams.append('sort', params.sort);
  if (params.lat !== undefined && params.lat !== 0) searchParams.append('lat', params.lat.toString());
  if (params.lng !== undefined && params.lng !== 0) searchParams.append('lng', params.lng.toString());
  if (params.page !== undefined) searchParams.append('page', params.page.toString());
  if (params.size !== undefined) searchParams.append('size', params.size.toString());

  const response = await axiosInstance.get<ReviewsResponse>(`/walk/reviews?${searchParams.toString()}`, {
    withCredentials: true,
  });

  return response.data;
};

export const useGetReviews = (params: Omit<ReviewsQueryParams, 'page'>) => {
  return useInfiniteQuery({
    queryKey: ['reviews', params],
    queryFn: ({ pageParam = 0 }) => fetchReviews({ ...params, page: pageParam, size: params.size || 10 }),
    getNextPageParam: (lastPage) => {
      if (lastPage.last) return undefined;
      return lastPage.number + 1;
    },
    initialPageParam: 0,
  });
};
