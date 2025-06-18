import {TeacherList} from "@/features/teacher/list/ui/TeacherList";
import ListPageLayout from "@/shared/layouts/ListPageLayout";
import {ERouterPath} from "@/shared/enum/route";

const TeachersPage = () => {
    return (
        <ListPageLayout
            searchPlaceholder="Поиск преподавателя"
            sortOptions={[
                {Name: "Фамилия", Value: "Surname"},
                {Name: "Имя", Value: "Name"},
                {Name: "Отчество", Value: "Middle_name"},
                {Name: "Ставка", Value: "Type_of_bid"},
                {Name: "Год рождения", Value: "Date_of_birth"},
            ]}
            defaultSortBy="Surname"
            createPath={`${ERouterPath.TEACHER}/${ERouterPath.CREATE}`}
            renderList={({search, sortBy, sortDirection, limit, page}) => (
                <TeacherList
                    search={search}
                    sortBy={sortBy}
                    sortDirection={sortDirection}
                    limit={limit}
                    page={page}
                />
            )}
        />
    );
};

export default TeachersPage;
