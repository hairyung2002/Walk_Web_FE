import HomeLayout from '@/layouts/HomeLayout';
import { lazyRoutes } from './routes';
import { createBrowserRouter, type RouteObject } from 'react-router-dom';

export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <lazyRoutes.NotFoundPage />,
    children: [{ index: true, element: <lazyRoutes.MainPage /> }],
  },
  {
    path: '/login',
    element: <lazyRoutes.LoginPage />,
  },
  {
    path: '/signup',
    element: <lazyRoutes.SignUpPage />,
  },
  {
    path: '/route-recommendation',
    element: <lazyRoutes.RouteRecommendationPage />,
  },
  {
    path: '/route-search',
    element: <lazyRoutes.RouteSearchPage />,
  },
  {
    path: '/community',
    element: <lazyRoutes.CommunityPage />,
  },
  {
    path: '/my-routes',
    element: <lazyRoutes.MyRoutesPage />,
  },
];

export const protectedRoutes: RouteObject[] = [];

export const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);
