import { useNavigate, useLocation } from 'react-router-dom';
import { isLoggedIn } from '../utils/auth';

interface TabBarProps {
  onTabChange: (tab: string) => void;
}

const TabBar: React.FC<TabBarProps> = ({ onTabChange }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    {
      id: 'home',
      label: '홈',
      path: '/',
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="m3 12 2-2m0 0 7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      id: 'routes',
      label: '내 경로',
      path: '/my-routes',
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7"
          />
        </svg>
      ),
    },
    {
      id: 'community',
      label: '커뮤니티',
      path: '/community',
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      id: 'mypage',
      label: '마이페이지',
      path: '/mypage',
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
  ];

  // 현재 경로에 따라 활성 탭 결정
  const getCurrentTab = () => {
    const currentPath = location.pathname;
    const currentTab = tabs.find((tab) => tab.path === currentPath);
    return currentTab ? currentTab.id : 'home';
  };

  const handleTabClick = (tab: (typeof tabs)[0]) => {
    // 홈 페이지가 아닌 경우 로그인 체크
    if (tab.path !== '/' && !isLoggedIn()) {
      navigate('/login');
      return;
    }
    
    onTabChange(tab.id);
    navigate(tab.path);
  };

  const currentActiveTab = getCurrentTab();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 z-50">
      <div className="flex items-center justify-around py-1 sm:py-1.5 px-2 sm:px-4 max-w-sm sm:max-w-md mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab)}
            className={`flex flex-col items-center justify-center py-1 sm:py-1.5 px-2 sm:px-3 rounded-lg transition-all duration-200 ${
              currentActiveTab === tab.id
                ? 'text-green-400 bg-gray-700'
                : 'text-gray-400 hover:text-green-400 hover:bg-gray-700'
            }`}>
            <div className="mb-0.5">{tab.icon}</div>
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabBar;
