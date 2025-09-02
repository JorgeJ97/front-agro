import { useQuery } from '@tanstack/react-query';

import { useEffect } from 'react';

import { agroAPI, pathsAgro } from '@/api/agroAPI';
import { useAuthContext } from '@/auth/hooks';
import { TypeGetAllRecordsReturn } from '@/modules/core/interfaces/responses/TypeGetAllRecordsReturn';
import { UseQueryGetAllRecordsReturn } from '@/modules/core/interfaces/responses/UseQueryGetAllRecordsReturn';
import { toast } from 'sonner';
import { CACHE_CONFIG_TIME } from '@/config';

interface CropTopHarvest {
  id: string;
  name: string;
  total_harvests: number;
  total_amount: number;
}

export const getTopCropsInHarvests = async ({
  year,
}: {
  year: number;
}): TypeGetAllRecordsReturn<CropTopHarvest> => {
  const params = new URLSearchParams({
    year: year.toString(),
  });
  return await agroAPI.get(
    `${pathsAgro.dashboard}/find/count-harvest-and-total-stock?${params}`
  );
};

export const useGetTopCropsInHarvests = ({
  year = new Date().getFullYear(),
}: {
  year?: number;
}): UseQueryGetAllRecordsReturn<CropTopHarvest> => {
  const { hasPermission, handleError } = useAuthContext();

  const isAuthorized = hasPermission(
    'dashboard',
    'find_count_harvests_and_total_stock_chart'
  );

  const query: UseQueryGetAllRecordsReturn<CropTopHarvest> = useQuery({
    queryKey: ['crops-top-harvests', year],
    queryFn: () => getTopCropsInHarvests({ year }),
    select: ({ data }) => data,
    enabled: isAuthorized,
    refetchOnWindowFocus: false,
    ...CACHE_CONFIG_TIME.longTerm,
  });

  useEffect(() => {
    if (!isAuthorized) {
      toast.error(
        'No tienes permiso para ver el listado del top cultivos en cosechas 😑'
      );
    }
  }, [isAuthorized]);

  useEffect(() => {
    if (query.isError) {
      handleError({
        error: query.error,
        messagesStatusError: {
          unauthorized:
            'No tienes permiso para ver el listado del top cultivos en cosechas 😑',
        },
      });
    }
  }, [query.isError, query.error]);

  return query;
};
