interface NavigationHeaderProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

const NavigationHeader = ({
  title = '네비게이션',
  subtitle = '실시간 경로 탐색으로 목적지까지 안내해드려요',
  className = '',
}: NavigationHeaderProps) => {
  return (
    <div className={`px-3 pt-16 pb-2 ${className}`}>
      <div className="text-center mb-3">
        <h1 className="text-xl font-bold text-white mb-1 leading-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">{title}</span>{' '}
          안내
        </h1>
        <p className="text-gray-400 text-xs">{subtitle}</p>
      </div>
    </div>
  );
};

export default NavigationHeader;
