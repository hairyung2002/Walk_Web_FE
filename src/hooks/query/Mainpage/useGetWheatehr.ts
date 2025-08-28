import { useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '@constants/key';
import { getWeather } from '@/apis/Mainpage/weather';
import type { Weather } from '@/types/weather';

function useGetWeather() {
  return useQuery<Weather[]>({
    queryKey: [QUERY_KEY.weather],
    queryFn: () => getWeather(),
    staleTime: 1000 * 6 * 5,
    gcTime: 1000 * 6 * 10,
  });
}

export default useGetWeather;