import { useParams } from "react-router-dom";
import { useAddTeacherToDiscipline, useDeleteTeacherToDiscipline, useGetDisciplineTeachers } from "@/entities/discipline/model/useDisciplineQuery";
import { Alert, Button, Spinner } from "react-bootstrap";
import { TeacherCard } from "@/entities/teacher/ui/smallCard.tsx";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Select from "react-select";
import { useTeachers } from "@/entities/teacher/model/useTeacherQuery.ts";
import { useDebounce } from "@/shared/hooks/useDebounce"; // путь зависит от структуры проекта
import { SingleValue } from "react-select";

type TeacherOption = {
    value: number;
    label: string;
};

const TeachersForDiscipline = () => {
    const { id } = useParams();
    const numericId = Number(id);
    const queryClient = useQueryClient();

    const { data: teachers, isLoading, error } = useGetDisciplineTeachers(numericId);

    // состояние для поиска
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500); // задержка 500 мс

    // получаем всех преподавателей с учетом поиска
    const { data: allTeachers } = useTeachers({ search: debouncedSearch, limit: 20 });

    const { mutate: deleteDiscipline } = useDeleteTeacherToDiscipline();
    const { mutate: addDiscipline } = useAddTeacherToDiscipline();

    const availableTeachers = allTeachers?.filter(
        t => !teachers?.some(existing => existing.Id_teacher === t.Id_teacher)
    ) ?? [];

    const [selectedOption, setSelectedOption] = useState<SingleValue<TeacherOption>>(null);

    const handleAdd = () => {
        if (!selectedOption) return;
        addDiscipline({ teacher_id: selectedOption.value, discipline_id: numericId });
        setSelectedOption(null);
        setSearch(""); // сброс ввода
    };

    if (isLoading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">Ошибка при загрузке</Alert>;
    if (!teachers) return <Alert variant="warning">Преподаватели не найдены</Alert>;

    return (
        <div className="d-flex flex-column gap-3">
            <div className="d-flex flex-column gap-3">
                {teachers.map(teacher => (
                    <TeacherCard
                        key={teacher.Id_teacher}
                        teacher={teacher}
                        onDelete={() =>
                            deleteDiscipline(
                                { teacher_id: teacher.Id_teacher, discipline_id: numericId },
                                {
                                    onSuccess: () => {
                                        queryClient.invalidateQueries({
                                            queryKey: ['disciplineTeachers', numericId],
                                        });
                                    }
                                }
                            )
                        }
                    />
                ))}
            </div>

            <div className="w-50 d-flex align-items-center gap-2">
                <Select
                    placeholder="Выберите преподавателя"
                    isClearable
                    options={availableTeachers.map(teacher => ({
                        value: teacher.Id_teacher,
                        label: `${teacher.Surname} ${teacher.Name} ${teacher.Middle_name}`
                    }))}
                    value={selectedOption}
                    onChange={(newValue) => setSelectedOption(newValue)}
                    onInputChange={(inputValue) => setSearch(inputValue)}
                    noOptionsMessage={() => "Не найдено"}
                    className="flex-grow-1"
                />
                <Button onClick={handleAdd} disabled={!selectedOption}>Добавить</Button>
            </div>
        </div>
    );
};

export default TeachersForDiscipline;
