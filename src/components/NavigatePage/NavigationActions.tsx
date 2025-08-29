interface NavigationActionsProps {
  onEndNavigation: () => void;
  className?: string;
  buttonText?: string;
}

const NavigationActions = ({
  onEndNavigation,
  className = '',
  buttonText = '🚩 경로 안내 종료',
}: NavigationActionsProps) => {
  return (
    <div className={`px-4 py-2 sm:py-2 bg-gray-800/30 ${className}`}>
      <button
        onClick={onEndNavigation}
        className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-medium text-sm sm:text-base transition-all border border-gray-600 hover:border-gray-500">
        {buttonText}
      </button>
    </div>
  );
};

export default NavigationActions;
