import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import TabBar from '../../components/TabBar';
import MyInfo from './components/MyInfo';

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

const MyPage: React.FC = () => {
  const navigate = useNavigate();
  const [userData] = useState<MyPageData>({
    user: {
      nickname: '산책러버',
      email: 'user@example.com',
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

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-900 pb-16 sm:pb-20">
        <div className="max-w-sm sm:max-w-md mx-auto px-4 pt-16 sm:pt-20 pb-4 sm:pb-6">
          {/* 헤더 */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
                마이페이지
              </span>
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm">나만의 산책 기록을 확인해보세요</p>
          </div>

          <MyInfo />

          {/* 프로필 카드 */}
          <div className="rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 bg-gray-800 border border-gray-700">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
                <span className="text-2xl sm:text-3xl text-white font-bold">{userData.user.nickname.charAt(0)}</span>
              </div>
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-1">{userData.user.nickname}</h2>
                <p className="text-gray-400 text-sm">{userData.user.email}</p>
              </div>
            </div>
          </div>

          {/* 통계 카드 */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="rounded-xl sm:rounded-2xl p-3 sm:p-4 bg-gray-800 border border-gray-700 text-center">
              <div className="text-lg sm:text-xl font-bold text-white mb-1">{userData.stats.totalRoutes}</div>
              <div className="text-xs sm:text-sm text-gray-400">찜한 루트</div>
            </div>
            <div className="rounded-xl sm:rounded-2xl p-3 sm:p-4 bg-gray-800 border border-gray-700 text-center">
              <div className="text-lg sm:text-xl font-bold text-white mb-1">{userData.stats.totalReviews}</div>
              <div className="text-xs sm:text-sm text-gray-400">작성 리뷰</div>
            </div>
            <div className="rounded-xl sm:rounded-2xl p-3 sm:p-4 bg-gray-800 border border-gray-700 text-center">
              <div className="text-lg sm:text-xl font-bold text-white mb-1">{userData.stats.totalLikes}</div>
              <div className="text-xs sm:text-sm text-gray-400">좋아요</div>
            </div>
          </div>

          {/* 메뉴 항목들 */}
          <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className="w-full rounded-xl sm:rounded-2xl p-4 sm:p-5 bg-gray-800 border border-gray-700 hover:border-gray-600 transition-all duration-200 group">
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center`}>
                    <span className="text-xl sm:text-2xl">{item.icon}</span>
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-1 group-hover:text-green-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400">{item.description}</p>
                  </div>
                  <div className="text-gray-400 group-hover:text-green-400 transition-colors">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* 로그아웃 버튼 */}
          <button
            onClick={handleLogout}
            className="w-full rounded-xl sm:rounded-2xl p-4 sm:p-5 bg-red-600 hover:bg-red-700 transition-all duration-200 group">
            <div className="flex items-center justify-center space-x-3">
              <span className="text-xl">🚪</span>
              <span className="text-base sm:text-lg font-semibold text-white">로그아웃</span>
            </div>
          </button>
        </div>
      </div>
      <TabBar onTabChange={() => {}} />
    </>
  );
};

export default MyPage;
