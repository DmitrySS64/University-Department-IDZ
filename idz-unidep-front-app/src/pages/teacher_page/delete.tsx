import { useParams, useNavigate } from "react-router-dom";
import { useGetTeacher } from "@/entities/teacher/model/useTeacherQuery.ts";
import { useMutation } from "@tanstack/react-query";
import { teacherApi } from "@/entities/teacher/api";
import { ERouterPath } from "@/shared/enum/route";
import { useState } from "react";
import TeacherInfo from "@/entities/teacher/ui/Info.tsx";
import DeleteEntityPageLayout from "@/shared/layouts/DeleteEntityPageLayout.tsx";

const TeacherDeletePage = () => {
    const { id } = useParams();
    const numericId = Number(id);
    const navigate = useNavigate();

    const { data: teacher, isLoading, error } = useGetTeacher(numericId);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const mutation = useMutation({
        mutationFn: teacherApi.delete,
        onSuccess: () => navigate(ERouterPath.TEACHER),
        onError: (error: any) => {
            const msg = error?.response?.data?.detail ?? "Ошибка удаления";
            setErrorMessage(msg);
        },
    });

    const handleDelete = () => {
        setErrorMessage(null);
        mutation.mutate(numericId);
    };

    return (
        <DeleteEntityPageLayout
            isLoading={isLoading}
            error={!!error}
            entity={teacher}
            entityName={
                teacher ? `${teacher.Surname} ${teacher.Name} ${teacher.Middle_name}` : ""
            }
            entityLabel="Преподаватель"
            onDelete={handleDelete}
            errorMessage={errorMessage}
            onBackHref={`${ERouterPath.TEACHER}/${numericId}`}
            InfoComponent={<TeacherInfo teacher={teacher} />}
        />
    );
};

export default TeacherDeletePage;
