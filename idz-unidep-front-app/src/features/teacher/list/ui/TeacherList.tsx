// features/teacher/list/ui/TeacherList.tsx
import { useTeachers } from '@/entities/teacher/model/useTeacherQuery';
import { TeacherCardFull } from '@/entities/teacher/ui/TeacherCardFull.tsx';
import {usePosts} from "@/entities/other/post/usePost.ts";
import {useEffect, useState} from "react";
import "@/pages/teacher_page/list.scss"

type Props = {
    search?: string;
    sortBy?: string;
    sortDirection: 'asc' | 'desc';
    limit?: number;
    page?: number;
}

export const TeacherList = ({
    search, sortBy, sortDirection = 'asc', limit = 10, page = 1,
}: Props) => {
    const offset = (page - 1) * limit;
    const [showContent, setShowContent] = useState(false);

    const { data, isLoading, error } = useTeachers({
        search,
        sort_by:sortBy,
        sort_direction: sortDirection,
        limit,
        offset,
    });

    const { data: posts = [] } = usePosts();

    useEffect(() => {
        if (!isLoading) {
            // чуть задержим, чтобы DOM обновился
            //const timeout = setTimeout(() => setShowContent(true), 500);
            //return () => clearTimeout(timeout);
            setShowContent(true);
        } else {
            setShowContent(false);
        }
    }, [isLoading]);

    if (error) {
        return <p>Ошибка при загрузке данных {error.message}</p>;
    }

    return (
        <div className={`d-flex flex-column gap-2 entity-list ${showContent ? 'fade-in' : 'fade-out'}`}>
            {data?.map((teacher) => (
                <TeacherCardFull
                    key={teacher.Id_teacher}
                    teacher={teacher}
                    post={posts.find((post) => post.Id_post === teacher.Id_post)?.Title ?? ""}
                />
                )
            )}
        </div>
    );
};
