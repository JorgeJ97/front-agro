import {
  useMutation,
  useQueryClient
} from '@tanstack/react-query';
import { toast } from 'sonner';

import { agroAPI, pathsAgro } from '@/api/agroAPI';
import { useAuthContext } from '@/auth/hooks';
import { PromiseReturnRecord } from '@/auth/interfaces/PromiseReturnRecord';
import { Client } from '@/modules/clients/interfaces/Client';
import { UseMutationReturn } from '@/modules/core/interfaces/responses/UseMutationReturn';
import { useNavigate } from 'react-router-dom';
import { MODULE_CLIENTS_PATHS } from '../../routes/pathRoutes';

export const updateClient = async (
  client: Client
): PromiseReturnRecord<void> => {
  const { id, ...rest } = client;
  return await agroAPI.patch(`${pathsAgro.clients}/update/one/${id}`, rest);
};

export const usePatchClient = (): UseMutationReturn<void, Client> => {
  const queryClient = useQueryClient();
  const { handleError } = useAuthContext();
  const navigate = useNavigate();
  const mutation: UseMutationReturn<void, Client> = useMutation({
    mutationFn: updateClient,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['clients'] });
      await queryClient.invalidateQueries({ queryKey: ['client'] });
      navigate(MODULE_CLIENTS_PATHS.ViewAll);
      toast.success(`Cliente actualizado`);
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
