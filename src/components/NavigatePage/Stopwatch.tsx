import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

// 타이머 데이터를 가져올 수 있는 ref 타입
export type StopwatchRef = {
  getTimerData: () => {
    startTime: number | null;
    duration: number;
    isRunning: boolean;
  };
};

interface StopwatchProps {
  className?: string;
}

const Stopwatch = forwardRef<StopwatchRef, StopwatchProps>(({ className }, ref) => {
  // 타이머 상태 관리 (리렌더링 최소화)
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const timerDisplayRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | null>(null);

  // 타이머 로직 (DOM 직접 업데이트로 리렌더링 방지)
  useEffect(() => {
    if (isTimerRunning && startTime) {
      intervalRef.current = window.setInterval(() => {
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        const formattedTime = formatTime(elapsedSeconds);

        // DOM 직접 업데이트 (리렌더링 없음)
        if (timerDisplayRef.current) {
          timerDisplayRef.current.textContent = formattedTime;
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isTimerRunning, startTime]);

  // 시간 포맷팅 함수 (HH:MM:SS)
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // 현재 경과 시간 계산 함수
  const getCurrentElapsedTime = () => {
    if (!startTime) return 0;
    return Math.floor((Date.now() - startTime) / 1000);
  };

  // 타이머 시작/일시정지
  const toggleTimer = () => {
    if (!isTimerRunning) {
      if (!startTime) {
        // 처음 시작
        setStartTime(Date.now());
      } else {
        // 재개 - 기존 경과 시간을 고려
        const currentElapsed = getCurrentElapsedTime();
        setStartTime(Date.now() - currentElapsed * 1000);
      }
      setIsTimerRunning(true);
    } else {
      // 일시정지
      setIsTimerRunning(false);
    }
  };

  // 타이머 리셋
  const resetTimer = () => {
    setIsTimerRunning(false);
    setStartTime(null);
    // DOM 직접 업데이트
    if (timerDisplayRef.current) {
      timerDisplayRef.current.textContent = '00:00';
    }
  };

  // 타이머 데이터를 외부로 전달하는 함수
  const getTimerData = () => ({
    startTime,
    duration: getCurrentElapsedTime(),
    isRunning: isTimerRunning,
  });

  // ref를 통해 외부에서 접근할 수 있도록 설정
  useImperativeHandle(ref, () => ({
    getTimerData,
  }));

  return (
    <div className={`absolute z-[1000] stopwatch-overlay ${className || ''}`}>
      <div className="rounded-lg p-2 bg-gray-800/95 border border-gray-700 backdrop-blur-md shadow-lg">
        <div className="flex items-center justify-between">
          {/* 상태 표시 - 컴팩트 */}
          <div className="flex items-center">
            <div
              className={`w-2 h-2 rounded-full mr-2 ${isTimerRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}
            />
            <span className="text-white text-xs font-medium">{isTimerRunning ? '🏃‍♂️' : '⏸️'}</span>
          </div>

          {/* 시간 디스플레이 - 컴팩트 */}
          <div
            ref={timerDisplayRef}
            className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 font-mono tracking-wider">
            00:00
          </div>

          {/* 컨트롤 버튼들 - 모바일 최적화 */}
          <div className="flex items-center space-x-1">
            <button
              onClick={toggleTimer}
              className={`px-2 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                isTimerRunning
                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}>
              {isTimerRunning ? '⏸️' : '▶️'}
            </button>

            <button
              onClick={resetTimer}
              className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-xs font-medium transition-all duration-200">
              🔄
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

Stopwatch.displayName = 'Stopwatch';

export default Stopwatch;
