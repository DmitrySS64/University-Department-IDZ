// shared/api/crudFactory.ts

import { api } from '@/shared/api/base';

export interface CrudApiConfig {
    endpoint: string; // без слэша на конце
}

type getAllParams ={
    search?: string;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
}

export const createCrudApi = <TCreate, TUpdate, TEntity>(
    config: CrudApiConfig
) => {
    const { endpoint } = config;

    return {
        getAll: async (params: getAllParams): Promise<TEntity[]> => {
            const res = await api.get<TEntity[]>(`${endpoint}`, { params });
            return res.data;
        },

        getById: async (id: number): Promise<TEntity> => {
            const res = await api.get<TEntity>(`${endpoint}/${id}`);
            return res.data;
        },

        create: async (data: TCreate): Promise<TEntity> => {
            const res = await api.post<TEntity>(`${endpoint}`, data);
            return res.data;
        },

        update: async (id: number, data: TUpdate): Promise<TEntity> => {
            const res = await api.put<TEntity>(`${endpoint}/${id}`, data);
            return res.data;
        },

        delete: async (id: number): Promise<TEntity> => {
            const res = await api.delete<TEntity>(`${endpoint}/${id}`);
            return res.data;
        },
    };
};
