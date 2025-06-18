import {Container, Tabs, Tab, Spinner, Alert, Button} from "react-bootstrap";
import {useGetTeacher} from "@/entities/teacher/model/useTeacherQuery.ts";
import {useNavigate, useParams} from "react-router-dom";
import TeacherInfo from "@/entities/teacher/ui/Info.tsx";
import {ERouterPath} from "@/shared/enum/route";
import PageHeader from "@components/page_header";
import DisciplinesForTeacher from "@/features/teacher/disciplines.tsx";



const TeacherDetailsPage  = () => {
    const { id } = useParams();
    const numericId = Number(id);
    const nav = useNavigate();

    const { data: teacher, isLoading, error } = useGetTeacher(numericId);

    if (isLoading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">Ошибка при загрузке</Alert>;
    if (!teacher) return <Alert variant="warning">Преподаватель не найден</Alert>;

    return (
        <Container className="py-3">
            <PageHeader HeaderText={`${teacher.Surname} ${teacher.Name} ${teacher.Middle_name}`} href={ERouterPath.TEACHER}/>
            <Tabs defaultActiveKey="info" id="teacher-tabs" className="mb-3">
                <Tab eventKey="info" title="Инфо">
                    <TeacherInfo teacher={teacher} />
                    <Button className="ms-2" href={`${ERouterPath.TEACHER}/${ERouterPath.EDIT}/${id}`}>
                        Редактировать
                    </Button>
                </Tab>
                <Tab eventKey="disciplines" title="Дисциплины" >
                    <DisciplinesForTeacher/>
                </Tab>
                <Tab eventKey="extra" title="Доп. деятельность" disabled />
                <Tab eventKey="plan" title="Учебный план" disabled />
            </Tabs>
            <div className="py-2 mt-2 d-flex justify-content-center">
                <Button variant="danger" onClick={()=>nav(`${ERouterPath.TEACHER}/${ERouterPath.DELETE}/${numericId}`)}>
                    Удалить преподавателя
                </Button>
            </div>
        </Container>
    );
};

export default TeacherDetailsPage;