import {Container, Tabs, Tab, Spinner, Alert, Button} from "react-bootstrap";
import {useGetDiscipline} from "@/entities/discipline/model/useDisciplineQuery.ts";
import { useParams} from "react-router-dom";
import DisciplineInfo from "@/entities/discipline/ui/info.tsx";
import {ERouterPath} from "@/shared/enum/route";
import PageHeader from "@components/page_header";
import TeachersForDiscipline from "@/features/discipline/teachers.tsx";


const DisciplineDetailsPage  = () => {
    const { id } = useParams();
    const numericId = Number(id);

    const { data: discipline, isLoading, error } = useGetDiscipline(numericId);

    if (isLoading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">Ошибка при загрузке</Alert>;
    if (!discipline) return <Alert variant="warning">Дисциплина не найдена</Alert>;

    return (
        <Container className="py-3">
            <PageHeader HeaderText={`Информация о дисциплине "${discipline.Name}"`} href={ERouterPath.DISCIPLINES}/>
            <Tabs defaultActiveKey="info" id="teacher-tabs" className="mb-3">
                <Tab eventKey="info" title="Информация">
                    <DisciplineInfo item={discipline} />
                    <Button className="ms-2">
                        Редактировать
                    </Button>
                </Tab>
                <Tab eventKey="teachers" title="Преподаватели">
                    <TeachersForDiscipline/>
                </Tab>
                <Tab eventKey="plan" title="Учебный план" disabled />
            </Tabs>
            <div className="py-2 d-flex justify-content-center">
                <Button variant="danger">
                    Удалить дисциплину
                </Button>
            </div>
        </Container>
    );
};

export default DisciplineDetailsPage;