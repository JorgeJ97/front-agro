import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { agroAPI, pathsAgro } from '@/api/agroAPI';

import { useAuthContext } from '@/auth/hooks';
import { TypeGetAllRecordsReturn } from '@/modules/core/interfaces/responses/TypeGetAllRecordsReturn';
import { UseQueryGetAllRecordsReturn } from '@/modules/core/interfaces/responses/UseQueryGetAllRecordsReturn';
import { toast } from 'sonner';
import { Supply } from '../../interfaces/Supply';
import { CACHE_CONFIG_TIME } from '@/config';

export const getSuppliesWithShopping =
  async (): TypeGetAllRecordsReturn<Supply> => {
    return await agroAPI.get(`${pathsAgro.supplies}/shopping/all`);
  };


export const useGetAllSuppliesWithShopping =
  (): UseQueryGetAllRecordsReturn<Supply> => {
    const { hasPermission, handleError } = useAuthContext();

    const isAuthorized = hasPermission(
      'supplies',
      'find_all_supplies_with_shopping'
    );

    const query: UseQueryGetAllRecordsReturn<Supply> = useQuery({
      queryKey: ['supplies-with-shopping'],
      queryFn: () => getSuppliesWithShopping(),
      select: ({ data }) => data,
      enabled: isAuthorized,
      refetchOnWindowFocus: false,
      ...CACHE_CONFIG_TIME.longTerm,
    });

    useEffect(() => {
      if (!isAuthorized) {
        toast.error(
          'No tienes permiso para ver el listado de insumos con compras 😑'
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
