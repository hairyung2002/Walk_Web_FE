import { useNavigate } from 'react-router-dom';
import { LogoIcon, NotificationIcon } from './icons';
import { isLoggedIn } from '../utils/auth';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const userLoggedIn = isLoggedIn();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-emerald-100 shadow-sm">
      <div className="max-w-sm sm:max-w-md mx-auto px-3 sm:px-4">
        <div className="flex justify-between items-center h-12 sm:h-14">
          {/* Logo */}
          <div className="flex items-center" onClick={() => navigate('/')}>
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center mr-2 sm:mr-3 shadow-md">
              <LogoIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-base sm:text-lg font-bold text-gray-800">WalkingCity</span>
          </div>

          {/* Right Side - Menu & Notifications */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Notifications */}
            <button
              title="알림"
              className="text-gray-600 hover:text-emerald-600 p-1.5 sm:p-2 rounded-lg sm:rounded-xl hover:bg-emerald-50 transition-all duration-200 relative">
              <NotificationIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              {/* 알림 수 표시 컴포넌트*/}
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 sm:w-4 sm:h-4 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center">
                2
              </span>
            </button>

            {/* Login/Logout Button */}
            {!userLoggedIn ? (
              <button
                title="로그인"
                onClick={handleLogin}
                className="text-gray-600 hover:text-emerald-600 p-1.5 sm:p-2 rounded-lg sm:rounded-xl hover:bg-emerald-50 transition-all duration-200 flex items-center space-x-1">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span className="hidden sm:inline text-xs font-medium">로그인</span>
              </button>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
