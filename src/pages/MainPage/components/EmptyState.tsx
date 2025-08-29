import React from 'react';
import { useNavigate } from 'react-router-dom';

interface EmptyStateProps {
  title: string;
  description: string;
  emoji: string;
  buttonText?: string;
  buttonAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description, emoji, buttonText, buttonAction }) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (buttonAction) {
      buttonAction();
    } else {
      navigate('/');
    }
  };

  return (
    <div className="text-center py-8 px-4">
      <div className="text-4xl mb-3">{emoji}</div>
      <h3 className="text-white font-semibold text-base mb-2">{title}</h3>
      <p className="text-gray-400 text-sm mb-6 leading-relaxed">{description}</p>
      {buttonText && (
        <button
          onClick={handleButtonClick}
          className="bg-green-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-600 transition-all text-sm">
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
