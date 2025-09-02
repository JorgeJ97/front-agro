import { agroAPI, pathsAgro } from '@/api/agroAPI';
import { PromiseReturnRecord } from '@/auth/interfaces/PromiseReturnRecord';
import { UseGetOneRecordReturn } from '@/modules/core/interfaces/responses/UseGetOneRecordReturn';
import { useQuery } from '@tanstack/react-query';
import { ConsumptionSupplies } from '../../interfaces';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useAuthContext } from '@/auth';
import { ConvertStringToDate } from '@/modules/core/helpers';
import { CACHE_CONFIG_TIME } from '@/config';

export const getConsumptionById = async (
  id: string
): PromiseReturnRecord<ConsumptionSupplies> => {
  return await agroAPI.get(`${pathsAgro.consumption}/one/${id}`);
};

export const useGetConsumption = (
  id: string
): UseGetOneRecordReturn<ConsumptionSupplies> => {
  const { handleError, hasPermission } = useAuthContext();
  const isAuthorized = hasPermission(
    'consumptions',
    'find_one_supplies_consumption'
  );

  const query: UseGetOneRecordReturn<ConsumptionSupplies> = useQuery({
    queryKey: ['consumption', id],
    queryFn: () => getConsumptionById(id),
    select: ({ data }) =>
      ({
        ...data,
        date: ConvertStringToDate(data?.date!),
      } as unknown as ConsumptionSupplies),
    enabled: isAuthorized,
    refetchOnWindowFocus: false,
    ...CACHE_CONFIG_TIME.shortTerm,
  });

  useEffect(() => {
    if (!isAuthorized) {
      toast.error(
        'Requieres del permiso de lectura para obtener la información del consumo solicitado'
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
