import { postRoute } from '@/apis/Mainpage/postRoute';
import { QUERY_KEY } from '@/constants/key';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function usePostRoute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      duration,
      purpose,
      addressJibun,
      withPet,
      longitude,
      latitude,
    }: {
      duration: string;
      purpose: string;
      addressJibun: string;
      withPet: boolean;
      longitude: number;
      latitude: number;
    }) => postRoute(duration, purpose, addressJibun, withPet, longitude, latitude),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.route],
      });
    },
  });
}

export default usePostRoute;
