//shared/types/
export interface Office {
    Id_cabinet: number;
    Capacity?: number | null;
}

export type CreateOffice = Omit<Office, ''>;
export type UpdateOffice = Partial<CreateOffice>;