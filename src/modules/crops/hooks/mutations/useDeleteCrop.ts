import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { agroAPI, pathsAgro } from '@/api/agroAPI';
import { useAuthContext } from '@/auth/hooks';
import { PromiseReturnRecord } from '@/auth/interfaces/PromiseReturnRecord';
import { UseMutationReturn } from '@/modules/core/interfaces/responses/UseMutationReturn';

export const deleteCrop = async (id: string): PromiseReturnRecord<void> => {
  return await agroAPI.delete(`${pathsAgro.crops}/remove/one/${id}`);
};

export const useDeleteCrop = (): UseMutationReturn<void, string> => {
  const queryClient = useQueryClient();
  const { handleError } = useAuthContext();
  const mutation: UseMutationReturn<void, string> = useMutation({
    mutationFn: deleteCrop,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['crops'] });
      await queryClient.invalidateQueries({ queryKey: ['harvest'] });
      await queryClient.invalidateQueries({ queryKey: ['work'] });
      await queryClient.invalidateQueries({ queryKey: ['sale'] });
      await queryClient.invalidateQueries({ queryKey: ['consumption'] });
      toast.success(`Cultivo eliminado`);
    },
    onError: (error) => {
      handleError({
        error,
        messagesStatusError: {
          conflict: 'El cultivo aun tiene stock disponible',
        },
      });
    },
    retry: false,
  });
  return mutation;
};
