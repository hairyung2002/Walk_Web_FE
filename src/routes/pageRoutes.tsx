import HomeLayout from '@/layouts/HomeLayout';
import ProtectedLayout from '@/layouts/ProtectedLayout';
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
];

export const protectedRoutes: RouteObject[] = [
  {
    path: '/',
    element: <ProtectedLayout />,
    children: [
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
      {
        path: '/profile',
        element: <lazyRoutes.ProfilePage />,
      },
      {
        path: '/my-info',
        element: <lazyRoutes.MyInfoPage />,
      },
    ],
  },
];

export const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);
