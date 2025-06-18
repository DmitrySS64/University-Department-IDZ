import {Button, Container, Form, Alert, Spinner} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {useGetTeacher, useUpdateTeacher} from "@/entities/teacher/model/useTeacherQuery.ts";
import { UpdateTeacher } from "@/shared/types/teacher.ts";
import { ERouterPath } from "@/shared/enum/route";
import PageHeader from "@components/page_header";
import { FormInput } from "@components/input";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect} from "react";
import {usePosts} from "@/entities/other/post/usePost.ts";
import {FormSelect} from "@components/input/select.tsx";
import {useGetAllOffices} from "@/entities/office/useOfficeQuery.ts";

const schema = yup.object({
    Surname: yup.string().required("Фамилия обязательна"),
    Name: yup.string().required("Имя обязательно"),
    Middle_name: yup.string().nullable().notRequired(),
    Date_of_birth: yup.string().required("Дата рождения обязательна"),
    Type_of_bid: yup.number().typeError("Ставка обязательна").required("Ставка обязательна"),
    Id_post: yup.number().typeError("Выберите должность").required("Должность обязательна"),
    Id_cabinet: yup.number().nullable().notRequired(),
});

//const formatDate = (isoDate: string | Date): string => {
//    const date = new Date(isoDate);
//    const yyyy = date.getFullYear();
//    const mm = String(date.getMonth() + 1).padStart(2, "0");
//    const dd = String(date.getDate()).padStart(2, "0");
//    return `${yyyy}-${mm}-${dd}`;
//};


type EditTeacherSchema = yup.InferType<typeof schema>;

const TeacherEditPage = () => {
    const { id } = useParams();
    const numericId = Number(id);
    const navigate = useNavigate();

    const { data: teacher, isLoading } = useGetTeacher(numericId);
    const { data: posts = [] } = usePosts();
    const { data: offices = [] } = useGetAllOffices();
    //useQuery<Teacher>({
    //    queryKey: ['teacher', numericId],
    //    queryFn: () => teacherApi.getById(numericId),
    //    enabled: !isNaN(numericId),
    //});

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
    });

    const { mutate: editTeacher, isSuccess, error } = useUpdateTeacher();

    const onSubmit = (data: EditTeacherSchema) => {
        const updateData: UpdateTeacher = {
            Surname: data.Surname,
            Name: data.Name,
            Middle_name: data.Middle_name,
            Date_of_birth: data.Date_of_birth.split("T")[0],
            Type_of_bid: data.Type_of_bid,
            Id_post: data.Id_post,
            Id_cabinet: data.Id_cabinet ?? null,
        };
        editTeacher(
            { id: numericId, data: updateData },
            { onSuccess: () => navigate(`${ERouterPath.TEACHER}/${numericId}`), }
        );
    };

    // Установка данных в форму после загрузки
    useEffect(() => {
        if (teacher && posts.length > 0 && offices.length > 0) {
            reset({
                Surname: teacher.Surname,
                Name: teacher.Name,
                Middle_name: teacher.Middle_name ?? "",
                Date_of_birth: teacher.Date_of_birth.split("T")[0],
                Type_of_bid: teacher.Type_of_bid,
                Id_post: teacher.Id_post,
                Id_cabinet: teacher.Id_cabinet ?? undefined,
            });
        }
    }, [teacher, reset, posts, offices]);

    if (isLoading) {
        return (
            <Container className="py-3 text-center">
                <Spinner animation="border" />
            </Container>
        );
    }

    return (
        <Container className="py-3">
            <PageHeader HeaderText={`Редактирование преподавателя`} href={`${ERouterPath.TEACHER}/${numericId}`} />
            <Form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column align-items-center p-2 gap-2">
                <div className="d-flex w-100 gap-5">
                    <div className="d-flex flex-column w-100">
                        <FormInput name="Surname" label="Фамилия" register={register} error={errors.Surname} />
                        <FormInput name="Name" label="Имя" register={register} error={errors.Name} />
                        <FormInput name="Middle_name" label="Отчество" register={register} error={errors.Middle_name} />
                        <FormSelect
                            smInput={5}
                            name="Id_cabinet"
                            label="Кабинет"
                            register={register}
                            error={errors.Id_cabinet}
                            options={offices.map(office => ({
                                value: office.Id_cabinet,
                                label: office.Id_cabinet.toString(),
                            }))}
                            placeholder="Выберите кабинет"
                        />
                    </div>
                    <div className="d-flex flex-column w-100">
                        <FormInput type="date" name="Date_of_birth" label="Дата рождения" register={register} smInput={5} error={errors.Date_of_birth} />
                        <FormInput smInput={5} name="Type_of_bid" label="Ставка" register={register} error={errors.Type_of_bid} />
                        <FormSelect
                            smInput={5}
                            name="Id_post"
                            label="Должность"
                            register={register}
                            error={errors.Id_post}
                            options={posts.map(post => ({
                                value: post.Id_post,
                                label: post.Title,
                            }))}
                            placeholder="Выберите должность"
                        />
                    </div>
                </div>

                <Button type="submit" variant="primary" className="fw-semibold">
                    Сохранить изменения
                </Button>

                {isSuccess && <Alert variant="success" className="mt-3">Преподаватель успешно обновлён!</Alert>}
                {error && <Alert variant="danger" className="mt-3">Ошибка при обновлении</Alert>}
            </Form>
        </Container>
    );
};

export default TeacherEditPage;
