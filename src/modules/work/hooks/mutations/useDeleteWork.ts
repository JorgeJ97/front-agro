import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { agroAPI, pathsAgro } from '@/api/agroAPI';
import { useAuthContext } from '@/auth';
import { PromiseReturnRecord } from '@/auth/interfaces/PromiseReturnRecord';
import { UseMutationReturn } from '@/modules/core/interfaces/responses/UseMutationReturn';

export const deleteWork = async (id: string): PromiseReturnRecord<void> => {
  return await agroAPI.delete(`${pathsAgro.works}/remove/one/${id}`);
};

export const useDeleteWork = (): UseMutationReturn<void, string> => {
  const queryClient = useQueryClient();
  const { handleError } = useAuthContext();
  const mutation: UseMutationReturn<void, string> = useMutation({
    mutationFn: deleteWork,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['works'] });
      toast.success(`Trabajo eliminado`);
    },
    onError: (error) => {
      handleError({
        error,
        messagesStatusError: {
          conflict: 'El registro tiene pagos realizados',
        },
      });
    },
    retry: false,
  });
  return mutation;
};
