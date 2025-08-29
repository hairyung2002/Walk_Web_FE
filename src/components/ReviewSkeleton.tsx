import React from 'react';

const ReviewSkeleton: React.FC = () => {
  return (
    <div className="bg-gray-800 rounded-2xl p-4 animate-pulse">
      {/* User Info Skeleton */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
          <div>
            <div className="w-20 h-4 bg-gray-700 rounded mb-1"></div>
            <div className="w-16 h-3 bg-gray-700 rounded"></div>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-4 h-4 bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>

      {/* Title Skeleton */}
      <div className="w-3/4 h-5 bg-gray-700 rounded mb-2"></div>

      {/* Content Skeleton */}
      <div className="space-y-2 mb-3">
        <div className="w-full h-4 bg-gray-700 rounded"></div>
        <div className="w-5/6 h-4 bg-gray-700 rounded"></div>
        <div className="w-4/6 h-4 bg-gray-700 rounded"></div>
      </div>

      {/* Photos Skeleton */}
      <div className="flex space-x-2 mb-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-16 h-16 bg-gray-700 rounded-xl"></div>
        ))}
      </div>

      {/* Tags Skeleton */}
      <div className="flex flex-wrap gap-2 mb-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-16 h-6 bg-gray-700 rounded-lg"></div>
        ))}
      </div>

      {/* Actions Skeleton */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 bg-gray-700 rounded"></div>
          <div className="w-8 h-4 bg-gray-700 rounded"></div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className="w-5 h-5 bg-gray-700 rounded"></div>
            <div className="w-8 h-4 bg-gray-700 rounded"></div>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-5 h-5 bg-gray-700 rounded"></div>
            <div className="w-8 h-4 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewSkeleton;
