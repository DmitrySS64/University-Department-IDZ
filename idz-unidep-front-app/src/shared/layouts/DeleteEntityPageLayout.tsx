// shared/ui/DeleteEntityPageLayout.tsx

import { Container, Spinner, Alert, Button, Card } from "react-bootstrap";
import PageHeader from "@components/page_header";

interface DeleteEntityPageLayoutProps {
    isLoading: boolean;
    error: boolean;
    entity: any;
    entityName: string;
    entityLabel: string;
    onDelete: () => void;
    errorMessage?: string | null;
    onBackHref: string;
    InfoComponent: React.ReactNode;
}

const DeleteEntityPageLayout = ({
                                    isLoading,
                                    error,
                                    entity,
                                    entityName,
                                    entityLabel,
                                    onDelete,
                                    errorMessage,
                                    onBackHref,
                                    InfoComponent,
                                }: DeleteEntityPageLayoutProps) => {
    if (isLoading)
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" />
            </Container>
        );

    if (error)
        return (
            <Container className="py-5">
                <Alert variant="danger">Ошибка при загрузке</Alert>
            </Container>
        );

    if (!entity)
        return (
            <Container className="py-5">
                <Alert variant="warning">{entityLabel} не найден(а)</Alert>
            </Container>
        );

    return (
        <Container className="py-4 text-center">
            <PageHeader
                HeaderText={`Удаление ${entityLabel.toLowerCase()} "${entityName}"`}
                buttonText={`Назад к записи`}
                href={onBackHref}
            />

            <Card className="mb-4 shadow-sm text-start">
                <Card.Body>{InfoComponent}</Card.Body>
            </Card>

            {errorMessage && (
                <Alert variant="danger" className="mb-4">
                    {errorMessage}
                </Alert>
            )}
            <div className="fs-5 fw-semibold text-danger mb-3">
                Вы точно хотите удалить {entityLabel.toLowerCase()}?
            </div>
            <Button variant="danger" onClick={onDelete}>
                Удалить {entityLabel.toLowerCase()}
            </Button>
        </Container>
    );
};

export default DeleteEntityPageLayout;
