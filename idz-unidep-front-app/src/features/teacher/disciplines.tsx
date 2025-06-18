import {useParams} from "react-router-dom";
import {
    useAddDisciplineToTeacher,
    useDeleteDisciplineToTeacher,
    useGetTeacherDisciplines
} from "@/entities/teacher/model/useTeacherQuery.ts";
import {Alert, Button, Form, Spinner} from "react-bootstrap";
import {DisciplineCard} from "@/entities/discipline/ui/smallCard.tsx";
import {useForm} from "react-hook-form";
import {useGetAllDisciplines} from "@/entities/discipline/model/useDisciplineQuery.ts";
import { useQueryClient } from "@tanstack/react-query";

const DisciplinesForTeacher = () => {
    const { id } = useParams();
    const numericId = Number(id);
    const { register, handleSubmit, reset } = useForm();
    const queryClient = useQueryClient();

    const { data: disciplines, isLoading, error} = useGetTeacherDisciplines(numericId);
    const { data: allDisciplines } = useGetAllDisciplines();

    const { mutate: deleteDiscipline } = useDeleteDisciplineToTeacher();
    const { mutate: addDiscipline } = useAddDisciplineToTeacher();

    const onSubmit = (data: any) => {
        const disciplineId = Number(data.disciplineId);
        if (!disciplineId) return; // защита от пустого выбора
        addDiscipline({ teacher_id: numericId, discipline_id: disciplineId });
        reset(); // сброс формы
    };


    if (isLoading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">Ошибка при загрузке</Alert>;
    if (!disciplines) return <Alert variant="warning">Дисциплины не найдены</Alert>;
    if (!Array.isArray(disciplines)) return <Alert variant="danger">Неверный формат данных</Alert>;

    const availableDisciplines = allDisciplines?.filter(
        d => !disciplines.some(existing => existing.Id_discipline === d.Id_discipline)
    ) ?? [];

    return(
        <div className="d-flex flex-column gap-3">
            <div className="d-flex flex-column gap-3">
                {disciplines.map(discipline => (
                    <DisciplineCard key={discipline.Id_discipline} item={discipline} onDelete={() => {
                        deleteDiscipline(
                            {teacher_id: numericId, discipline_id: discipline.Id_discipline},
                            {
                                onSuccess: () => {
                                    queryClient.invalidateQueries({
                                        queryKey: ['teacherDisciplines', numericId],
                                    });
                                }
                            }
                        )
                    }}/>
                ))}
            </div>
            <div className="w-50">
                <Form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-row gap-3 align-items-center">
                    <Form.Select {...register("disciplineId")} className="w-50">
                        <option value="">Выберите дисциплину</option>
                        {availableDisciplines.map((discipline) => (
                            <option key={discipline.Id_discipline} value={discipline.Id_discipline}>
                                {discipline.Name}
                            </option>
                        ))}
                    </Form.Select>
                    <Button type="submit" className="text-nowrap">
                        Добавить дисципину
                    </Button>
                </Form>
            </div>
        </div>
    )
}

            export default DisciplinesForTeacher;