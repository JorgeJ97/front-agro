import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { agroAPI, pathsAgro } from "@/api/agroAPI";
import { useAuthContext } from "@/auth/hooks";
import { PromiseReturnRecord } from "@/auth/interfaces/PromiseReturnRecord";
import { UseMutationReturn } from "@/modules/core/interfaces/responses/UseMutationReturn";

export const deleteSupplier = async (id: string): PromiseReturnRecord<void> => {
  return await agroAPI.delete(`${pathsAgro.suppliers}/remove/one/${id}`);
};

export const useDeleteSupplier = (): UseMutationReturn<void, string> => {
  const queryClient = useQueryClient();
  const { handleError } = useAuthContext();
  const mutation: UseMutationReturn<void, string> = useMutation({
    mutationFn: deleteSupplier,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      await queryClient.invalidateQueries({ queryKey: ["shopping"] });
      toast.success(`Proveedor eliminado`);
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
