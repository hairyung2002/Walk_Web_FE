export type Review = {
  id: number;
  title: string;
  content: string;
  likeCount: number;
  hateCount: number;
  createdAt: string; // API 응답에서는 ISO 문자열로 받음
  userNickname: string;
  aiSummary: string;
  aiTitle: string;
};

export type RequestReviewDTO = {
  title: string;
  content: string;
  routeId: number;
  rating: number; // 1-5 별점
  tags: string[]; // 태그 배열
};

export type ResponseReviewDTO = {
  id: number;
  title: string;
  content: string;
  likeCount: number;
  hateCount: number;
  createdAt: string; // API 응답에서는 ISO 문자열로 받음
  userNickname: string;
  aiSummary: string;
  aiTitle: string;
  rating: number; // 1-5 별점
  tags: string[]; // 태그 배열
};

export interface ReviewsResponse {
  content: Review[];
  pageable: {
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface ReviewsQueryParams {
  sort?: 'latest' | 'popular' | 'rating';
  lat?: number;
  lng?: number;
  page?: number;
  size?: number;
  my?: boolean;
}