import { Suspense, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { isLoggedIn } from '../utils/auth';

const ProtectedLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 로그인 상태 확인
    if (!isLoggedIn()) {
      // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  // 로그인되지 않은 경우 아무것도 렌더링하지 않음
  if (!isLoggedIn()) {
    return null;
  }

  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-gray-900"><div className="text-white">로딩 중...</div></div>}>
        <Outlet />
      </Suspense>
    </>
  );
};

export default ProtectedLayout;
