import { createCrudApi } from '@/shared/api/crudFactory';
import * as Entity from '@/shared/types/office';
import { ERouterApiPath } from '@/shared/enum/route/api';

export const officeApi = createCrudApi<Entity.CreateOffice, Entity.UpdateOffice, Entity.Office>({
    endpoint: ERouterApiPath.OFFICES,
});


