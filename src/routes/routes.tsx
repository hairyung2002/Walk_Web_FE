import React from 'react';

export const lazyRoutes = {
  MainPage: React.lazy(() => import('../pages/MainPage/MainPage')),
  MyPage: React.lazy(() => import('../pages/MyPage/MyPage')),
  NotFoundPage: React.lazy(() => import('../pages/NotFoundPage/NotFoundPage')),
  ProfilePage: React.lazy(() => import('../pages/ProfilePage/ProfilePage')),
  LoginPage: React.lazy(() => import('../pages/AccountPage/LoginPage')),
  SignUpPage: React.lazy(() => import('../pages/AccountPage/SignUpPage')),
  RouteRecommendationPage: React.lazy(() => import('../pages/RouteRecommendationPage')),
  CommunityPage: React.lazy(() => import('../pages/CommunityPage/CommunityPage')),
  MyRoutesPage: React.lazy(() => import('../pages/MainPage/MyRoutesPage')),
  RouteSearchPage: React.lazy(() => import('../pages/RouteSearchPage')),
  NavigatePage: React.lazy(() => import('../pages/NavigatePage/NavigatePage')),
  ReviewWritePage: React.lazy(() => import('../pages/CommunityPage/ReviewWritePage')),
  MyInfoPage: React.lazy(() => import('../pages/MyPage/components/MyInfo')),
};
