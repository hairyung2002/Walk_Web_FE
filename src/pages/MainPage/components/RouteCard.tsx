import React from 'react';
import { useNavigate } from 'react-router-dom';

interface SavedRoute {
  id: string;
  title: string;
  location: string;
  distance: string;
  duration: string;
  lastWalked: string;
  walkCount: number;
  favorite: boolean;
  tags: string[];
  rating: number;
  image: string;
  difficulty: string;
}

interface RouteCardProps {
  route: SavedRoute;
  onToggleFavorite: (routeId: string) => void;
  onOpenReviewModal: (route: SavedRoute) => void;
}

const RouteCard: React.FC<RouteCardProps> = ({ route, onToggleFavorite, onOpenReviewModal }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden mx-2">
      {/* Route Header */}
      <div className="p-3">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-xl">
              {route.image}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-medium text-sm leading-tight truncate">{route.title}</h3>
              <p className="text-gray-400 text-xs">{route.location}</p>
            </div>
          </div>
          <button
            onClick={() => onToggleFavorite(route.id)}
            title={route.favorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
            className={`p-1.5 rounded-lg transition-colors ${
              route.favorite ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
            }`}>
            <svg
              className="w-4 h-4"
              fill={route.favorite ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>

        {/* Route Stats */}
        <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
          <div className="bg-gray-700 rounded-lg p-2 text-center">
            <p className="text-gray-400 text-xs">거리</p>
            <p className="text-white font-medium">{route.distance}</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-2 text-center">
            <p className="text-gray-400 text-xs">시간</p>
            <p className="text-white font-medium">{route.duration}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
          <div className="bg-gray-700 rounded-lg p-2 text-center">
            <p className="text-gray-400 text-xs">횟수</p>
            <p className="text-green-400 font-medium">{route.walkCount}회</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-2 text-center">
            <p className="text-gray-400 text-xs">별점</p>
            <div className="flex items-center justify-center space-x-1">
              <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-white text-xs font-medium">{route.rating}</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {route.tags.slice(0, 2).map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-md">
              #{tag}
            </span>
          ))}
          {route.tags.length > 2 && (
            <span className="px-2 py-1 bg-gray-700 text-gray-400 text-xs rounded-md">+{route.tags.length - 2}</span>
          )}
        </div>

        {/* Last Walked */}
        <div className="mb-3">
          <p className="text-gray-400 text-xs">
            마지막: {new Date(route.lastWalked).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => navigate('/navigate')}
            className="flex-1 bg-green-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-all">
            🚶‍♂️ 다시 걷기
          </button>
          <button
            onClick={() => onOpenReviewModal(route)}
            className="px-3 py-2 border border-gray-600 text-gray-300 rounded-lg hover:border-gray-500 transition-all text-sm">
            ✍️
          </button>
        </div>
      </div>
    </div>
  );
};

export default RouteCard;
