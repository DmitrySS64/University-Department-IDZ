// entities/teacher/api/
import { createCrudApi } from '@/shared/api/crudFactory';
import { Teacher, CreateTeacher, UpdateTeacher } from '@/shared/types/teacher';
import { ERouterApiPath } from '@/shared/enum/route/api';

export const teacherApi = createCrudApi<CreateTeacher, UpdateTeacher, Teacher>({
    endpoint: ERouterApiPath.TEACHERS,
});