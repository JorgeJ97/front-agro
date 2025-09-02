import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { agroAPI, pathsAgro } from '@/api/agroAPI';
import { useAuthContext } from '@/auth';
import { PromiseReturnRecord } from '@/auth/interfaces/PromiseReturnRecord';
import { UseMutationReturn } from '@/modules/core/interfaces/responses/UseMutationReturn';

export const deleteSale = async (id: string): PromiseReturnRecord<void> => {
  return await agroAPI.delete(`${pathsAgro.sales}/remove/one/${id}`);
};

export const useDeleteSale = (): UseMutationReturn<void, string> => {
  const queryClient = useQueryClient();
  const { handleError } = useAuthContext();
  const mutation: UseMutationReturn<void, string> = useMutation({
    mutationFn: deleteSale,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['sales'] });
      await queryClient.invalidateQueries({ queryKey: ['crops'] });
      await queryClient.invalidateQueries({
        queryKey: ['crops'],
      });
      toast.success(`Venta eliminada`);
    },
    onError: (error) => {
      handleError({
        error,
        messagesStatusError: {},
      });
    },
    retry: false,
  });
  return mutation;
};
