import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import TabBar from '../../components/TabBar';
import AchievementSection from '../MainPage/components/AchievementSection';

interface MyPageData {
  user: {
    nickname: string;
    email: string;
  };
  stats: {
    totalRoutes: number;
    totalReviews: number;
    totalLikes: number;
  };
}

interface Achievement {
  id: string;
  emoji: string;
  title: string;
  description: string;
  completed: boolean;
  progress?: {
    current: number;
    total: number;
  };
}

const MyPage: React.FC = () => {
  const navigate = useNavigate();
  const [userData] = useState<MyPageData>({
    user: {
      nickname: 'test',
      email: '',
    },
    stats: {
      totalRoutes: 12,
      totalReviews: 8,
      totalLikes: 24,
    },
  });

  const handleLogout = () => {
    if (window.confirm('정말 로그아웃하시겠습니까?')) {
      // 로그아웃 로직
      localStorage.removeItem('token');
      sessionStorage.clear();
      navigate('/login');
    }
  };

  const menuItems = [
    {
      title: '내가 찜한 루트',
      description: `${userData.stats.totalRoutes}개의 저장된 루트`,
      icon: '❤️',
      color: 'from-pink-500 to-red-500',
      onClick: () => navigate('/my-routes'),
    },
    {
      title: '내가 쓴 리뷰',
      description: `${userData.stats.totalReviews}개의 작성된 리뷰`,
      icon: '✍️',
      color: 'from-blue-500 to-indigo-500',
      onClick: () => navigate('/my-reviews'),
    },
    {
      title: '내가 좋아요한 리뷰',
      description: `${userData.stats.totalLikes}개의 좋아요한 리뷰`,
      icon: '👍',
      color: 'from-green-500 to-emerald-500',
      onClick: () => navigate('/liked-reviews'),
    },
  ];

  const achievements: Achievement[] = [
    {
      id: '1',
      emoji: '🌟',
      title: '첫 산책 완주',
      description: '첫 번째 경로를 완주했어요',
      completed: true,
    },
    {
      id: '2',
      emoji: '🔥',
      title: '7일 연속 산책',
      description: '꾸준히 걷고 있어요',
      completed: true,
    },
    {
      id: '3',
      emoji: '📍',
      title: '장소 탐험가',
      description: '10곳 이상 방문하기',
      completed: false,
      progress: {
        current: 7,
        total: 10,
      },
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-900 pb-16">
        <div className="max-w-[320px] mx-auto px-3 pt-14 pb-4">
          {/* 헤더 */}
          <div className="text-center mb-4">
            <h1 className="text-xl font-bold text-white mb-1 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
                마이페이지
              </span>
            </h1>
            <p className="text-gray-400 text-xs">나만의 산책 기록을 확인해보세요</p>
          </div>

          {/* 프로필 카드 */}
          <div className="rounded-lg p-3 mb-4 bg-gray-800 border border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-800 to-green-900 flex items-center justify-center">
                <span className="text-lg text-white font-bold">{userData.user.nickname.charAt(0)}</span>
              </div>
              <div className="flex-1">
                <h2 className="text-base font-bold text-white mb-0.5">{userData.user.nickname}</h2>
                <p className="text-gray-400 text-xs">{userData.user.email}</p>
              </div>
            </div>
          </div>

          {/* 통계 카드 */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="rounded-lg p-2 bg-gray-800 border border-gray-700 text-center">
              <div className="text-base font-bold text-white mb-0.5">{userData.stats.totalRoutes}</div>
              <div className="text-xs text-gray-400">찜한 루트</div>
            </div>
            <div className="rounded-lg p-2 bg-gray-800 border border-gray-700 text-center">
              <div className="text-base font-bold text-white mb-0.5">{userData.stats.totalReviews}</div>
              <div className="text-xs text-gray-400">작성 리뷰</div>
            </div>
            <div className="rounded-lg p-2 bg-gray-800 border border-gray-700 text-center">
              <div className="text-base font-bold text-white mb-0.5">{userData.stats.totalLikes}</div>
              <div className="text-xs text-gray-400">좋아요</div>
            </div>
          </div>

          {/* 메뉴 항목들 */}
          <div className="space-y-2 mb-4">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className="w-full rounded-lg p-3 bg-gray-800 border border-gray-700 hover:border-gray-600 transition-all duration-200 group">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-r ${item.color} flex items-center justify-center`}>
                    <span className="text-lg">{item.icon}</span>
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-sm font-semibold text-white mb-0.5 group-hover:text-green-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-400">{item.description}</p>
                  </div>
                  <div className="text-gray-400 group-hover:text-green-400 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Achievement Section */}
          {userData.stats.totalRoutes > 0 && <AchievementSection achievements={achievements} />}

          {/* 로그아웃 버튼 - 작게 변경 */}
          <div className="mt-6 pt-4 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full rounded-lg p-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 transition-all duration-200 text-center">
              <span className="text-xs text-gray-400 hover:text-gray-300">로그아웃</span>
            </button>
          </div>
        </div>
      </div>
      <TabBar onTabChange={() => {}} />
    </>
  );
};

export default MyPage;
