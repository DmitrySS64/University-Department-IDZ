// entities/discipline/model/useDisciplineQuery.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { disciplineApi } from '../api';
import {Discipline, UpdateDiscipline} from '@/shared/types/discipline';
import {api} from "@/shared/api/base.ts";
import {ERouterApiPath} from "@/shared/enum/route/api.ts";
import {Teacher} from "@/shared/types/teacher.ts";

type SearchParams ={
    search?: string;
    sort_by?: string;
    sort_direction?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
}

export const useDisciplines = (params: SearchParams) =>
    useQuery({
        queryKey: ['disciplines', params],
        queryFn: () => disciplineApi.getAll(params)
    });

export const useGetAllDisciplines = () => {
    const params: SearchParams = {
        limit: 100,
    }
    return useQuery({
        queryKey: ['disciplines', params],
        queryFn: () => disciplineApi.getAll(params)
    });
}

export const useGetDiscipline = (id:number) =>
    useQuery({
        queryKey: ["discipline", id],
        queryFn: () => disciplineApi.getById(id!),
        enabled: !!id,
    })

export const useCreateDiscipline = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: disciplineApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['disciplines'] });
        },
    });
};

export const useUpdateDiscipline = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateDiscipline }) =>
            disciplineApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['disciplines'] });
        },
    });
};

export const useDeleteDiscipline = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: disciplineApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['disciplines'] });
        },
    });
};

export const useGetDisciplineTeachers = (id: number) =>
    useQuery({
        queryKey: ["disciplineTeachers", id],
        queryFn: async () => {
            const res = await api.get<Teacher[]>(`${ERouterApiPath.DISCIPLINES}/${id!}${ERouterApiPath.TEACHERS}`);
            return res.data;
        },
        enabled: !!id,
    });

type AddTeacherProps = {
    teacher_id: number;
    discipline_id: number;
};

export const useAddTeacherToDiscipline = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ( props: AddTeacherProps) =>
            await api.post(`${ERouterApiPath.DISCIPLINES}/${props.discipline_id}${ERouterApiPath.TEACHERS}/${props.teacher_id}`),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["disciplineTeachers", variables.discipline_id] });
        },
    });
};

export const useDeleteTeacherToDiscipline = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({teacher_id, discipline_id} : {teacher_id: number, discipline_id: number}) =>
            api.delete<Discipline>(`${ERouterApiPath.DISCIPLINES}/${discipline_id}${ERouterApiPath.TEACHERS}/${teacher_id}`),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['disciplineTeachers', variables.discipline_id]  });
        },
    });
};

