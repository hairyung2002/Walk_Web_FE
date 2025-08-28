import { useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '@constants/key';
import type { Address } from '@/types/address';
import { getAddress } from '@/apis/Mainpage/address';

interface UseGetAddressProps {
  latitude?: number;
  longitude?: number;
  enabled?: boolean;
}

function useGetAddress(props?: UseGetAddressProps) {
  const { latitude, longitude, enabled = true } = props || {};

  return useQuery<Address>({
    queryKey:
      latitude && longitude ? [QUERY_KEY.address, 'coords', latitude, longitude] : [QUERY_KEY.address, 'current'],
    queryFn: () => getAddress(latitude && longitude ? { latitude, longitude } : undefined),
    enabled: enabled && (latitude === undefined || (latitude !== 0 && longitude !== 0)),
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
  });
}

export default useGetAddress;
