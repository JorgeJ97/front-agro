import { useQuery } from '@tanstack/react-query';

import { agroAPI, pathsAgro } from '@/api/agroAPI';
import { useAuthContext } from '@/auth/hooks';
import { PromiseReturnRecord } from '@/auth/interfaces/PromiseReturnRecord';
import { UseGetOneRecordReturn } from '@/modules/core/interfaces/responses/UseGetOneRecordReturn';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Client } from '../../interfaces/Client';
import { CACHE_CONFIG_TIME } from '@/config';

export const getClientById = async (
  id: string
): PromiseReturnRecord<Client> => {
  return await agroAPI.get(`${pathsAgro.clients}/one/${id}`);
};

export const useGetClient = (id: string): UseGetOneRecordReturn<Client> => {
  const { hasPermission, handleError } = useAuthContext();

  const isAuthorized = hasPermission('clients', 'find_one_client');

  const query: UseGetOneRecordReturn<Client> = useQuery({
    queryKey: ['client', id],
    queryFn: () => getClientById(id),
    select: ({ data }) => data,
    enabled: isAuthorized,
    refetchOnWindowFocus: false,
    ...CACHE_CONFIG_TIME.shortTerm,
  });

  useEffect(() => {
    if (!isAuthorized) {
      toast.error(
        'Requieres del permiso de lectura para obtener la información del cliente solicitado'
      );
    }
  }, [isAuthorized]);

  useEffect(() => {
    if (query.isError) {
      handleError({
        error: query.error,
        messagesStatusError: {},
      });
    }
  }, [query.isError, query.error]);
  return query;
};
