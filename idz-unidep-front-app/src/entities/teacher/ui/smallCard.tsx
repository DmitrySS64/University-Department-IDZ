// entities/teacher/ui/TeacherCard.tsx
import { Teacher } from '@/shared/types/teacher';
import '@/shared/components/card/index.scss'
import {ERouterPath} from "@/shared/enum/route";
import {Button} from "react-bootstrap";
import {useState} from "react";

type Props = {
    teacher: Teacher;
    onDelete: (id: number) => void;
};

export const TeacherCard = ({ teacher, onDelete }: Props) => {
    const [hovered, setHovered] = useState<boolean>(false);
    return (
        <a href={`${ERouterPath.TEACHER}/${teacher.Id_teacher}`} style={{ textDecoration: 'none' }}
           onMouseEnter={() => setHovered(true)}
           onMouseLeave={() => setHovered(false)}>
            <div className="card d-flex flex-row gap-2 card-style border-0 align-items-center">
                <h5 className="m-0 p-0">{teacher.Surname} {teacher.Name} {teacher.Middle_name}</h5>

                { hovered && onDelete && (
                    <Button
                        className="ms-auto"
                        variant="danger"
                        onClick={(e) => {
                            e.preventDefault(); // чтобы не переходило по ссылке
                            onDelete(teacher.Id_teacher);
                        }}
                    >
                        Удалить
                    </Button>
                )}
            </div>
        </a>

    );
};
