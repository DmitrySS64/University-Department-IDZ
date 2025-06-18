//shared/types/
export interface Discipline {
    Id_discipline: number;
    Name: string;
    Description?: string | null;
}

export type CreateDiscipline = Omit<Discipline, 'Id_discipline'>;
export type UpdateDiscipline = Partial<CreateDiscipline>;