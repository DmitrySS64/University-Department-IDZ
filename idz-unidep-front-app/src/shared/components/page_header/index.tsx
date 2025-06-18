import {Button} from "react-bootstrap";

type Props = {
    HeaderText: string;
    href: string;
    buttonText?: string;
}
const PageHeader = ({HeaderText, href, buttonText = "Назад к списку"}: Props) => (
    <div className="d-flex mb-3">
        <div className="d-flex w-100">
            <Button variant="outline-secondary"
                    size="sm"
                    className="fw-semibold align-content-center"
                    href={href}>
                <i className="fa fa-arrow-left me-2"/>
                {buttonText}
            </Button>
        </div>
        <h3 className="text-nowrap">{HeaderText}</h3>
        <div className="w-100"></div>
    </div>
)
export default PageHeader;