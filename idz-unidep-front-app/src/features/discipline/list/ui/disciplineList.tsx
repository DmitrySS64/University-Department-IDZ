// features/discipline/list/ui/disciplineList.tsx
import { useDisciplines } from '@/entities/discipline/model/useDisciplineQuery';
import { DisciplineCardFull } from '@/entities/discipline/ui/fullCard';
import "@/pages/teacher_page/list.scss"
import {useEffect, useState} from "react";

type Props = {
    search?: string;
    sortBy?: string;
    sortDirection: 'asc' | 'desc';
    limit?: number;
    page?: number;
}

export const DisciplinesList = ({
                                search, sortBy, sortDirection = 'asc', limit = 10, page = 1,
                            }: Props) => {
    const offset = (page - 1) * limit;
    const [showContent, setShowContent] = useState(false);

    const { data, isLoading, error } = useDisciplines({
        search,
        sort_by:sortBy,
        sort_direction: sortDirection,
        limit,
        offset,
    });

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
            {data?.map((item) => (
                <DisciplineCardFull
                    key={item.Id_discipline}
                    item={item}
                />
            ))}
        </div>
    );
};
