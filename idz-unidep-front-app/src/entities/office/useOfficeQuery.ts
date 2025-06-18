// entities/discipline/model/useDisciplineQuery.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { officeApi } from '@/entities/office/api';
import { UpdateOffice } from '@/shared/types/office';

type SearchParams ={
    search?: string;
    sort_by?: string;
    sort_direction?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
}

export const useOffices = (params: SearchParams) =>
    useQuery({
        queryKey: ['offices', params],
        queryFn: () => officeApi.getAll(params)
    });
export const useGetAllOffices = () => {
    const params: SearchParams ={
        limit: 100,
    }
    return useQuery({
        queryKey: ['offices', params],
        queryFn: () => officeApi.getAll(params)
    });
}

export const useGetOffice = (id:number) =>
    useQuery({
        queryKey: ["office", id],
        queryFn: () => officeApi.getById(id!),
        enabled: !!id,
    })

export const useCreateOffice = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: officeApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['offices'] });
        },
    });
};

export const useUpdateOffice = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateOffice }) =>
            officeApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['offices'] });
        },
    });
};

export const useDeleteOffice = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: officeApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['offices'] });
        },
    });
};
