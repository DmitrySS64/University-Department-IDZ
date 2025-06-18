import { createCrudApi } from '@/shared/api/crudFactory';
import { Discipline, CreateDiscipline, UpdateDiscipline } from '@/shared/types/discipline';
import { ERouterApiPath } from '@/shared/enum/route/api';

export const disciplineApi = createCrudApi<CreateDiscipline, UpdateDiscipline, Discipline>({
    endpoint: ERouterApiPath.DISCIPLINES,
});


