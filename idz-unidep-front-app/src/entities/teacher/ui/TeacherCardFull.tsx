// entities/teacher/ui/TeacherCard.tsx
import { Teacher } from '@/shared/types/teacher';
import '@/shared/components/card/index.scss'
import {ERouterPath} from "@/shared/enum/route";

type Props = {
    key: number;
    teacher: Teacher;
    post?: string;
};

export const TeacherCardFull = ({ teacher, post }: Props) => {
    return (
        <a href={`${ERouterPath.TEACHER}/${teacher.Id_teacher}`} style={{ textDecoration: 'none' }}>
            <div className="card d-flex flex-column gap-2 card-style border-0">
                <h5 className="m-0 p-0">{teacher.Surname} {teacher.Name} {teacher.Middle_name}</h5>
                <div className="row row-cols-4 p-0 m-0">
                    <div className="col p-0">
                    <span>
                        Ставка: {teacher.Type_of_bid}
                    </span>
                    </div>
                    <div className="col p-0">
                    <span>
                        Год рождения: {teacher.Date_of_birth}
                    </span>
                    </div>
                    <div className="col p-0">
                    <span>
                        Кабинет: {teacher.Id_cabinet}
                    </span>
                    </div>
                    <div className="col p-0">
                    <span>
                        Должность: {post}
                    </span>
                    </div>
                </div>
            </div>
        </a>

    );
};
