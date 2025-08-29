import React from 'react';

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

interface AchievementSectionProps {
  achievements: Achievement[];
}

const AchievementSection: React.FC<AchievementSectionProps> = ({ achievements }) => {
  return (
    <div className="mt-6 bg-gray-800 rounded-xl p-4 mx-4">
      <h3 className="text-white font-bold text-base mb-4">🏆 달성 현황</h3>
      <div className="space-y-3">
        {achievements.map((achievement) => (
          <div key={achievement.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="text-xl">{achievement.emoji}</div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{achievement.title}</p>
                <p className="text-gray-400 text-xs truncate">{achievement.description}</p>
                {achievement.progress && !achievement.completed && (
                  <div className="mt-1">
                    <div className="w-full bg-gray-600 rounded-full h-1.5">
                      <div
                        className="bg-green-500 h-1.5 rounded-full transition-all"
                        style={{
                          width: `${(achievement.progress.current / achievement.progress.total) * 100}%`,
                        }}></div>
                    </div>
                    <p className="text-gray-500 text-xs mt-1">
                      {achievement.progress.current}/{achievement.progress.total}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="ml-2">
              {achievement.completed ? (
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              ) : (
                <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                  {achievement.progress ? (
                    <span className="text-gray-400 text-xs">{achievement.progress.current}</span>
                  ) : (
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementSection;
