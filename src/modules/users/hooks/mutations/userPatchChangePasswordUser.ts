import { agroAPI, pathsAgro } from '@/api/agroAPI';
import { useAuthContext } from '@/auth/hooks';
import { PromiseReturnRecord } from '@/auth/interfaces/PromiseReturnRecord';
import { UseMutationReturn } from '@/modules/core/interfaces/responses/UseMutationReturn';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export interface DataChangePassword {
  id: string;
  old_password: string;
  new_password: string;
}

async function changePasswordUser({
  id,
  ...rest
}: DataChangePassword): PromiseReturnRecord<void> {
  return await agroAPI.put(
    `${pathsAgro.users}/change-password/one`,
    rest
  );
}

export function userPatchChangePasswordUser(): UseMutationReturn<
  void,
  DataChangePassword
> {
  const { handleError } = useAuthContext();

  const mutation: UseMutationReturn<void, DataChangePassword> = useMutation({
    mutationFn: changePasswordUser,
    onSuccess: () => {
      toast.success(`Contraseña cambiada`);
    },
    onError: (error) => {
      handleError({
        error,
        messagesStatusError: {
          notFound: 'No se encontro el usuario a actualizar su contraseña',
          unauthorized: 'No tienes permisos para actualizar la contraseña',
        },
      });
    },
    retry: false,
  });
  return mutation;
}
