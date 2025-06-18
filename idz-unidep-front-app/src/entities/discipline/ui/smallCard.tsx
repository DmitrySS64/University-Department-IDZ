// entities/teacher/ui/TeacherCard.tsx
import { Discipline } from '@/shared/types/discipline';
import '@/shared/components/card/index.scss'
import {ERouterPath} from "@/shared/enum/route";
import {Button} from "react-bootstrap";
import {useState} from "react";

type Props = {
    item: Discipline;
    onDelete: (id: number) => void;
};

export const DisciplineCard = ({ item, onDelete }: Props) => {
    const [hovered, setHovered] = useState<boolean>(false);
    return (
        <a href={`${ERouterPath.DISCIPLINES}/${item.Id_discipline}`} style={{ textDecoration: 'none' }}
           onMouseEnter={() => setHovered(true)}
           onMouseLeave={() => setHovered(false)}
        >
            <div className="card d-flex flex-row gap-2 card-style border-0 align-items-center">
                <div className="d-flex flex-column gap-2">
                    <h5 className="m-0 p-0">{item.Name}</h5>
                    <p>
                        {item.Description}
                    </p>
                </div>
                { hovered && onDelete && (
                    <Button
                        className="ms-auto"
                        variant="danger"
                        onClick={(e) => {
                            e.preventDefault(); // чтобы не переходило по ссылке
                            onDelete(item.Id_discipline);
                        }}
                    >
                        Удалить
                    </Button>
                )}
            </div>
        </a>
    );
};
