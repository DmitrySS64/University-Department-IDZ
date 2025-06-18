// entities/teacher/ui/TeacherCard.tsx
import { Discipline } from '@/shared/types/discipline';
import '@/shared/components/card/index.scss'
import {ERouterPath} from "@/shared/enum/route";

type Props = {
    key: number;
    item: Discipline;
};

export const DisciplineCardFull = ({ item }: Props) => {
    return (
        <a href={`${ERouterPath.DISCIPLINES}/${item.Id_discipline}`} style={{ textDecoration: 'none' }}>
            <div className="card d-flex flex-column gap-2 card-style border-0">
                <h5 className="m-0 p-0">{item.Name}</h5>
                <p>
                    {item.Description}
                </p>
            </div>
        </a>

    );
};
