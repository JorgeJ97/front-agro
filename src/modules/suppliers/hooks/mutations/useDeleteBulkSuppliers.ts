import { agroAPI, pathsAgro } from '@/api/agroAPI';
import { useAuthContext } from '@/auth/hooks';
import { PromiseReturnRecord } from '@/auth/interfaces/PromiseReturnRecord';
import { BulkRecords } from '@/modules/core/interfaces/bulk-data/BulkRecords';
import { UseMutationReturn } from '@/modules/core/interfaces/responses/UseMutationReturn';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const deleteBulkSuppliers = async (
  data: BulkRecords
): PromiseReturnRecord<void> => {
  return await agroAPI.delete(`${pathsAgro.suppliers}/remove/bulk`, {
    data: {
      recordsIds: data.suppliersIds,
    },
  });
};

export const useDeleteBulkSuppliers = (): UseMutationReturn<
  void,
  BulkRecords
> => {
  const querySupplier = useQueryClient();
  const { handleError } = useAuthContext();
  const mutation: UseMutationReturn<void, BulkRecords> = useMutation({
    mutationFn: deleteBulkSuppliers,
    onSuccess: () => {
      querySupplier.invalidateQueries({ queryKey: ['suppliers'] });
      querySupplier.invalidateQueries({ queryKey: ['shopping'] });
      toast.success(`Proveedores eliminados`);
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
