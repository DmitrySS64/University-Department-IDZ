// hooks/usePostsQuery.ts
import { useQuery } from "@tanstack/react-query";
import { postApi } from "@/shared/api/post";
import { Post } from "@/shared/types/post.ts";

export const usePosts = () => useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: postApi.getAll,
});
