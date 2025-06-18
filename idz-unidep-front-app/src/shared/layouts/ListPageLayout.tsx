import {ReactNode, useState} from "react";
import {Button, ButtonGroup, Container, Form, InputGroup} from "react-bootstrap";
import { useListSettings } from "@/shared/context/ListSettingsContext";

type Option = {
    Name: string;
    Value: string;
};

type Props = {
    title?: string;
    searchPlaceholder?: string;
    sortOptions: Option[];
    defaultSortBy?: string;
    createPath: string;
    renderList: (params: {
        search: string;
        sortBy?: string;
        sortDirection: 'asc' | 'desc';
        limit: number;
        page: number;
    }) => ReactNode;
};

const ListPageLayout = ({
                            title = "",
                            searchPlaceholder = "Поиск",
                            sortOptions,
                            defaultSortBy,
                            createPath,
                            renderList,
                        }: Props) => {
    const [searchValue, setSearchValue] = useState('');
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState<string | undefined>(defaultSortBy);
    const [page, setPage] = useState(1);
    const {
        limit, setLimit,
        sortDirection, setSortDirection
    } = useListSettings();

    const handleSearch = () => setSearch(searchValue);



    return (
        <div className="d-flex flex-column w-100 h-100">
            <title>{title}</title>
            <div className="d-flex flex-column w-100" style={{flex: '1 1 auto', overflow: 'hidden'}}>
                <div className="py-2 d-flex justify-content-between">
                    <InputGroup className="w-25">
                        <Form.Control
                            placeholder={searchPlaceholder}
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                        <Button variant="outline-primary" onClick={handleSearch} className="fw-semibold">
                            Поиск
                        </Button>
                    </InputGroup>
                    <Button
                        variant="outline-success"
                        className="fw-semibold"
                        href={createPath}
                    >
                        <i className="fa fa-plus me-1"/>
                        Добавить
                    </Button>
                </div>
                <div className="py-2 d-flex justify-content-between">
                    <div className="d-flex gap-3">
                        <p>Сортировать по:</p>
                        <Form className="d-flex gap-3">
                            {sortOptions.map((option) => (
                                <Form.Check
                                    key={option.Value}
                                    type="radio"
                                    name="sort"
                                    label={option.Name}
                                    id={`sort-${option.Value}`}
                                    checked={sortBy === option.Value}
                                    onChange={() => setSortBy(option.Value)}
                                />
                            ))}
                        </Form>
                    </div>
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
                        className="fw-semibold"
                    >
                        {sortDirection === 'asc' ? (
                            <>
                                <i className="fa fa-arrow-up me-1"/>
                                По возрастанию
                            </>
                        ) : (
                            <>
                                <i className="fa fa-arrow-down me-1"/>
                                По убыванию
                            </>
                        )}
                    </Button>
                </div>
                <Container style={{flex: "1 1 auto", overflowY: "auto"}}>
                    {renderList({search, sortBy, sortDirection, limit, page})}
                </Container>
            </div>

            <div
                className="d-flex justify-content-end align-items-baseline gap-3 mt-auto py-4 text-center"
                style={{fontSize: '16px', color: '--color-grey-500', fontWeight: '400'}}
            >
                Записей на страницу
                <Form.Select
                    aria-label="Select limit"
                    style={{width: "70px"}}
                    value={limit}
                    onChange={(e) => setLimit(Number(e.target.value))}
                >
                    {[5, 10, 15].map((n) => (
                        <option key={n} value={n}>
                            {n}
                        </option>
                    ))}
                </Form.Select>
                {(page - 1) * limit + 1}-{page * limit} of ?
                <ButtonGroup>
                    <Button
                        variant="outline-secondary"
                        disabled={page <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                        <i className="fa fa-chevron-left"/>
                    </Button>
                    <Button
                        variant="outline-secondary"
                        onClick={() => setPage((p) => p + 1)}
                    >
                        <i className="fa fa-chevron-right"/>
                    </Button>
                </ButtonGroup>
            </div>
        </div>
    );
};

export default ListPageLayout;
