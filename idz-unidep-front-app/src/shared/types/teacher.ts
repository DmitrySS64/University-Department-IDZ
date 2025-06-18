//shared/types/
export interface Teacher {
    Id_teacher: number;
    Name: string;
    Surname: string;
    Middle_name?: string | null;
    Date_of_birth: string;
    Type_of_bid: number;
    Id_cabinet?: number | null;
    Id_post: number;
}

export type CreateTeacher = Omit<Teacher, 'Id_teacher'>;
export type UpdateTeacher = Partial<CreateTeacher>;