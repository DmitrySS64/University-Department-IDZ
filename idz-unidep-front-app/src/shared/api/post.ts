import {api} from "@/shared/api/base.ts";
import {Post} from "@/shared/types/post.ts";
import {ERouterApiPath} from "@/shared/enum/route/api.ts";


export const postApi = {
    getAll: async (): Promise<Post[]> => {
        const res = await api.get<Post[]>(ERouterApiPath.POSTS);
        return res.data;
    }
};
