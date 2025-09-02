import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { agroAPI, pathsAgro } from '@/api/agroAPI';
import { useAuthContext } from '@/auth';
import { PromiseReturnRecord } from '@/auth/interfaces/PromiseReturnRecord';
import { UseMutationReturn } from '@/modules/core/interfaces/responses/UseMutationReturn';

export const deleteHarvest = async (id: string):PromiseReturnRecord<void> =>
{
  return await agroAPI.delete(`${pathsAgro.harvests}/remove/one/${id}`);
}

export const useDeleteHarvest = (): UseMutationReturn<void, string> => {
  const queryClient = useQueryClient();
  const { handleError } = useAuthContext()

  const mutation: UseMutationReturn<void, string> = useMutation({
    mutationFn: deleteHarvest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['harvests'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['crops'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['crops-with-harvest'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['harvests-amount-year'],
      });
      toast.success(`Cosecha eliminada`);
    },
    onError: (error) => {
      handleError({
        error,
        messagesStatusError: {}
      })
    },
    retry: false,
  });
  return mutation;
};
