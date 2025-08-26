import { useState } from 'react';
import { LogoIcon, NotificationIcon, MenuIcon, ProfileIcon, SettingsIcon, LogoutIcon } from './icons';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-emerald-100 shadow-sm">
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3 shadow-md">
              <LogoIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-800">WalkingCity</span>
          </div>

          {/* Right Side - Menu & Notifications */}
          <div className="flex items-center space-x-2">
            {/* Notifications */}
            <button className="text-gray-600 hover:text-emerald-600 p-2 rounded-xl hover:bg-emerald-50 transition-all duration-200 relative">
              <NotificationIcon className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center">2</span>
            </button>
            
            {/* Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-emerald-600 p-2 rounded-xl hover:bg-emerald-50 transition-all duration-200"
            >
              <MenuIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute left-0 right-0 top-14 bg-white/95 backdrop-blur-lg border-b border-emerald-100 shadow-lg">
            <div className="px-4 py-3 space-y-1">
              <button className="w-full text-left px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-all duration-200 flex items-center">
                <ProfileIcon className="w-5 h-5 mr-3" />
                내 프로필
              </button>
              <button className="w-full text-left px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-all duration-200 flex items-center">
                <SettingsIcon className="w-5 h-5 mr-3" />
                설정
              </button>
              <hr className="my-2 border-emerald-100" />
              <button className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 flex items-center">
                <LogoutIcon className="w-5 h-5 mr-3" />
                로그아웃
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
