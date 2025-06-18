import {Button, Container, Form, Alert} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCreateTeacher } from "@/entities/teacher/model/useTeacherQuery.ts";
import {CreateTeacher} from "@/shared/types/teacher.ts";
import {ERouterPath} from "@/shared/enum/route";
import PageHeader from "@components/page_header";
//import {CreateTeacher} from "@/shared/types/teacher.ts"; // Функция мутации
import { FormInput } from "@components/input";
import {usePosts} from "@/entities/other/post/usePost.ts";
import {useGetAllOffices} from "@/entities/office/useOfficeQuery.ts";
import {FormSelect} from "@components/input/select.tsx";

const schema = yup.object({
    Surname: yup.string().required("Фамилия обязательна"),
    Name: yup.string().required("Имя обязательно"),
    Middle_name: yup.string().nullable().notRequired(),
    Date_of_birth: yup.date().required("Дата рождения обязательна"),
    Type_of_bid: yup.number().typeError("Ставка обязательна").required("Ставка обязательна"),
    Id_post: yup.number().typeError("Выберите должность").required("Должность обязательна"),
    Id_cabinet: yup.number().nullable().notRequired(),
});

type CreateTeacherSchema = yup.InferType<typeof schema>;

const TeacherCreatePage  = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const { data: posts = [] } = usePosts();
    const { data: offices = [] } = useGetAllOffices();

    const { mutate: addTeacher, isSuccess, error } = useCreateTeacher();

    const onSubmit = (data: CreateTeacherSchema) => {
        const teacher: CreateTeacher = {
            Surname: data.Surname,
            Name: data.Name,
            Middle_name: data.Middle_name,
            Date_of_birth: data.Date_of_birth.toISOString().split("T")[0], // если сервер ждёт строку
            Type_of_bid: data.Type_of_bid,
            Id_post: data.Id_post,
            Id_cabinet: data.Id_cabinet ?? null, // если необязательное — можно опустить
        };
        addTeacher(teacher);
    };

    return (
        <Container className="py-3">
            <PageHeader HeaderText={`Добавление преподавателя`} href={ERouterPath.TEACHER}/>
            <Form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column align-items-center p-2 gap-2">
                <div className="d-flex w-100 gap-5">
                    <div className="d-flex flex-column w-100">
                        <FormInput
                            name={"Surname"}
                            label="Фамилия"
                            register={register}
                            error={errors.Surname} />
                        <FormInput
                            name={"Name"}
                            label="Имя"
                            register={register}
                            error={errors.Name} />
                        <FormInput
                            name={"Middle_name"}
                            label="Отчество"
                            register={register}
                            error={errors.Middle_name} />
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
                        <FormInput
                            type={"date"}
                            name={"Date_of_birth"}
                            label="Дата рождения"
                            register={register}
                            smInput={5}
                            error={errors.Date_of_birth}/>
                        <FormInput
                            smInput={5}
                            name={"Type_of_bid"}
                            label="Ставка"
                            register={register}
                            error={errors.Type_of_bid} />
                        <FormSelect
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

                <Button type="submit" variant="success" className="fw-semibold">
                    Добавить
                </Button>

                {isSuccess && <Alert variant="success" className="mt-3">Преподаватель добавлен!</Alert>}
                {error && <Alert variant="danger" className="mt-3">Ошибка при добавлении</Alert>}
            </Form>
        </Container>
    );
};

export default TeacherCreatePage;