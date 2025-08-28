import React from 'react';

export const lazyRoutes = {
  MainPage: React.lazy(() => import('../pages/MainPage/MainPage')),
  MyInfoPage: React.lazy(() => import('../pages/MyPage/MyInfoPage')),
  NotFoundPage: React.lazy(() => import('../pages/NotFoundPage/NotFoundPage')),
  ProfilePage: React.lazy(() => import('../pages/ProfilePage/ProfilePage')),
  LoginPage: React.lazy(() => import('../pages/AccountPage/LoginPage')),
  SignUpPage: React.lazy(() => import('../pages/AccountPage/SignUpPage')),
  RouteRecommendationPage: React.lazy(() => import('../pages/RouteRecommendationPage')),
  CommunityPage: React.lazy(() => import('../pages/CommunityPage')),
  MyRoutesPage: React.lazy(() => import('../pages/MyRoutesPage')),
  RouteSearchPage: React.lazy(() => import('../pages/RouteSearchPage')),
  NavigatePage: React.lazy(() => import('../pages/NavigatePage/NavigatePage')),
};
