const MyInfo = () => {
  return (
    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-4 mb-6 text-white">
      <h3 className="font-bold text-lg mb-3">이번 달 산책 기록</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold">28</p>
          <p className="text-sm opacity-90">총 산책</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">42km</p>
          <p className="text-sm opacity-90">총 거리</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">18시간</p>
          <p className="text-sm opacity-90">총 시간</p>
        </div>
      </div>
    </div>
  );
};

export default MyInfo;
