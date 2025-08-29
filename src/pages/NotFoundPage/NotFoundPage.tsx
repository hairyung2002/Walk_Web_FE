import { useNavigate } from 'react-router-dom';
import GradientButton from '../../components/Button/GradientButton';
import './NotFoundPage.css';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="not-found-container">
      {/* 404 메인 콘텐츠 */}
      <div className="text-center mb-8">
        {/* 404 숫자 */}
        <div className="mb-6">
          <h1 className="not-found-title">404</h1>
        </div>

        {/* 에러 메시지 */}
        <div className="mb-8">
          <h2 className="text-2xl max-lg:text-xl font-bold text-text-on-white mb-4">페이지를 찾을 수 없습니다</h2>
          <p className="text-lg max-lg:text-base text-text-on-background leading-relaxed">
            요청하신 페이지가 존재하지 않거나
            <br />
            일시적으로 이용할 수 없습니다.
          </p>
        </div>

        {/* 홈으로 돌아가기 버튼 */}
        <div className="flex justify-center">
          <GradientButton buttonType="textButton" text="메인페이지로 돌아가기" onClick={handleGoHome} />
        </div>
      </div>

      {/* 배경 그라데이션 효과 */}
      <div className="not-found-background" />

      {/* 추가 도움말 링크들 */}
      <div className="mt-12 text-center">
        <p className="text-sm text-text-on-background mb-4">다음 페이지들을 이용해보세요</p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <button onClick={() => navigate('/')} className="text-primary hover:text-primary-hover underline">
            홈페이지
          </button>
          <span className="text-text-on-background">|</span>
          <button onClick={() => navigate(-1)} className="text-primary hover:text-primary-hover underline">
            이전 페이지
          </button>
          <span className="text-text-on-background">|</span>
          <button onClick={() => window.location.reload()} className="text-primary hover:text-primary-hover underline">
            새로고침
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
