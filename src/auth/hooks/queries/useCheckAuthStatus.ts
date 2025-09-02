import { useQuery } from '@tanstack/react-query';

import { useEffect } from 'react';

import { useAuthContext } from '..';
import { TIME_ACTIVE_TOKEN } from '../../components/AuthContext';

import { agroAPI, pathsAgro } from '@/api/agroAPI';
import { PromiseReturnRecord } from '@/auth/interfaces/PromiseReturnRecord';
import { UseGetOneRecordReturn } from '@/modules/core/interfaces/responses/UseGetOneRecordReturn';
import { CACHE_CONFIG_TIME } from '@/config';

export interface ResponseCheckAuth {
  message: string;
  statusCode: number;
}

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipInterceptor?: boolean; // Agrega esta propiedad opcional
  }
}

export const checkAuthStatus = async (
  token: string
): PromiseReturnRecord<ResponseCheckAuth> => {
  return await agroAPI.get(`${pathsAgro.authentication}/check-status`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    skipInterceptor: true,
  });
};

export const useCheckAuthStatus = ({
  token = '',
}: {
  token: string;
}): UseGetOneRecordReturn<ResponseCheckAuth> => {
  const { isLogin, handleError } = useAuthContext();
  const query: UseGetOneRecordReturn<ResponseCheckAuth> = useQuery({
    queryKey: ['valid-sesion-user'],
    queryFn: () => checkAuthStatus(token),
    enabled: isLogin,
    refetchOnWindowFocus: false,
    // refetchIntervalInBackground
    ...CACHE_CONFIG_TIME.longTerm,
    refetchInterval: TIME_ACTIVE_TOKEN,
    retry: false,
  });

  const { isError, error } = query;

  useEffect(() => {
    if (isError) {
      handleError({
        error,
        messagesStatusError: {
          unauthorized: 'Tu sesión ha expirado',
        },
      });
    }
  }, [isError]);

  return query;
};
