// entities/teacher/model/useTeacherQuery.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teacherApi } from '../api';
import {Teacher, UpdateTeacher} from '@/shared/types/teacher';
import {api} from "@/shared/api/base.ts";
import {ERouterApiPath} from "@/shared/enum/route/api.ts";
import {Discipline} from "@/shared/types/discipline.ts";

type TeachersParams ={
    search?: string;
    sort_by?: string;
    sort_direction?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
}

export const useTeachers = (params: TeachersParams) =>
    useQuery({
        queryKey: ['teachers', params],
        queryFn: () => teacherApi.getAll(params)
    });

export const useGetTeacher = (id:number) =>
    useQuery({
        queryKey: ["teacher", id],
        queryFn: () => teacherApi.getById(id!),
        enabled: !!id,
    })

export const useCreateTeacher = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: teacherApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teachers'] });
        },
    });
};

export const useUpdateTeacher = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateTeacher }) =>
            teacherApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teachers'] });
        },
    });
};

export const useDeleteTeacher = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: teacherApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teachers'] });
        },
    });
};


export const useGetTeacherDisciplines = (id: number) =>
    useQuery({
        queryKey: ["teacherDisciplines", id],
        queryFn: async () => {
            const res = await api.get<Discipline[]>(`${ERouterApiPath.TEACHERS}/${id!}${ERouterApiPath.DISCIPLINES}`);
            return res.data;
        },
        enabled: !!id,
    });

type AddDisciplineProps = {
    teacher_id: number;
    discipline_id: number;
};

export const useAddDisciplineToTeacher = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ( props: AddDisciplineProps) =>
            await api.post(`${ERouterApiPath.TEACHERS}/${props.teacher_id}${ERouterApiPath.DISCIPLINES}/${props.discipline_id}`),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["teacherDisciplines", variables.teacher_id] });
        },
    });
};

export const useDeleteDisciplineToTeacher = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({teacher_id, discipline_id} : {teacher_id: number, discipline_id: number}) =>
            api.delete<Teacher>(`${ERouterApiPath.TEACHERS}/${teacher_id}${ERouterApiPath.DISCIPLINES}/${discipline_id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teacherDisciplines'] });
        },
    });
};
