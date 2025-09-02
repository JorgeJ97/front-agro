import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { agroAPI, pathsAgro } from '@/api/agroAPI';
import { TypedAxiosError } from '@/auth/interfaces/AxiosErrorResponse';
import { AxiosError, AxiosResponse } from 'axios';
import { Module } from '../../interfaces/responses/ResponseGetAllModules';
import { CACHE_CONFIG_TIME } from '@/config';

export const getModules = async (): Promise<AxiosResponse<Module[]>> => {
  console.log('Se ejecuto')
  return await agroAPI.get(`${pathsAgro.authentication}/modules/all`);
};

export const useGetAllModules = ({
  executeQuery,
}: {
  executeQuery: boolean;
}): UseQueryResult<Module[], AxiosError<TypedAxiosError, unknown>> => {
  const query: UseQueryResult<
    Module[],
    AxiosError<TypedAxiosError, unknown>
  > = useQuery({
    queryKey: ['modules'],
    queryFn: () => getModules(),
    select: ({ data }) => data,
    ...CACHE_CONFIG_TIME.longTerm,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    enabled: executeQuery,
  });

  return query;
};
