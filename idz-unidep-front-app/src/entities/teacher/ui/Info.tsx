import {Teacher} from "@/shared/types/teacher.ts";

type Props = {
    teacher?: Teacher;
}

const TeacherInfo = ({teacher:info}: Props) => {
    if (!info) return <div>Информация отсутствует</div>;
    return(
        <div className="d-flex flex-column gap-2 w-100 p-2">
            <p>{info.Surname} {info.Name} {info.Middle_name}</p>
            <div className="d-flex">
                <div className="d-flex flex-column w-50">
                    <p>Должность: {info.Id_post}</p>
                    <p>Кабинет: {info.Id_cabinet}</p>
                </div>
                <div className="d-flex flex-column w-50">
                    <p>Дата рождения: {info.Date_of_birth}</p>
                    <p>Ставка: {info.Type_of_bid}</p>
                </div>
            </div>
        </div>
    )
}
export default TeacherInfo;