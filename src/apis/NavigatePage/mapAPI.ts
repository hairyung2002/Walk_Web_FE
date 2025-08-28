import axios from "axios";

export async function getPedestrianRoute(startX: string, startY: string, endX: string, endY: string) {
  try {
    const res = await axios.post(
      'https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1',
      {
        startX,
        startY,
        endX,
        endY,
        startName: '출발지',
        endName: '도착지',
      },
      {
        headers: {
          appKey: import.meta.env.VITE_TMAP_API_KEY,
          'Content-Type': 'application/json',
        },
      },
    );

    return res.data;
  } catch (err) {
    console.error('❌ 경로 안내 API 호출 실패', err);
    return null;
  }
}

export default getPedestrianRoute;