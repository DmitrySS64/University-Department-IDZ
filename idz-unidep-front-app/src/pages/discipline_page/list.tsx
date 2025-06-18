import {DisciplinesList} from "@/features/discipline/list/ui/disciplineList";
import {ERouterPath} from "@/shared/enum/route";
import ListPageLayout from "@/shared/layouts/ListPageLayout.tsx";


const DisciplinesPage = () => {
    return (
        <ListPageLayout
            searchPlaceholder="Поиск дисциплины"
            sortOptions={[
                {Name: "Название", Value: "Name"},
            ]}
            defaultSortBy="Name"
            createPath={`${ERouterPath.DISCIPLINES}/${ERouterPath.CREATE}`}
            renderList={({search, sortBy, sortDirection, limit, page}) => (
                <DisciplinesList
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

export default DisciplinesPage;